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

router.get('/xem/:id', (req, res) => {
    var id = req.params.id;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('SELECT * FROM tintuc WHERE id=' + id, (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            pool.connect((err, client, release) => {
                if (err) {
                    return console.error('Error acquiring client', err.stack);
                }
                client.query("UPDATE tintuc SET luotxem = luotxem + 1 WHERE id = " + id);
            })
            res.render('tintuc/xemtin', { tintuc: result.rows[0], usr: req._passport.session });
        })
    })
});

router.get('/viet/byid=:id', (req, res) => {
    res.render('tintuc/viettin', { usr: req._passport.session });
})

var storageAnh = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

var uploadAnh = multer({ storage: storageAnh });

router.post('/viet/byid=:id', uploadAnh.single('ava'), (req, res) => {
    var id = req.params.id,
        tieude = req.body.ten,
        tomtat = req.body.tomtat,
        noidung = req.body.noidung,
        thoigian = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        if(req.file == null) var filename = "default12345zxc.png"
        else var filename = req.file.originalname;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("INSERT INTO tintuc(ten,tomtat,noidung,idquantridang,ngaydang,urlanh) VALUES('" + tieude + "','" + tomtat + "','" + noidung + "'," + id + ",'" + thoigian + "','" + filename + "')", (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.send("Gửi bài thành công");
        })
    })
})

router.get('/sua', (req, res) => {
    res.render('tintuc/suatin');
})

router.post('/sua', uploadAnh.single('ava'), (req, res) => {
    var id = req.body.id,
        name = req.body.ten,
        tomtat = req.body.tomtat,
        noidung = req.body.noidung,
        ava = req.file.originalname;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("UPDATE tintuc SET noidung='" + noidung + "',tomtat='" + tomtat + "',ten='" + name + "',urlanh='" + ava + "' WHERE id=" + id + ";", (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.send("Sửa bài thành công");
        })
    })
})

/*ajax*/
router.get("/tin=:id", (req, res) => {
    var id = parseInt(req.params.id);
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('SELECT * FROM tintuc ORDER BY id DESC OFFSET ' + id * 8 + ' LIMIT 8', (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.send(result.rows);
        })
    })
});

router.get("/laythongtin/id=:id", (req, res) => {
    var id = req.params.id;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("SELECT * FROM tintuc WHERE id=" + id, (err, result) => {
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