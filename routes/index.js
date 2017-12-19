var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./trangchu/test',{usr: req._passport.session});
});

module.exports = router;
