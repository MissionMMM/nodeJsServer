var mysql=require('mysql')
var pool=mysql.createPool({
    host:'localhost:3306',
    user:'Mission',
    password:'',
    database:'userList'
})