var express = require('express'),
    router = express.Router();


router.get('/', function (req, res) {
  res.render('users', { title: '个人信息' });
});

router.post('/', function (req, res) {
});

module.exports = router;