var express = require('express'),
    router = express.Router();


router.get('/', function (req, res) {
    res.render('post', { title: '·¢±í' });
});

router.post('/', function (req, res) {
});

module.exports = router;