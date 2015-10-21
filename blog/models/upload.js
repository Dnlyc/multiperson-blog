/**
 * Upload models
 */
var getUpload,
    postUpload;

/**
 * 请求文件上传页面
 * @param req
 * @param res
 */
getUpload = function (req, res) {
    res.render('upload', {
        title: '文件上传',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
}

/**
 * 推送文件上传
 * @param req
 * @param res
 */
postUpload = function (req, res) {
    req.flash('success', '文件上传成功!');
    res.redirect('/upload');
}

module.exports = {
    getUpload : getUpload,
    postUpload : postUpload
};