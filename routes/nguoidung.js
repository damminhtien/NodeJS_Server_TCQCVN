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

router.get("/them", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("admin/them", { usr: req._passport.session });
    } else {
        res.redirect("/dangnhap");
    }
});

router.get("/sua/:id", (req, res) => {
    if (req.isAuthenticated()) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("SELECT * FROM nguoidung WHERE id="+req.params.id, (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.render("admin/sua", { admin: result.rows[0], usr: req._passport.session });
            })
        })
    } else {
        res.redirect("/dangnhap");
    }
});

router.post("/sua/:id", (req, res) => {
    var tendangnhap = req.body.tendangnhap,
        matkhau = req.body.matkhau,
        tendaydu = req.body.tendaydu;
    if (req.isAuthenticated()) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("UPDATE nguoidung SET tendangnhap = '"+tendangnhap+"',matkhau = '"+matkhau+"',tendaydu = '"+tendaydu+"' WHERE id = "+req.params.id, (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.send('Sửa thành công, <a href=\"/admin/quanly/nguoidung\"> nhấn vào đây để quay lại </a>');
            })
        })
    } else {
        res.redirect("/dangnhap");
    }
});

router.post("/them", (req, res) => {
    var tendangnhap = req.body.tendangnhap,
        matkhau = req.body.matkhau,
        tendaydu = req.body.tendaydu;
    if (req.isAuthenticated()) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("INSERT INTO nguoidung(tendangnhap,matkhau,tendaydu) VALUES ('" + tendangnhap + "','" + matkhau + "','" + tendaydu + "');", (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.send('Thêm thành công, <a href=\"/admin/quanly/nguoidung\"> nhấn vào đây để quay lại </a>');
            })
        })
    } else {
        res.redirect("/dangnhap");
    }
});

router.get("/xoa/:id", (req, res) => {
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("DELETE FROM nguoidung WHERE id=" + req.params.id, (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.send("Xoá thành công!!! <a href=\"/admin/quanly/nguoidung\">Nhấn vào đây để quay lại</a>>");
            })
        })
    } else {
        res.redirect("/dangnhap");
    }
});


module.exports = router;