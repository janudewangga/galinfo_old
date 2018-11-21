const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config');
const db = require('./db');
const session = require('express-session');
const sequelizeSessionStore = require('connect-session-sequelize')(session.Store);
const sqStore = new sequelizeSessionStore({
    db: db.db
});
// db.db.sync();
const i18n = require('i18n');
i18n.configure({
    locales: ['id'],
    defaultLocale: 'id',
    register: global,
    directory: __dirname + '/locales'
});
const app = express();
app.use(helmet());
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: config.appSecret, resave: false, saveUninitialized: false, store: sqStore}));
app.use(i18n.init);
app.use('/assets', express.static(path.join('assets')));
app.use('/bo', require('./routers/boCore'));
app.listen(3000);