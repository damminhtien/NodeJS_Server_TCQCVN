var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
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
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(flash());
app.use(passport.session());

var fs = require('fs');

app.use(logger('dev'));
app.use(bodyParser.json());

var index = require('./routes/index');
var tintuc = require('./routes/tintuc');
var gioithieu = require('./routes/gioithieu');
var quychuan = require('./routes/quychuan');
var admin = require('./routes/admin');
var nguoidung = require('./routes/nguoidung');
var dangnhap = require('./routes/dangnhap');
var thongbao = require('./routes/thongbao');
var dangxuat = require('./routes/dangxuat');
var tieuchuan = require('./routes/tieuchuan');

app.use('/', index);
app.use('/tintuc', tintuc);
app.use('/gioithieu', gioithieu);
app.use('/quychuan', quychuan);
app.use('/admin', admin);
app.use('/nguoidung', nguoidung);
app.use('/dangnhap', dangnhap);
app.use('/thongbao', thongbao);
app.use('/dangxuat', dangxuat);
app.use('/tieuchuan', tieuchuan);

passport.use(new LocalStrategy(
    (username, password, done) => {
      console.log(username + password);
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query('select id, tendangnhap, matkhau,tendaydu from nguoidung union select id, tendangnhap, matkhau,tendaydu from quantri union select id, tendangnhap, matkhau,tendaydu from admin', (err, result) => {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                var key = true;
                result.rows.forEach(function(usr) {
                  console.log(usr.tendangnhap + usr.matkhau);
                    if (usr.tendangnhap == username) {
                        if (usr.matkhau == password) {
                            key = false;
                            return done(null, usr, { usr: usr });
                        } else {
                            key = false;
                            return done(null, false, { message: 'Invalid password.' });
                        }
                    }
                });
                if (key == true) return done(null, false, { message: 'Invalid username.' });
            })
        })
    }
))

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(function(user, done) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('select id, tendangnhap, matkhau,tendaydu from nguoidung union select id, tendangnhap, matkhau,tendaydu from quantri union select id, tendangnhap, matkhau,tendaydu from admin', (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack)
            }
            result.rows.forEach(function(usr) {
                if (usr.id == user.id) {
                    return done(null, user);
                }
            });
        })
    })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
