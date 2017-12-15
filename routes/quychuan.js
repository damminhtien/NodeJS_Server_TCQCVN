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
            res.render('quychuan/sua', { quychuan: result.rows[0], usr: req._passport.session });
        })
    })
});

router.post("/sua/:id", uploadQC.single('file'), (req, res) => {
    var ten = req.body.ten,
        quyetdinhso = req.body.quyetdinhso;
    var duongdan = ten.toLowerCase().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/\\|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\ /g, '').replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i") + quyetdinhso,
        ghichu = req.body.ghichu,
        ngaydang = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        kyhieuso = req.body.kyhieuso,
        linhvuc = req.body.linhvuc,
        idbonganh = req.body.idbonganh,
        idquantridang = req.body.idquantridang;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("UPDATE quychuan SET ten='" + ten + "',ngaydang='" + ngaydang + "',ghichu='" + ghichu + "',kyhieuso='"+kyhieuso+",quyetdinhso='"+quyetdinhso+"',linhvuc='"+linhvuc+"',idbonganh="+idbonganh+",idquantridang="+idquantridang+" WHERE uploadby='" + id + "'", (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.send('Sửa thành công, <a href=\"./quychuan/sua\"> nhấn vào đây để quay lại </a>');
        })
    })
})

var storageQC = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/quychuan');
    },
    filename: function(req, file, cb) {
        cb(null, req.body.ten.toLowerCase().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/\\|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\ /g, '').replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i"); +'.pdf') + req.body.quyetdinhso;
    }
})

var uploadQC = multer({ storage: storageQC });

router.post("/them", uploadQC.single('file'), (req, res) => {
    var ten = req.body.ten,
        quyetdinhso = req.body.quyetdinhso;
    var duongdan = ten.toLowerCase().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/\\|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\ /g, '').replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i") + quyetdinhso,
        ghichu = req.body.ghichu,
        ngaydang = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        kyhieuso = req.body.kyhieuso,
        linhvuc = req.body.linhvuc,
        idbonganh = req.body.idbonganh,
        idquantridang = req.body.idquantridang;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query("INSERT INTO quychuan(ten,quyetdinhso,duongdan,ghichu,ngaydang,kyhieuso,linhvuc,idbonganh,idquantridang) VALUES ('"+ten+"','"+quyetdinhso+"','"+duongdan+"','"+ghichu+"','"+ngaydang+"','"+kyhieuso+"','"+linhvuc+"','"+idbonganh+"','"+idquantridang+"');", (err, result) => {
            release();
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            res.send('Thêm thành công, <a href=\"./quychuan/them\"> nhấn vào đây để quay lại </a>');
        })
    })
})

router.get('/getpdf/:duongdan', (req, res) => {
    if (req.isAuthenticated()) {
        fs.readFile("./uploads/quychuan/"+req.params.duongdan, function(err, data) {
            res.contentType("application/pdf");
            res.end(data);
        })
    } else {
        res.end("Bạn phải đăng nhập để xem tệp này");
    }
})

/*ajax*/

router.get('/laythongtin/:id',(req, res) => {
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
            res.send(result.rows[0]);
        })
    })
})

module.exports = router;