var express = require('express');
var router = express.Router();

/* GET users listing. */
// 이후 회원가입 적용시 유저 정보 관련 api
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
