// 1.导入express
const express = require('express')
//  2.创建路由对象
const Login = express.Router()
// 3.挂载具体的路由
Login.get('/user/list', (req, res) => {
    res.send('Get user list')
})
Login.get('/user/add', (req, res) => {
    res.send('Add new user.')
})
// 4.向外导出路由对象
module.exports = Login