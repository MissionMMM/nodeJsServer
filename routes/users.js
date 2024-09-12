const express = require('express');
const router = express.Router();
const basePool = require('../pool/base_pool')
const currentTime = require('../utils/getTime')

/* GET users listing. */
// 根目录拼接参数 type=all 查询所有信息
router.get('/', function (req, res, next) {
  // console.log('我是req:',req)
  // req.query  传进来的参数
  let queryObj = req.query // 参数集合
  if (queryObj.type === 'all') {
    // 运行查询函数
    basePool.query('select * from users', (err, results) => {
      if (err) {
        let errResult = {
          warn: 'error',
          message: '获取数据库时系统出错'
        }
        // res.send(JSON.stringify(errResult))
        console.log(currentTime.toExactilyDay() + " " + err)
        res.json({ code: 500, data: errResult, requestTime: currentTime.toExactilyDay() })
      } else {
        console.log(currentTime.toExactilyDay() + " " + results)
        // res.send(JSON.stringify(results))
        res.json({ code: 200, data: results, requestTime: currentTime.toExactilyDay() })
      }
    })
    return
  }
  res.json({ code: 200, message: '空数据', requestTime: currentTime.toExactilyDay() })
});
// 登陆接口
router.get('/login', function (req, res, next) {
  // console.log('我是req:',req)
  // req.query  传进来的参数
  let queryObj = req.query // 参数集合
  res.json({ code: 200, message: '登陆成功', requestTime: currentTime.toExactilyDay() })
});

// 注册接口
router.get('/register', function (req, res, next) {
  // console.log('我是req:',req)
  // req.query  传进来的参数
  let queryObj = req.query // 参数集合
  res.json({ code: 200, message: '注册成功', requestTime: currentTime.toExactilyDay() })
});

module.exports = router;
