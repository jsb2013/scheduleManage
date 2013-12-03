/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */

var pg = require('pg');
var config = require("./common_config");
var connectionString = config.connectionString;

exports.getWaitScheduleByuserIdAndWait = function(userid, callback){
    pg.connect(connectionString, function(err, client) {
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
            callback(err, rows);
            return;
        });
    });
};
        
