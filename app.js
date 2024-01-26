require('dotenv').config()
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 5000

const router = require('./routes/index');
const adminRouter = require('./routes/admin');
const sequelize = require("./db");

const app = express();

app.use(fileUpload({
    createParentPath: true
}));
app.set('view engine', 'pug')
app.use(cors({
    origin: "*"
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', router);
app.use('/admin', adminRouter);

sequelize.authenticate().then(() => {
    console.log("DB connected")

    require("./db/models")

    // sequelize.sync({force: true}).then(() => {
    //     console.log("DB synced")
    // })

    app.listen(PORT, () => {
        console.log("Started: http://localhost:"+PORT)
    })
})

module.exports = app;
