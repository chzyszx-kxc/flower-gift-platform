var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/current-season', function(req, res) {
  const sql = `
    SELECT
      id,
      season_code,
      season_name,
      theme_name,
      theme_description,
      DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
      DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
      DATE_FORMAT(subscribe_start_date, '%Y-%m-%d') AS subscribe_start_date,
      DATE_FORMAT(subscribe_end_date, '%Y-%m-%d') AS subscribe_end_date,
      DATE_FORMAT(DATE_SUB(subscribe_end_date, INTERVAL 1 DAY), '%Y-%m-%d') AS subscribe_last_date,
      DATEDIFF(end_date, CURDATE()) AS days_to_next_season,
      CURDATE() >= subscribe_start_date AND CURDATE() < subscribe_end_date AS is_subscribe_window_open
    FROM tb_flower_season
    WHERE is_current = 1
    LIMIT 1
  `;

  // 读取当前季批次信息；LeftBar 用它显示订阅截至日期，SubscribePage 用窗口字段判断能否订阅。
  db.query(sql, function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: '获取当前季信息失败'
      });
    }

    res.json({
      data: result[0] || null
    });
  });
})

router.get('/GetDescription', function(req, res) {
  const flower_id = req.query.flower_id;
  const sql = `
    SELECT
      flower_id,
      category,
      product_detail_description
    FROM tb_flower_description
    WHERE flower_id = ?
  `;

  if (!flower_id) {
    return res.json({
      data: null
    });
  }

  db.query(sql, [flower_id], function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: '获取花礼描述失败'
      });
    }

    res.json({
      data: result[0] || null
    });
  });
})

router.get('/GetOtherMessageById', function(req, res) {
  const flower_id = req.query.flower_id;
  const sql = `
    SELECT
      f.id,
      f.season_id,
      f.flower_folder,
      f.flower_name,
      f.product_role,
      f.position_no,
      f.price,
      f.summary,
      f.description,
      f.status,
      s.season_code,
      s.season_name,
      s.theme_name,
      s.theme_description,
      DATE_FORMAT(s.start_date, '%Y-%m-%d') AS start_date,
      DATE_FORMAT(s.end_date, '%Y-%m-%d') AS end_date,
      DATE_FORMAT(s.subscribe_start_date, '%Y-%m-%d') AS subscribe_start_date,
      DATE_FORMAT(s.subscribe_end_date, '%Y-%m-%d') AS subscribe_end_date,
      DATE_FORMAT(DATE_SUB(s.subscribe_end_date, INTERVAL 1 DAY), '%Y-%m-%d') AS subscribe_last_date,
      s.is_current,
      i.id AS image_id,
      CONCAT('/flower', i.image_url) AS image_url,
      i.sort_order,
      i.is_cover
    FROM tb_flower f
    INNER JOIN tb_flower_season s ON f.season_id = s.id
    LEFT JOIN tb_flower_image i ON f.id = i.flower_id
    WHERE f.id = ?
      AND f.status = 1
    ORDER BY i.sort_order ASC
  `;

  if (!flower_id) {
    return res.json({
      data: null
    });
  }

  db.query(sql, [flower_id], function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: '获取花礼详情失败'
      });
    }

    if (result.length === 0) {
      return res.json({
        data: null
      });
    }

    const firstRow = result[0];
    const flower = {
      id: firstRow.id,
      season_id: firstRow.season_id,
      season_code: firstRow.season_code,
      season_name: firstRow.season_name,
      theme_name: firstRow.theme_name,
      theme_description: firstRow.theme_description,
      start_date: firstRow.start_date,
      end_date: firstRow.end_date,
      subscribe_start_date: firstRow.subscribe_start_date,
      subscribe_end_date: firstRow.subscribe_end_date,
      subscribe_last_date: firstRow.subscribe_last_date,
      is_current: firstRow.is_current,
      flower_folder: firstRow.flower_folder,
      flower_name: firstRow.flower_name,
      product_role: firstRow.product_role,
      position_no: firstRow.position_no,
      price: firstRow.price,
      summary: firstRow.summary,
      description: firstRow.description,
      status: firstRow.status,
      cover_image: '',
      image_count: 0,
      has_multiple_images: false,
      images: []
    };

    result.forEach(function(row) {
      if (row.image_id) {
        flower.images.push({
          id: row.image_id,
          image_url: row.image_url,
          sort_order: row.sort_order,
          is_cover: row.is_cover
        });

        if (row.is_cover === 1) {
          flower.cover_image = row.image_url;
        }
      }
    });

    flower.image_count = flower.images.length;
    flower.has_multiple_images = flower.image_count > 1;

    if (!flower.cover_image && flower.images.length > 0) {
      flower.cover_image = flower.images[0].image_url;
    }

    res.json({
      data: flower
    });
  });
})

router.get('/Navegate_NewArrivals', function (req, res) {
  const sql = `
    SELECT
      f.id,
      f.season_id,
      f.flower_folder,
      f.flower_name,
      f.product_role,
      f.position_no,
      f.price,
      f.summary,
      f.description,
      f.status,
      s.season_code,
      s.season_name,
      s.theme_name,
      s.theme_description,
      DATE_FORMAT(s.start_date, '%Y-%m-%d') AS start_date,
      DATE_FORMAT(s.end_date, '%Y-%m-%d') AS end_date,
      DATE_FORMAT(s.subscribe_start_date, '%Y-%m-%d') AS subscribe_start_date,
      DATE_FORMAT(s.subscribe_end_date, '%Y-%m-%d') AS subscribe_end_date,
      DATE_FORMAT(DATE_SUB(s.subscribe_end_date, INTERVAL 1 DAY), '%Y-%m-%d') AS subscribe_last_date,
      s.is_current,
      i.id AS image_id,
      CONCAT('/flower', i.image_url) AS image_url,
      i.sort_order,
      i.is_cover
    FROM tb_flower f
    INNER JOIN tb_flower_season s ON f.season_id = s.id
    LEFT JOIN tb_flower_image i ON f.id = i.flower_id
    WHERE s.is_current = 1
      AND f.product_role = 'primary'
      AND f.status = 1
    ORDER BY f.position_no ASC, i.sort_order ASC
  `;

  db.query(sql, function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: '获取当季新品失败'
      });
    }

    const flowerMap = new Map();
    const flowers = [];

    result.forEach(function(row) {
      let flower = flowerMap.get(row.id);

      if (!flower) {
        flower = {
          id: row.id,
          season_id: row.season_id,
          season_code: row.season_code,
          season_name: row.season_name,
          theme_name: row.theme_name,
          theme_description: row.theme_description,
          start_date: row.start_date,
          end_date: row.end_date,
          subscribe_start_date: row.subscribe_start_date,
          subscribe_end_date: row.subscribe_end_date,
          subscribe_last_date: row.subscribe_last_date,
          is_current: row.is_current,
          flower_folder: row.flower_folder,
          flower_name: row.flower_name,
          product_role: row.product_role,
          position_no: row.position_no,
          price: row.price,
          summary: row.summary,
          description: row.description,
          status: row.status,
          cover_image: '',
          image_count: 0,
          has_multiple_images: false,
          images: []
        };

        flowerMap.set(row.id, flower);
        flowers.push(flower);
      }

      if (row.image_id) {
        flower.images.push({
          id: row.image_id,
          image_url: row.image_url,
          sort_order: row.sort_order,
          is_cover: row.is_cover
        });

        if (row.is_cover === 1) {
          flower.cover_image = row.image_url;
        }
      }
    });

    flowers.forEach(function(flower) {
      flower.image_count = flower.images.length;
      flower.has_multiple_images = flower.image_count > 1;

      if (!flower.cover_image && flower.images.length > 0) {
        flower.cover_image = flower.images[0].image_url;
      }
    });

    res.json({
      data: flowers[0]
    });
  });
})

router.get('/parting_flowers', function(req, res) {
  // 获取往期的花礼数据
  const sql = `
    SELECT
      f.id,
      f.season_id,
      f.flower_folder,
      f.flower_name,
      f.product_role,
      f.position_no,
      f.price,
      f.summary,
      f.description,
      f.status,
      s.season_code,
      s.season_name,
      s.theme_name,
      s.theme_description,
      DATE_FORMAT(s.start_date, '%Y-%m-%d') AS start_date,
      DATE_FORMAT(s.end_date, '%Y-%m-%d') AS end_date,
      DATE_FORMAT(s.subscribe_start_date, '%Y-%m-%d') AS subscribe_start_date,
      DATE_FORMAT(s.subscribe_end_date, '%Y-%m-%d') AS subscribe_end_date,
      DATE_FORMAT(DATE_SUB(s.subscribe_end_date, INTERVAL 1 DAY), '%Y-%m-%d') AS subscribe_last_date,
      s.is_current,
      i.id AS image_id,
      CONCAT('/flower', i.image_url) AS image_url,
      i.sort_order,
      i.is_cover
    FROM tb_flower f
    INNER JOIN tb_flower_season s ON f.season_id = s.id
    LEFT JOIN tb_flower_image i ON f.id = i.flower_id
    WHERE s.is_current = 0
      AND f.status = 1
    ORDER BY s.start_date DESC, f.position_no ASC, i.sort_order ASC
  `;

  db.query(sql, function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: '获取往期花礼失败'
      });
    }

    const flowerMap = new Map();
    const flowers = [];

    result.forEach(function(row) {
      let flower = flowerMap.get(row.id);

      if (!flower) {
        flower = {
          id: row.id,
          season_id: row.season_id,
          season_code: row.season_code,
          season_name: row.season_name,
          theme_name: row.theme_name,
          theme_description: row.theme_description,
          start_date: row.start_date,
          end_date: row.end_date,
          subscribe_start_date: row.subscribe_start_date,
          subscribe_end_date: row.subscribe_end_date,
          subscribe_last_date: row.subscribe_last_date,
          is_current: row.is_current,
          flower_folder: row.flower_folder,
          flower_name: row.flower_name,
          product_role: row.product_role,
          position_no: row.position_no,
          price: row.price,
          summary: row.summary,
          description: row.description,
          status: row.status,
          cover_image: '',
          image_count: 0,
          has_multiple_images: false,
          images: []
        };

        flowerMap.set(row.id, flower);
        flowers.push(flower);
      }

      if (row.image_id) {
        flower.images.push({
          id: row.image_id,
          image_url: row.image_url,
          sort_order: row.sort_order,
          is_cover: row.is_cover
        });

        if (row.is_cover === 1) {
          flower.cover_image = row.image_url;
        }
      }
    });

    flowers.forEach(function(flower) {
      flower.image_count = flower.images.length;
      flower.has_multiple_images = flower.image_count > 1;

      if (!flower.cover_image && flower.images.length > 0) {
        flower.cover_image = flower.images[0].image_url;
      }
    });

    res.json({
      data: flowers
    });
  });
})

router.get('/GetOtherFlowersPictureBySeason', function(req, res) {
  const flower_id = req.query.flower_id;
  const sql = `
    SELECT
      f.id,
      f.season_id,
      f.flower_name,
      CONCAT('/flower', i.image_url) AS cover_image
    FROM tb_flower current_flower
    INNER JOIN tb_flower f ON f.season_id = current_flower.season_id
    LEFT JOIN tb_flower_image i ON i.id = (
      SELECT image.id
      FROM tb_flower_image image
      WHERE image.flower_id = f.id
      ORDER BY image.is_cover DESC, image.sort_order ASC, image.id ASC
      LIMIT 1
    )
    WHERE current_flower.id = ?
      AND current_flower.status = 1
      AND f.id <> current_flower.id
      AND f.status = 1
    ORDER BY f.position_no ASC
    LIMIT 2
  `;

  if (!flower_id) {
    return res.json({
      data: []
    });
  }

  db.query(sql, [flower_id], function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: '获取伴生花礼失败'
      });
    }

    res.json({
      data: result
    });
  });
})

module.exports = router;
