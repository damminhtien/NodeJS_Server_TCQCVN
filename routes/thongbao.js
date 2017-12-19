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

router.get('/them',(req,res)=>{
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        res.render('thongbao/them',{usr: req._passport.session});    
    }else res.redirect("../");
})

router.post("/them", (req, res) => {
    var noidung = req.body.noidung,
        ten = req.body.ten;
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("INSERT INTO thongbao(ten,noidung) VALUES ('" + ten + "','" + noidung + "');", (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.redirect("../");
            })
        })
    } else {
        res.redirect("/dangnhap");
    }
});

router.post('/sua/:id',(req,res)=>{
    var id = req.params.id,
        noidung = req.body.noidung;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("UPDATE thongbao SET noidung = '" + noidung + "' WHERE id = "  + id , (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.redirect("../xem");
        })
    })
})

router.get('/sua/:id', (req, res) => {
    var id = req.params.id;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('SELECT * FROM thongbao WHERE id = '+id, (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.render("thongbao/sua",{usr: req._passport.session, thongbao: result.rows[0]});
        })
    })
});

router.get("/xoa/:id", (req, res) => {
    if (req.isAuthenticated() && req._passport.session.user.id < 1000) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("DELETE FROM thongbao WHERE id=" + req.params.id, (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.redirect("../");
            })
        })
    } else {
        res.redirect("/dangnhap");
    }
});

router.get("/xem", (req, res) => {
    if (req.isAuthenticated()) {
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query("SELECT * FROM thongbao ORDER BY id ASC", (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.render("thongbao/xem", { ten: req.params.table, data: result.rows });
            })
        })
    } else {
        res.redirect("/dangnhap");
    }
});

router.get("/get5maxid", (req, res) => {
    var id = req.params.id;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("SELECT id,ten,tomtat,urlanh,ngaydang FROM tintuc ORDER BY id DESC LIMIT 5", (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.send(result.rows);
        })
    })
})


module.exports = router;