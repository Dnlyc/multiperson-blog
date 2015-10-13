var express = require('express'),
    router = express.Router();


router.get('/', function (req, res) {
    res.render('register', { title: '注册' });
});

router.post('/', function (req, res) {
});

module.exports = router;