const express = require('express');
const router = express.Router();
const currentTime = require('../utils/getTime')
const { get, post } = require('../utils/request')

router.get('/weather', function (req, res, next) {
    let queryObj = req.query // 参数集合
    const app_id = "ihhxoekgltmhsext"
    const app_secret = "deDxMPCqNNFmkbG4ULw2LDjVVBS7JIhM"
    get(`https://www.mxnzp.com/api/weather/forecast/${queryObj.city}`, { app_id: app_id, app_secret: app_secret }).then(requestRes => {
        if (requestRes.code == 1) {
            res.json(requestRes)
        } else {
            res.json({ code: 500, message: "服务错误", time: currentTime })
        }
    })
})

module.exports = router;