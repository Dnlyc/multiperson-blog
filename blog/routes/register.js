var express = require('express'),
    router = express.Router();


router.get('/', function (req, res) {
    res.render('register', { title: 'зЂВс' });
});

router.post('/', function (req, res) {
});

module.exports = router;