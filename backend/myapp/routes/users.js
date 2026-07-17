var express = require('express');
var router = express.Router();
var db = require('../db')

// 查询数据库中被标记为“当前季”的花季信息，如果不是当前季就拿不到数据，因为我设置了WHERE is_current =1，拿到信息是花季编号主要信息season_code。这个函数两个主要的功能一个确认当前季，这可以看成一个轮子函数。另一个功能则是拿到当前季的季节信息
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

// 查询用户的订阅情况
// 查询用户是否有覆盖指定季节的有效订阅。季度覆盖范围按 start_date 顺序计算：
// 当季订阅覆盖 1 季，四季订阅覆盖开始季及之后 3 季。
// 非常重要的参数是第二个参数seasonId，它会在函数调用中传入当前的季节
function getSubscriptionCoveringSeason(userid, seasonId, callback) {
  const sql = `
    SELECT
      subscription.id,
      subscription.plan_type,
      subscription.start_season_id,
      subscription.total_season_count,
      subscription.allocated_season_count,
      subscription.subscription_status
    FROM tb_subscription subscription
    INNER JOIN tb_flower_season start_season
      ON start_season.id = subscription.start_season_id
    INNER JOIN tb_flower_season target_season
      ON target_season.id = ?
    WHERE subscription.user_id = ?
      AND subscription.subscription_status = 'active'
      AND target_season.start_date >= start_season.start_date
      -- 上一行代码防止里用户订阅过去的季度
      AND (
        SELECT COUNT(*)
        FROM tb_flower_season covered_season
        WHERE covered_season.start_date >= start_season.start_date
          AND covered_season.start_date <= target_season.start_date
      ) BETWEEN 1 AND subscription.total_season_count
    -- 上述AND设置了判断距离是否正确的逻辑，即目标季度不能超过购买的数量
    ORDER BY start_season.start_date DESC
    LIMIT 1
  `;

  db.query(sql, [seasonId, userid], callback);
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
    const userSql = `
      SELECT id AS user_id, username
      FROM tb_user
      WHERE id = ?
      LIMIT 1
    `;

    db.query(userSql, [userid], function(error, users) {
      if (error) {
        return res.status(500).send();
      }

      if (users.length === 0) {
        return res.status(404).send();
      }

      const user = users[0];

      if (!currentSeason) {
        return res.json({
          data: {
            user_id: user.user_id,
            username: user.username,
            subscription_status: '未订阅',
            current_season_reservation_status: '未预约当季花礼'
          }
        });
      }

      // 订阅状态只读取订阅主表，不再依赖是否已经生成配送资格或填写地址。
      getSubscriptionCoveringSeason(userid, currentSeason.id, function(subscriptionErr, subscriptions) {
        if (subscriptionErr) {
          return res.status(500).send();
        }

        const subscription = subscriptions[0] || null;
        const deliverySql = `
          SELECT selected_flower_id
          FROM tb_subscription_delivery
          WHERE user_id = ?
            AND season_id = ?
          LIMIT 1
        `;

        // 预约状态独立读取配送记录；没有记录表示本季尚未预约。
        db.query(deliverySql, [userid, currentSeason.id], function(deliveryErr, deliveries) {
          if (deliveryErr) {
            return res.status(500).send();
          }

          const delivery = deliveries[0] || null;
          const subscriptionStatus = subscription && subscription.plan_type === 'current_season'
              ? '当季订阅'
              : subscription && subscription.plan_type === 'four_season'
                  ? '四季订阅'
                  : '未订阅';

          res.json({
            data: {
              user_id: user.user_id,
              username: user.username,
              subscription_status: subscriptionStatus,
              current_season_reservation_status: delivery && delivery.selected_flower_id
                  ? '已预约当季花礼'
                  : '未预约当季花礼'
            }
          });
        });
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

    // SubscribePage 的订阅状态只取决于是否存在覆盖当前季的有效订阅。
    getSubscriptionCoveringSeason(userid, currentSeason.id, function(error, subscriptions) {
      if (error) {
        return res.status(500).send();
      }

      const subscription = subscriptions[0] || null;

      res.json({
        data: {
          currentSeason: currentSeason,
          hasCurrentSeasonSubscription: !!subscription,
          planType: subscription ? subscription.plan_type : '',
          isSubscribeWindowOpen: currentSeason.is_subscribe_window_open === 1
        }
      });
    });
  });
})

router.post('/subscription', function(req, res) {
  const userid = req.body.userid;
  const planType = req.body.plan_type;

  // 测试用
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

    // 防止用户重复购买已经覆盖当前季的有效订阅；这里只查询订阅主表。
    getSubscriptionCoveringSeason(userid, currentSeason.id, function(checkErr, subscriptions) {
      if (checkErr) {
        return res.status(500).send();
      }

      if (subscriptions.length > 0) {
        return res.status(409).json({
          message: '当前季已经订阅'
        });
      }

      const totalSeasonCount = planType === 'four_season' ? 4 : 1;

      // 设置订阅状态
      const subscriptionSql = `
        INSERT INTO tb_subscription
          (user_id, plan_type, start_season_id, total_season_count, allocated_season_count, subscription_status)
        VALUES
          (?,?,?,?,0,'active')
      `;

      db.query(subscriptionSql, [
        userid,
        planType,
        currentSeason.id,
        totalSeasonCount
      ], function(insertErr, result) {
        if (insertErr) {
          if (insertErr.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
              message: '当前季已经订阅'
            });
          }

          return res.status(500).send();
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
        delivery_status
      FROM tb_subscription_delivery
      WHERE user_id = ?
        AND season_id = ?
      LIMIT 1
    `;

    // 已有预约记录时，优先根据用户选择的花礼显示预约成功或无法获取。
    db.query(deliverySql, [userid, flower.season_id], function(error, deliveries) {
      if (error) {
        return res.status(500).send();
      }

      const delivery = deliveries[0] || null;

      if (delivery && delivery.selected_flower_id === Number(flowerId)) {
        return res.json({
          data: {
            buttonText: '预约成功',
            buttonDisabled: true,
            action: 'reserved'
          }
        });
      }

      if (delivery && delivery.selected_flower_id) {
        return res.json({
          data: {
            buttonText: '无法获取',
            buttonDisabled: true,
            action: 'none'
          }
        });
      }

      // 尚未预约时，只根据订阅主表判断用户是否拥有覆盖当前季的有效订阅。
      getSubscriptionCoveringSeason(userid, flower.season_id, function(subscriptionErr, subscriptions) {
        if (subscriptionErr) {
          return res.status(500).send();
        }

        if (subscriptions.length > 0) {
          return res.json({
            data: {
              buttonText: '预约配送',
              buttonDisabled: false,
              action: 'reserve'
            }
          });
        }

        res.json({
          data: {
            buttonText: '订阅',
            buttonDisabled: false,
            action: 'subscribe'
          }
        });
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

  // 后端再次检查 flower 是否属于当前季，防止用户使用请求绕开前端
  db.query(flowerSql, [flowerId], function(err, flowers) {
    if (err) {
      return res.status(500).send(

      );
    }

    if (flowers.length === 0 || flowers[0].status !== 1 || flowers[0].is_current !== 1) {
      return res.status(403).json({
        message: '当前产品不可预约'
      });
    }

    const flower = flowers[0];

    // 预约按钮负责验证用户是否有覆盖当前季的有效订阅。
    getSubscriptionCoveringSeason(userid, flower.season_id, function(subscriptionErr, subscriptions) {
      if (subscriptionErr) {
        return res.status(500).send();
      }

      if (subscriptions.length === 0) {
        return res.status(403).json({
          message: '当前用户没有本季配送资格'
        });
      }

      const subscription = subscriptions[0];
      const deliverySql = `
        SELECT id, subscription_id, selected_flower_id
        FROM tb_subscription_delivery
        WHERE user_id = ?
          AND season_id = ?
        LIMIT 1
      `;

      db.query(deliverySql, [userid, flower.season_id], function(deliveryErr, deliveries) {
        if (deliveryErr) {
          return res.status(500).send();
        }

        const existingDelivery = deliveries[0] || null;

        if (existingDelivery && existingDelivery.selected_flower_id) {
          return res.status(409).json({
            message: '当前季已经预约过产品'
          });
        }

        if (!existingDelivery && subscription.allocated_season_count >= subscription.total_season_count) {
          return res.status(403).json({
            message: '当前用户没有本季配送资格'
          });
        }

        const infoSql = `
          SELECT
            receiver_name,
            receiver_phone,
            address
          FROM tb_user_delivery_info
          WHERE user_id = ?
          LIMIT 1
        `;

        // 资格验证通过后才检查地址；缺少地址时不创建配送记录，也不增加分配次数。
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

          db.beginTransaction(function(transactionErr) {
            if (transactionErr) {
              return res.status(500).send();
            }

            function commitReservation() {
              db.commit(function(commitErr) {
                if (commitErr) {
                  return db.rollback(function() {
                    res.status(500).send();
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
            }

            if (existingDelivery) {
              const updateSql = `
                UPDATE tb_subscription_delivery
                SET
                  selected_flower_id = ?,
                  delivery_status = 'shipping',
                  receiver_name_snapshot = ?,
                  receiver_phone_snapshot = ?,
                  address_snapshot = ?,
                  reserved_at = NOW()
                WHERE id = ?
                  AND selected_flower_id IS NULL
              `;

              return db.query(updateSql, [
                flowerId,
                deliveryInfo.receiver_name,
                deliveryInfo.receiver_phone,
                deliveryInfo.address,
                existingDelivery.id
              ], function(updateErr, result) {
                if (updateErr) {
                  return db.rollback(function() {
                    res.status(500).send();
                  });
                }

                if (result.affectedRows === 0) {
                  return db.rollback(function() {
                    res.status(409).json({
                      message: '当前季已经预约过产品'
                    });
                  });
                }

                commitReservation();
              });
            }

            const allocationSql = `
              UPDATE tb_subscription
              SET allocated_season_count = allocated_season_count + 1
              WHERE id = ?
                AND subscription_status = 'active'
                AND allocated_season_count < total_season_count
            `;

            db.query(allocationSql, [subscription.id], function(allocationErr, allocationResult) {
              if (allocationErr) {
                return db.rollback(function() {
                  res.status(500).send();
                });
              }

              if (allocationResult.affectedRows === 0) {
                return db.rollback(function() {
                  res.status(403).json({
                    message: '当前用户没有本季配送资格'
                  });
                });
              }

              const insertSql = `
                INSERT INTO tb_subscription_delivery
                  (subscription_id, user_id, season_id, selected_flower_id, delivery_status,
                   receiver_name_snapshot, receiver_phone_snapshot, address_snapshot, reserved_at)
                VALUES
                  (?,?,?,?,'shipping',?,?,?,NOW())
              `;

              db.query(insertSql, [
                subscription.id,
                userid,
                flower.season_id,
                flowerId,
                deliveryInfo.receiver_name,
                deliveryInfo.receiver_phone,
                deliveryInfo.address
              ], function(insertErr) {
                if (insertErr) {
                  return db.rollback(function() {
                    if (insertErr.code === 'ER_DUP_ENTRY') {
                      return res.status(409).json({
                        message: '当前季已经预约过产品'
                      });
                    }

                    res.status(500).send();
                  });
                }

                commitReservation();
              });
            });
          });
        });
      });
    });
  });
})

module.exports = router;
