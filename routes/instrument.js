const express = require('express');
const router = express.Router();
const currentTime = require('../utils/getTime')
const { get, post } = require('../utils/request')

// 天气预报接口
router.get('/weather', function (req, res, next) {
    let queryObj = req.query // 参数集合
    const app_id = "ihhxoekgltmhsext"
    const app_secret = "deDxMPCqNNFmkbG4ULw2LDjVVBS7JIhM"
    get(`https://www.mxnzp.com/api/weather/forecast/${queryObj.city}`, { app_id: app_id, app_secret: app_secret }).then(requestRes => {
        if (requestRes.code == 1) {
            res.json({ code: 200, data: requestRes, time: currentTime })
        } else {
            res.json({ code: 500, message: "服务错误,限制查询", time: currentTime })
        }
    })
})
// 新闻接口
router.get('/news', function (req, res, next) {
    let queryObj = req.query // 参数集合
    const key = "9e0fb21d6af9ac946a09fe2513e91617"
    // type[String]: top/推荐，默认 | guonei/国内 | guoji/国际 | yule/娱乐 | tiyu/体育 | junshi/军事 | keji/科技 | caijing/财经 | youxi/游戏 | qiche/汽车 | jiankang/健康
    // page[Number]:当前页数,默认1,最大50
    // page_size[Number]:每条返回条数,默认30,最大30
    // is_filter[Number]:是否只含有内容详情的新闻,1/是,0/默认
    get(`http://v.juhe.cn/toutiao/index`, { type: queryObj.type, page: queryObj.page, page_size: queryObj.pageSize, is_filter: 1, key: key }).then(requestRes => {
        if (requestRes.error_code == 0) {
            res.json({ code: 200, data: requestRes, time: currentTime })
        } else {
            res.json({ code: 500, message: "服务错误,限制查询", time: currentTime })
        }
    })
})

module.exports = router;