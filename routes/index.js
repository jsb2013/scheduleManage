
/*
 * GET home page.
 */

var waitScheduleDao = require("../dao/waitScheduleDao");
var userAccountDao = require("../dao/userAccountDao");
var config = require("../conf/common_config");
var log = require("../util/logger");
var logger = log.createLogger();

// 1.ログイン画面（get:/login）
exports.login = function(req, res){
    res.render('login', {
        loginFailed: false
    });
};

// 2.ログイン画面（post:/login）
exports.loginpost = function(req, res){
    var userid = req.body.userid;
    var password = req.body.password;
    
    function authCallback(err, userInfo){
        // システムエラー[TBA:システムエラー時の画面を用意する]
        if (err) {
            res.render('login', {
                error: 100,
                loginFailed: true
            });
            return;
        }
        
        // ユーザID若しくはパスワードに誤りあり
        if (!userInfo) {
            res.render('login', {
                error: 200,
                loginFailed: true
            });
            return;
        }
        
        // 認証に成功
        req.session.user = {
            userid: userInfo.user_id,
            username: userInfo.user_name
        };
        // メイン画面へ推移
        logger.info('ILOGIN10', null, userInfo.user_id);
        res.redirect('/main');
        return;
    }
    userAccountDao.authenticate(userid, password, authCallback);
};

// 3-1.メイン画面のヘッダー（get:/header）
exports.header = function(req, res) {
    // ログイン成功画面へ推移
    res.render('header', {});
    return;
};

// 3.メイン画面遷移（get:/main）
exports.main = function(req, res){
    if (req.session.user === undefined){
        res.redirect("/login");
        return;
    }
    
    var userid = req.session.user.userid;
    var username = req.session.user.username;
    function authCallback(err, isRegist, schdInfo){
        // 認証に失敗
        // 本当は別の画面を用意したい！（最後に見直す）
        if (err) {
            res.render('login', {
                error: 200,
                loginFailed: true
            });
            return;
        }
        // メイン画面へ推移
        res.render('main', {
            isRegist: isRegist,
            schdInfo: schdInfo,
            username: username
        });
        return;
    }
    waitScheduleDao.getWaitScheduleInfo(userid, authCallback);
};

// 4.ユーザ情報登録画面（get:/create）
exports.create = function(req, res) {
    // ログイン成功画面へ推移
    res.render('create', {});
    return;
};

// 5.ユーザ情報登録成功画面への推移（post:/create）
exports.createpost = function(req, res) {
    var userid = req.body.userid;
    var username = req.body.username;
    var password = req.body.password;
    
    function authCallback(err){
        // 認証に失敗
        // 本当は別の画面を用意したい！（最後に見直す）
        if (err) {
            res.render('login', {
                error: 200,
                loginFailed: true
            });
            return;
        }
        // 認証に成功
        req.session.user = {
            userid: userid,
            username: username
        };
    
        // ログイン成功画面へ推移
        res.render('create_success', {});
        return;
    }
    userAccountDao.insertUserAccount(userid, username, password, authCallback);
};
