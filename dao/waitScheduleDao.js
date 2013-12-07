/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var database = require("./database");
var client = database.createClient();

//　ユーザ&パスワードのチェックを行う。
exports.getWaitScheduleInfo = function(userid, callback){
    
    function callbackFirst(err, isUserid){
        if (err) {
            callback(err);
            return;
        }
        // ユーザが存在しない場合
        if (isUserid === null){
            callback(err, true, null);
            return;
        }
        // ユーザが存在するので、順番情報を取得する。
        getWaitScheduleByuserId(userid, callbackSecond);
    }
    
    function callbackSecond(err, schdInfoList){
        if (err) {
            callback(err);
            return;
        }
        // ユーザが存在しない場合
        callback(null, false, schdInfoList);
    }
    
    getWaitScheduleByuserId(userid, callbackFirst);
};

function getWaitScheduleByuserId(userid, callback){
    var query = client.query('select * from wait_schedule where user_id = $1', [userid]);
    var rows = [];
        
    query.on('row', function(row) {
        rows.push(row);
    });
        
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            callback(err, null);
            return;
        }
        // ユーザがない場合
        if (rows.length === 0){
            callback(false, null);
            return;
        }
        // エラーが発生しない場合
        callback(false, rows);
        return;
    });
        
    query.on('error', function(error) {
        var errorMsg = client.getErrorMsg(error);
        console.log(errorMsg);
        return;
    });
}    

function getWaitScheduleByuserIdAndWait(userid, callback){
    var query = client.query('select * from wait_schedule where status = \'1\' and register_time < (select register_time from wait_schedule where user_id = $1)', [userid]);
    var rows = [];
    
    query.on('row', function(row) {
        rows.push(row);
    });
    
    query.on('end', function(row,err) {
        // エラーが発生した場合
        if (err){
            callback(err, null);
            return;
        }
        // エラーが発生しない場合
        callback(false, rows);
        return;
    });
    
    query.on('error', function(error) {
        var errorMsg = client.getErrorMsg(error);
        console.log(errorMsg);
        return;
    });
}
        
