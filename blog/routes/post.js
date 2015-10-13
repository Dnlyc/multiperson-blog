var express = require('express'),
    router = express.Router();


router.get('/', function (req, res) {
    res.render('post', { title: '发表博文' });
});

router.post('/', function (req, res) {
});

module.exports = router;