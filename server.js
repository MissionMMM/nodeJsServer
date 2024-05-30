const express=require('express')
const app=express()
// 导入路由模块
const login=require('./routers/user/Login.js')

function logger(req,res,next){
    const time=new Date()
    console.log(`[${time.toLocaleString()}] ${req.method} ${req.url}`)
    next()
}
app.use(logger)
app.use(login)
// 错误处理中间件
app.use('*',(req,res)=>{
    res.status(404)
    res.send('404')
})
app.listen(3000,()=>{
    console.log('服务已启动...')
})