
/*
 * GET home page.
 */

var waitScheduleDao = require("../dao/waitScheduleDao");
var users = require("../models/users");
var config = require("./common_config");

// 1.ログイン画面（get:/login）
exports.login = function(req, res){
  res.render('login', {});
};

// 2.ログイン画面（post:/login）
exports.loginpost = function(req, res){
    var userid = req.body.userid;
    var password = req.body.password;
    
    function authCallback(err, userInfo){
        // 認証に失敗
        if (err || userInfo === null) {
            res.render('login', {
                error: 100,
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
        res.redirect('/main');
        return;
    }
    users.authenticate(userid, password, authCallback);
};

// 3.メイン画面遷移（get:/main）
exports.main = function(req, res){
    if (req.session.user === undefined){
        res.redirect("/login");
        return;
    }
    
    var userid = req.session.userid;
    var username = req.session.username;
    function authCallback(err, schdInfoList){
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
            schdInfoList: schdInfoList,
            perTime: config.perTime,
            username: username
        });
        return;
    }
    waitScheduleDao.getWaitScheduleByuserIdAndWait(userid, authCallback);
};

// 4.ユーザ情報登録画面（get:/create）
exports.createSuccess = function(req, res) {
    if (req.session.user === undefined){
        res.redirect("/login");
        return;
    }
    // ログイン成功画面へ推移
    res.render('create', {});
    return;
};

// 5.ユーザ情報登録成功画面への推移（post:/create）
exports.createSuccess = function(req, res) {
    if (req.session.user === undefined){
        res.redirect("/login");
        return;
    }
    
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
    users.insertUserAccount(userid, username, password, authCallback);
};
