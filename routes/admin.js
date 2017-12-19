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

router.get("/", (req, res) => {
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        res.render("admin", { usr: req._passport.session });
    } else {
        res.redirect("/dangnhap");
    }
});

router.get("/them", (req, res) => {
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        res.render("admin/them", { usr: req._passport.session });
    } else {
        res.redirect("/dangnhap");
    }
});

router.get("/sua/:id", (req, res) => {
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("SELECT * FROM admin WHERE id="+req.params.id, (err, result) => {
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
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("UPDATE admin SET tendangnhap = '"+tendangnhap+"',matkhau = '"+matkhau+"',tendaydu = '"+tendaydu+"' WHERE id = "+req.params.id, (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.send('Sửa thành công, <a href=\"/admin/quanly/admin\"> nhấn vào đây để quay lại </a>');
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
        console.log(tendangnhap + matkhau + tendaydu);
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("INSERT INTO admin(tendangnhap,matkhau,tendaydu) VALUES ('" + tendangnhap + "','" + matkhau + "','" + tendaydu + "');", (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.send('Thêm thành công, <a href=\"/admin/quanly/admin\"> nhấn vào đây để quay lại </a>');
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
            client.query("DELETE FROM admin WHERE id=" + req.params.id, (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.send("Xoá thành công!!! <a href=\"/admin/quanly/admin\">Nhấn vào đây để quay lại</a>>");
            })
        })
    } else {
        res.redirect("/dangnhap");
    }
});

router.get("/quanly/:table", (req, res) => {
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("SELECT * FROM " + req.params.table + " ORDER BY id ASC", (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.render("admin/" + req.params.table, { ten: req.params.table, data: result.rows });
            })
        })
    } else {
        res.redirect("/dangnhap");
    }
});

router.get("/huongdansudungadmin/xem", (req, res)=>{
    res.render("admin/huongdansudungadmin",{usr: req._passport.session});
});

module.exports = router;