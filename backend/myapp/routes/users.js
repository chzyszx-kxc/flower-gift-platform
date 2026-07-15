var express = require('express');
var router = express.Router();
var db = require('../db')

function getCurrentSeason(callback) {
  const sql = `
    SELECT
      id,
      season_code,
      season_name,
      DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
      DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
      DATE_FORMAT(subscribe_start_date, '%Y-%m-%d') AS subscribe_start_date,
      DATE_FORMAT(subscribe_end_date, '%Y-%m-%d') AS subscribe_end_date,
      DATE_FORMAT(DATE_SUB(subscribe_end_date, INTERVAL 1 DAY), '%Y-%m-%d') AS subscribe_last_date,
      CURDATE() >= subscribe_start_date AND CURDATE() < subscribe_end_date AS is_subscribe_window_open
    FROM tb_flower_season
    WHERE is_current = 1
    LIMIT 1
  `;

  db.query(sql, callback);
}

router.get('/', function(req, res, next) {
  const username = req.query.username;
  const sql = 'SELECT COUNT(*) AS count FROM tb_user WHERE username = ?';
  db.query(sql, [username], function(err, results) {
    if(err) {
      return res.status(500).send();
    }
    res.json({
      IsExists: results[0].count > 0
    });
  });
});

router.post('/', function(req, res, next) {
  const sql = 'INSERT INTO tb_user (username, password, email) VALUES (?,?,?)';
  db.query(sql, [
    req.body.username,
    req.body.password,
    req.body.email
  ], function(err, result) {
    if(err) {
      return res.status(500).send(result);
    }
    res.status(201).send();
  })
})

router.post('/login', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const sql = 'SELECT * FROM tb_user WHERE username = ?';
  db.query(sql, [username], function(err, result) {
    if (err) {
      return res.status(500).send();
    }
    if(result.length === 0) {
      return res.status(404).send();
    } else {
      if(result[0].password === password) {
        res.json({
          data: result
        })
      } else {
        return res.status(401).send();
      }
    }
  })
})

router.get('/delivery-info/:userid', function(req, res) {
  const userid = req.params.userid;
  const sql = `
    SELECT
      id,
      user_id,
      receiver_name,
      receiver_phone,
      address
    FROM tb_user_delivery_info
    WHERE user_id = ?
  `;

  // 从数据库读取用户默认配送信息；ProductDetails 预约时会先检查这里是否有地址。
  db.query(sql, [userid], function(err, result) {
    if (err) {
      return res.status(500).send();
    }

    res.json({
      data: result[0] || null
    });
  });
})

router.post('/delivery-info', function(req, res) {
  const sql = `
    INSERT INTO tb_user_delivery_info (user_id, receiver_name, receiver_phone, address)
    VALUES (?,?,?,?)
    ON DUPLICATE KEY UPDATE
      receiver_name = VALUES(receiver_name),
      receiver_phone = VALUES(receiver_phone),
      address = VALUES(address)
  `;

  // 保存或更新用户默认配送信息；user_id 有唯一约束，所以同一用户只保留一份默认地址。
  db.query(sql, [
    req.body.userid,
    req.body.receiver_name,
    req.body.receiver_phone,
    req.body.address
  ], function(err) {
    if (err) {
      return res.status(500).send();
    }

    res.status(201).send();
  })
})

router.get('/manager-info/:userid', function(req, res) {
  const userid = req.params.userid;

  getCurrentSeason(function(err, seasons) {
    if (err) {
      return res.status(500).send();
    }

    const currentSeason = seasons[0] || null;
    const sql = `
      SELECT
        u.id AS user_id,
        u.username,
        s.plan_type,
        d.selected_flower_id
      FROM tb_user u
      LEFT JOIN tb_subscription_delivery d ON d.user_id = u.id AND d.season_id = ?
      LEFT JOIN tb_subscription s ON s.id = d.subscription_id
      WHERE u.id = ?
      LIMIT 1
    `;

    // 左侧栏只需要三项：用户id、当前季订阅类型、当前季是否已经选择过花礼。
    db.query(sql, [currentSeason ? currentSeason.id : 0, userid], function(error, users) {
      if (error) {
        return res.status(500).send();
      }

      if (users.length === 0) {
        return res.status(404).send();
      }

      const user = users[0];
      const subscriptionStatus = user.plan_type === 'current_season'
          ? '当季订阅'
          : user.plan_type === 'four_season'
              ? '四季订阅'
              : '未订阅';

      res.json({
        data: {
          user_id: user.user_id,
          username: user.username,
          subscription_status: subscriptionStatus,
          current_season_reservation_status: user.selected_flower_id ? '已预约当季花礼' : '未预约当季花礼'
        }
      });
    });
  });
})

router.get('/subscription/current/:userid', function(req, res) {
  const userid = req.params.userid;

  getCurrentSeason(function(err, seasons) {
    if (err) {
      return res.status(500).send();
    }

    if (seasons.length === 0) {
      return res.json({
        data: {
          currentSeason: null,
          hasCurrentSeasonSubscription: false,
          planType: '',
          isSubscribeWindowOpen: false
        }
      });
    }

    const currentSeason = seasons[0];
    const sql = `
      SELECT
        d.id AS delivery_id,
        d.selected_flower_id,
        d.delivery_status,
        s.plan_type,
        info.id AS delivery_info_id
      FROM tb_subscription_delivery d
      INNER JOIN tb_subscription s ON d.subscription_id = s.id
      LEFT JOIN tb_user_delivery_info info ON d.user_id = info.user_id
      WHERE d.user_id = ?
        AND d.season_id = ?
      LIMIT 1
    `;

    // 查询用户当前季是否已有配送资格；这个结果决定 SubscribePage 显示按钮、订阅成功或关闭提示。
    db.query(sql, [userid, currentSeason.id], function(error, deliveries) {
      if (error) {
        return res.status(500).send();
      }

      const delivery = deliveries[0] || null;
      const isValidDelivery = !!delivery && (!!delivery.delivery_info_id || !!delivery.selected_flower_id);

      res.json({
        data: {
          currentSeason: currentSeason,
          hasCurrentSeasonSubscription: isValidDelivery,
          planType: isValidDelivery ? delivery.plan_type : '',
          delivery: delivery,
          isSubscribeWindowOpen: currentSeason.is_subscribe_window_open === 1
        }
      });
    });
  });
})

router.post('/subscription', function(req, res) {
  const userid = req.body.userid;
  const planType = req.body.plan_type;

  if (planType !== 'current_season' && planType !== 'four_season') {
    return res.status(400).json({
      message: '订阅类型不正确'
    });
  }

  getCurrentSeason(function(err, seasons) {
    if (err) {
      return res.status(500).send();
    }

    if (seasons.length === 0) {
      return res.status(404).json({
        message: '当前季不存在'
      });
    }

    const currentSeason = seasons[0];

    if (currentSeason.is_subscribe_window_open !== 1) {
      return res.status(403).json({
        message: '订阅名单已关闭，请静候下期花礼'
      });
    }

    const deliveryInfoSql = `
      SELECT id
      FROM tb_user_delivery_info
      WHERE user_id = ?
      LIMIT 1
    `;

    // 订阅前先检查默认配送信息；没有配送信息时不允许创建订阅和当前季配送资格。
    db.query(deliveryInfoSql, [userid], function(infoErr, deliveryInfos) {
      if (infoErr) {
        return res.status(500).send();
      }

      if (deliveryInfos.length === 0) {
        return res.status(404).json({
          message: '请先填写配送信息'
        });
      }

      const checkSql = `
      SELECT id
      FROM tb_subscription_delivery
      WHERE user_id = ?
        AND season_id = ?
      LIMIT 1
      `;

      // 再查当前季是否已经有配送资格；这能挡住当季重复订阅和四季订阅覆盖后的再次购买。
      db.query(checkSql, [userid, currentSeason.id], function(checkErr, deliveries) {
        if (checkErr) {
          return res.status(500).send();
        }

        if (deliveries.length > 0) {
          return res.status(409).json({
            message: '当前季已经订阅'
          });
        }

        db.beginTransaction(function(transactionErr) {
          if (transactionErr) {
            return res.status(500).send();
          }

          const totalSeasonCount = planType === 'four_season' ? 4 : 1;
          const subscriptionSql = `
          INSERT INTO tb_subscription
            (user_id, plan_type, start_season_id, total_season_count, allocated_season_count, subscription_status)
          VALUES
            (?,?,?,?,1,'active')
          `;

          // 创建订阅主记录：记录用户买的是当季订阅还是四季订阅，以及从哪个 season 开始。
          db.query(subscriptionSql, [
            userid,
            planType,
            currentSeason.id,
            totalSeasonCount
          ], function(insertErr, result) {
            if (insertErr) {
              return db.rollback(function() {
                res.status(500).send();
              });
            }

            const deliverySql = `
            INSERT INTO tb_subscription_delivery
              (subscription_id, user_id, season_id, delivery_status)
            VALUES
              (?,?,?,'pending_select')
            `;

            // 创建当前季配送资格；selected_flower_id 先为空，等用户在产品详情页三选一。
            db.query(deliverySql, [
              result.insertId,
              userid,
              currentSeason.id
            ], function(deliveryErr) {
              if (deliveryErr) {
                return db.rollback(function() {
                  res.status(500).send();
                });
              }

              db.commit(function(commitErr) {
                if (commitErr) {
                  return db.rollback(function() {
                    res.status(500).send();
                  });
                }

                res.status(201).json({
                  data: {
                    subscription_id: result.insertId,
                    plan_type: planType,
                    season_id: currentSeason.id
                  }
                });
              });
            });
          });
        });
      });
    });
  });
})

router.get('/subscription/product-status', function(req, res) {
  const userid = req.query.userid;
  const flowerId = req.query.flower_id;
  const flowerSql = `
    SELECT
      f.id,
      f.season_id,
      f.status,
      s.is_current
    FROM tb_flower f
    INNER JOIN tb_flower_season s ON f.season_id = s.id
    WHERE f.id = ?
    LIMIT 1
  `;

  // 先读取当前详情页 flower 所属季节；按钮判断必须确认它是不是当前季产品。
  db.query(flowerSql, [flowerId], function(err, flowers) {
    if (err) {
      return res.status(500).send();
    }

    if (flowers.length === 0) {
      return res.status(404).send();
    }

    const flower = flowers[0];

    if (flower.status !== 1 || flower.is_current !== 1) {
      return res.json({
        data: {
          buttonText: '无法获取',
          buttonDisabled: true,
          action: 'none'
        }
      });
    }

    if (!userid) {
      return res.json({
        data: {
          buttonText: '订阅',
          buttonDisabled: false,
          action: 'subscribe'
        }
      });
    }

    const deliverySql = `
      SELECT
        selected_flower_id,
        delivery_status,
        info.id AS delivery_info_id
      FROM tb_subscription_delivery d
      LEFT JOIN tb_user_delivery_info info ON d.user_id = info.user_id
      WHERE d.user_id = ?
        AND d.season_id = ?
      LIMIT 1
    `;

    // 再读取用户当前季配送资格；它决定按钮是订阅、预约配送、预约成功还是无法获取。
    db.query(deliverySql, [userid, flower.season_id], function(error, deliveries) {
      if (error) {
        return res.status(500).send();
      }

      if (deliveries.length === 0) {
        return res.json({
          data: {
            buttonText: '订阅',
            buttonDisabled: false,
            action: 'subscribe'
          }
        });
      }

      const delivery = deliveries[0];

      if (!delivery.selected_flower_id && !delivery.delivery_info_id) {
        return res.json({
          data: {
            buttonText: '订阅',
            buttonDisabled: false,
            action: 'subscribe'
          }
        });
      }

      if (!delivery.selected_flower_id) {
        return res.json({
          data: {
            buttonText: '预约配送',
            buttonDisabled: false,
            action: 'reserve'
          }
        });
      }

      if (delivery.selected_flower_id === Number(flowerId)) {
        return res.json({
          data: {
            buttonText: '预约成功',
            buttonDisabled: true,
            action: 'reserved'
          }
        });
      }

      res.json({
        data: {
          buttonText: '无法获取',
          buttonDisabled: true,
          action: 'none'
        }
      });
    });
  });
})

router.post('/subscription/reserve', function(req, res) {
  const userid = req.body.userid;
  const flowerId = req.body.flower_id;
  const flowerSql = `
    SELECT
      f.id,
      f.season_id,
      f.status,
      s.is_current
    FROM tb_flower f
    INNER JOIN tb_flower_season s ON f.season_id = s.id
    WHERE f.id = ?
    LIMIT 1
  `;

  // 后端再次检查 flower 是否属于当前季，不能只依赖前端按钮禁用。
  db.query(flowerSql, [flowerId], function(err, flowers) {
    if (err) {
      return res.status(500).send();
    }

    if (flowers.length === 0 || flowers[0].status !== 1 || flowers[0].is_current !== 1) {
      return res.status(403).json({
        message: '当前产品不可预约'
      });
    }

    const flower = flowers[0];
    const infoSql = `
      SELECT
        receiver_name,
        receiver_phone,
        address
      FROM tb_user_delivery_info
      WHERE user_id = ?
      LIMIT 1
    `;

    // 预约前读取默认配送信息；预约成功后会复制快照，保证之后改默认地址不影响本次预约。
    db.query(infoSql, [userid], function(infoErr, infos) {
      if (infoErr) {
        return res.status(500).send();
      }

      if (infos.length === 0) {
        return res.status(404).json({
          message: '请先填写配送信息'
        });
      }

      const deliveryInfo = infos[0];
      const updateSql = `
        UPDATE tb_subscription_delivery
        SET
          selected_flower_id = ?,
          delivery_status = 'shipping',
          receiver_name_snapshot = ?,
          receiver_phone_snapshot = ?,
          address_snapshot = ?,
          reserved_at = NOW()
        WHERE user_id = ?
          AND season_id = ?
          AND selected_flower_id IS NULL
      `;

      // 只有 selected_flower_id 为空时才允许预约；一旦预约成功，前台不能改选其他产品。
      db.query(updateSql, [
        flowerId,
        deliveryInfo.receiver_name,
        deliveryInfo.receiver_phone,
        deliveryInfo.address,
        userid,
        flower.season_id
      ], function(updateErr, result) {
        if (updateErr) {
          return res.status(500).send();
        }

        if (result.affectedRows === 0) {
          return res.status(409).json({
            message: '当前季已经预约过产品'
          });
        }

        res.status(201).json({
          data: {
            flower_id: Number(flowerId),
            season_id: flower.season_id,
            delivery_status: 'shipping'
          }
        });
      });
    });
  });
})

module.exports = router;
