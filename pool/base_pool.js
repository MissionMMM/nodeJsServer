const mysql = require('mysql')
const basePool = mysql.createPool({
    host: '123.58.210.191',
    port:'3306',
    user: 'admin',
    password: 'yqt123456.',
    database: 'program_base_info',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000, // 连接超时时间，单位是毫秒
})
module.exports = basePool