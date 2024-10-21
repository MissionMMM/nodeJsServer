const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const allowedOrigins = [
    'http://yqtmisn.top',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) { // 不检查null origin（例如，直接从浏览器访问）
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, // 指定允许的源
    optionsSuccessStatus: 200, // 一些浏览器（如IE11）需要一个非标准的成功状态
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的头部
};


const usersRouter = require('./routes/users');
const instrumentRouter = require('./routes/instrument');

const app = express();

// 启用CORS
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/instrument', instrumentRouter);
app.use('/users', usersRouter);

module.exports = app;
