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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./trangchu/test',{usr: req._passport.session});
});

router.post("/", (req, res) => {
	var vanban = req.body.vanban,
		tungay = req.body.tungay,
		denngay = req.body.denngay;
		tungay = (tungay == "" ?  '1/1/1900' : tungay);
		denngay = (denngay == "" ?  '1/1/2200' : denngay); 
    var key = req.body.key.toLowerCase().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/\\|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)/g, ' ').replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i");
    var arrKey = key.split(" ");
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("SELECT * FROM " + vanban + " WHERE ngaybanhanh >= '"+tungay+"' AND ngaybanhanh <= '"+denngay+"' ORDER BY id ASC ", (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }

            var arrResultFixKey = []; /*tim kiem chinh xac*/
            var arrResultHasAllKey = []; /*tim kiem cac key tach roi, chua tat ca cac key*/
            var arrResultHasSomeKey = []; /*chua mot vai key*/
            result.rows.forEach((data, index) => {
                var strCur = data.ten.toLowerCase().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/\\|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)/g, ' ').replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i");
                if (strCur.indexOf(key) != -1) {
                    arrResultFixKey.unshift(data);
                } else {
                    var flagAll = true; /* tra ve true neu tat ca key nam trong ten de tai*/
                    var flagSome = false;
                    arrKey.forEach((dt) => {
                        if (strCur.indexOf(dt) == -1) {
                            flagAll = false;
                        } else {
                            flagSome = true;
                        }
                    });
                    if (flagAll == true) arrResultHasAllKey.unshift(data);
                    else if (flagSome == true) arrResultHasSomeKey.unshift(data);
                }
            });
            res.render('trangchu/ketquatimkiem', { arrFixKey: arrResultFixKey, arrHasAll: arrResultHasAllKey, arrHasSome: arrResultHasSomeKey, usr: req._passport.session, vanban: req.body.vanban });
        })
    })
})

module.exports = router;
