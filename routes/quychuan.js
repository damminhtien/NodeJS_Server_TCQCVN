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

router.get("/nganhxaydung/xem", (req, res) => {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("SELECT * FROM quychuan WHERE idbonganh = 1", (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.render('quychuan/xem', { quychuan: result.rows, bonganh: "Ngành Xây Dựng", usr: req._passport.session });
        })
    })
});

router.get("/nganh/:id/xem", (req, res) => {
    var id = req.params.id;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("SELECT * FROM quychuan WHERE idbonganh = " + id, (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            var quychuan = result.rows;
            client.query("SELECT ten FROM bonganh WHERE id = " + id, (err, result) => {
                release();
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                res.render('quychuan/xem', { quychuan: quychuan, bonganh: result.rows[0].ten, usr: req._passport.session });
            })
        })
    })
});

router.get("/xem/:id", (req, res) => {
    var id = req.params.id;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("UPDATE quychuan SET star = star + 1 WHERE id = " + id);
        client.query("SELECT * FROM quychuan WHERE id = " + id, (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.render('quychuan/xemthongtin', { data: result.rows[0], usr: req._passport.session });
        })
    })
});

router.get("/sua/:id", (req, res) => {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("SELECT * FROM quychuan WHERE id = " + id, (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.render('quychuan/xem', { quychuan: result.rows[0], usr: req._passport.session });
        })
    })
});

/*ajax*/

// router.get("/:name/byid=:id", (req, res) => {
//     var name = req.params.name;
//     var id = parseInt(req.params.id);
//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Error acquiring client', err.stack);
//         }
//         client.query('SELECT * FROM ' + name + ' WHERE ' + name + '.uploadby =' + id, (err, result) => {
//             release();
//             if (err) {
//                 res.end();
//                 return console.error('Error executing query', err.stack)
//             }
//             res.send(result.rows);
//         })
//     })
// });

// router.get("/:da/gettop", (req, res) => {
//     var da = req.params.da;
//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Error acquiring client', err.stack);
//         }
//         client.query('SELECT star,id,uploadby,diem,huongdan,tendetai FROM ' + da + '  ORDER BY star DESC LIMIT 6', (err, result) => {
//             release();
//             if (err) {
//                 res.end();
//                 return console.error('Error executing query', err.stack)
//             }
//             res.send(result.rows);
//         })
//     })
// })

// router.get("/:name/get8from/:num", (req, res) => {
//     var name = req.params.name;
//     var num = req.params.num;
//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Error acquiring client', err.stack);
//         }
//         client.query('SELECT tendetai,uploadby,diem,id FROM ' + name + ' WHERE hoanthanh = true ORDER BY id DESC OFFSET ' + num * 8 + ' LIMIT 8', (err, result) => {
//             release();
//             if (err) {
//                 res.end();
//                 return console.error('Error executing query', err.stack)
//             }
//             res.send(result.rows);
//         })
//     })
// })

// router.post("/:da/nganh=:bm", (req, res) => {
//     var da = req.params.da;
//     var key = req.body.key.toLowerCase().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/\\|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)/g, ' ').replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i");
//     console.log(key);
//     var arrKey = key.split(" ");
//     var bomon = req.params.bm;
//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Error acquiring client', err.stack);
//         }
//         client.query("SELECT tendetai,uploadby," + da + ".id,star FROM " + da + ",giangvien WHERE hoanthanh = true AND giangvien.bomon = '" + bomon + "' AND giangvien.id = " + da + ".huongdan ORDER BY id ASC ", (err, result) => {
//             release();
//             if (err) {
//                 res.end();
//                 return console.error('Error executing query', err.stack)
//             }

//             var arrResultFixKey = []; /*tim kiem chinh xac*/
//             var arrResultHasAllKey = []; /*tim kiem cac key tach roi, chua tat ca cac key*/
//             var arrResultHasSomeKey = []; /*chua mot vai key*/
//             result.rows.forEach((data, index) => {
//                 var strCur = data.tendetai.toLowerCase().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/\\|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)/g, ' ').replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i");
//                 if (strCur.indexOf(key) != -1) {
//                     arrResultFixKey.unshift(data);
//                 } else {
//                     var flagAll = true; /* tra ve true neu tat ca key nam trong ten de tai*/
//                     var flagSome = false;
//                     arrKey.forEach((dt) => {
//                         if (strCur.indexOf(dt) == -1) {
//                             flagAll = false;
//                         } else {
//                             flagSome = true;
//                         }
//                     });
//                     if (flagAll == true) arrResultHasAllKey.unshift(data);
//                     else if (flagSome == true) arrResultHasSomeKey.unshift(data);
//                 }
//             });
//             res.render('doan/search-result', { arrFixKey: arrResultFixKey, arrHasAll: arrResultHasAllKey, arrHasSome: arrResultHasSomeKey, usr: req._passport.session, key: req.body.key, bomon: bomon });
//         })
//     })
// })

module.exports = router;