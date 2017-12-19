var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash-plus');
var fs = require('fs');
var multer = require('multer');
app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60 * 1000 * 60 },
    saveUninitialized: true,
    resave: true
}));

var pg = require("pg");
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tcqcxd',
    password: 'dmt',
    port: 2197,
});

app.use(flash());
var cookieParser = require('cookie-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(flash());
app.use(passport.session());

router.get('/hethongquychuantieuchuan', (req, res) => {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('SELECT * FROM gioithieu WHERE id = 1', (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.render('gioithieu/xem', { gioithieu: result.rows[0], usr: req._passport.session });
        })
    })
});

router.get('/quychuantieuchuannuocngoai', (req, res) => {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('SELECT * FROM gioithieu WHERE id = 2', (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.render('gioithieu/xem', { gioithieu: result.rows[0], usr: req._passport.session });
        })
    })
});

router.get('/huongdansudung', (req, res) => {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('SELECT * FROM gioithieu WHERE id = 3', (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.render('gioithieu/xem', { gioithieu: result.rows[0], usr: req._passport.session });
        })
    })
});

router.get('/sua',(req,res)=>{
	res.render('gioithieu/sua',{usr: req._passport.session});
})

router.post('/sua',(req,res)=>{
	var id = req.body.id,
		chude = req.body.chude;
	pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("UPDATE gioithieu SET chude = '" + chude + "' WHERE id = "  + id , (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.send('Thêm thành công');
        })
    })
})

router.get('/thongtin/:id', (req, res) => {
	var id = req.params.id;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('SELECT * FROM gioithieu WHERE id = '+id, (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.send(result.rows[0]);
        })
    })
});

module.exports = router;