const express = require('express');
const router = express.Router();
const basePool = require('../pool/base_pool')
const currentTime = require('../utils/getTime')
const crypto = require('crypto');

/* GET users listing. */
// 根目录拼接参数 type=all 查询所有信息
router.get('/', function (req, res, next) {
  // req.query  传进来的参数
  let queryObj = req.query // 参数集合
  let getCurrentTime = currentTime.toExactilyDay()
  if (queryObj.type === 'all') {
    // 运行查询函数
    basePool.query('SELECT * FROM users', (err, results) => {
      if (err) {
        res.json({ code: 500, message: '获取数据库时系统出错', requestTime: getCurrentTime })
      } else {
        res.json({ code: 200, data: results, requestTime: getCurrentTime })
      }
    })
    return
  }
  res.json({ code: 200, message: '空数据', requestTime: getCurrentTime })
});

// 登陆接口 ---------------------------------------------------------------
router.get('/login', function (req, res, next) {
  // req.query  传进来的参数
  let getCurrentTime = currentTime.toExactilyDay()
  let queryObj = req.query // 参数集合
  let userName = queryObj.userName
  let password = queryObj.password
  basePool.getConnection((errFun, basePoolConnect) => {
    if (errFun) {
      return res.json({ code: 500, message: '连接错误', requestTime: getCurrentTime })
    }
    basePoolConnect.beginTransaction(errBegin => {
      if (errBegin) {
        res.json({ code: 501, message: '事务开始失败', requestTime: getCurrentTime })
        basePoolConnect.release()
        return
      }
      basePoolConnect.query('SELECT * FROM users WHERE user_name = ? AND password_hash = ?', [userName, password], (err, results) => {
        if (err) {
          res.json({ code: 500, message: '查询用户名失败', requestTime: getCurrentTime });
          basePoolConnect.rollback(() => {
            basePoolConnect.release();
          });
          return;
        }
        if (results.length > 0) {
          basePoolConnect.query('UPDATE users SET last_login_date = ? WHERE user_name = ?', [getCurrentTime, userName], (err1, results1) => {
            if (err1) {
              res.json({ code: 500, message: '插入时间操作失败', requestTime: getCurrentTime })
              basePoolConnect.rollback(() => {
                basePoolConnect.release();
              });
              return
            } else {
              basePool.query('SELECT * FROM users WHERE user_name = ?', [userName], (err2, results2) => {
                if (err2) {
                  res.json({ code: 501, message: '查询该用户失败', requestTime: getCurrentTime })
                  basePoolConnect.rollback(() => {
                    basePoolConnect.release();
                  });
                  return
                } else {
                  res.json({ code: 200, data: results2, requestTime: getCurrentTime })
                  basePoolConnect.release();
                }
              })
            }
          })
        } else {
          res.json({ code: 500, message: '查询失败', requestTime: getCurrentTime })
          basePoolConnect.rollback(() => {
            basePoolConnect.release();
          });
          return
        }
      })
    })
  })
});

function generateRandomToken(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // 将二进制数据转换为十六进制字符串
    .slice(0, length); // 截取所需的长度
}

// 生成一个 32 个字符的 token
// 注册接口 ---------------------------------------------------------------
router.get('/register', function (req, res, next) {
  // req.query  传进来的参数
  console.log('我是传进来的参数：', req.query)
  let getCurrentTime = currentTime.toExactilyDay()
  let queryObj = req.query // 参数集合
  let userName = queryObj.userName // 用户名
  let userPassword = queryObj.userPassword // 密码
  let userNickname = queryObj.userNickname // 昵称
  let gender = queryObj.gender // 性别
  let userPhone = queryObj.userPhone // 用户手机号
  let birthDate = queryObj.birthDate // 生日日期
  let city = queryObj.city // 用户地区
  let userEmail = queryObj.userEmail // 用户邮箱
  let invite = queryObj.inviteNum // 用户邀请码
  let token = ""
  basePool.getConnection((errFun, basePoolConnect) => {
    if (errFun) {
      return res.json({ code: 500, message: '连接错误', requestTime: getCurrentTime })
    }
    basePoolConnect.beginTransaction(errBegin => {
      if (errBegin) {
        res.json({ code: 501, message: '事务开始失败', requestTime: getCurrentTime })
        basePoolConnect.release()
        return
      }
      // 检验用户名是否重复
      basePoolConnect.query('SELECT * FROM users WHERE user_name = ?', [userName], (err, result) => {
        if (err) {
          res.json({ code: 500, message: '查询用户名失败', requestTime: getCurrentTime });
          basePoolConnect.rollback(() => {
            basePoolConnect.release();
          });
          return;
        }
        if (result.length > 0) {
          res.json({ code: 500, message: '用户名重复', requestTime: getCurrentTime })
          basePoolConnect.rollback(() => {
            basePoolConnect.release();
          });
          return
        } else {
          token = generateRandomToken(32)
          basePoolConnect.query('INSERT INTO users ( user_name , password_hash , nick_name , gender , birthday , phone_number , email , city , register_date , last_login_date , invite , token  ) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )', [userName, userPassword, userNickname, gender, birthDate, userPhone, userEmail, city, getCurrentTime, getCurrentTime, invite, token], (err1, results1) => {
            if (err1) {
              // basePool.getConnection().rollback()
              res.json({ code: 500, message: '注册失败', requestTime: getCurrentTime })
              basePoolConnect.rollback(() => {
                basePoolConnect.release()
              })
              return
            } else {
              basePoolConnect.commit((errCommit) => {
                if (errCommit) {
                  res.json({ code: 500, message: '提交事务失败', requestTime: getCurrentTime });
                  basePoolConnect.rollback(() => {
                    basePoolConnect.release();
                  });
                  return
                } else {
                  res.json({ code: 200, message: '注册成功', requestTime: getCurrentTime })
                  basePoolConnect.release();
                  return
                }
              });
            }
          })
        }
      })

    })
  })
});

module.exports = router;
