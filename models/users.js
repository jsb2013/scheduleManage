/*
 * ユーザ待ちステータステーブルに
 * アクセスする為のクラス
 */
var crypto = require('crypto');
var pg = require('pg');
var config = require("./common_config");
var connectionString = config.connectionString;

/* ログイン処理 */
exports.authenticate = function(userid, password, callback) {
    pg.connect(connectionString, function(err, client) {
        var query = client.query('select * from user_account where user_id = $1', [userid]);
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
            // ユーザが存在する場合
            if (rows.length > 0) {
                var userinfo = rows[0];
                if (userinfo.password == _hashPassword(password)) {
                    delete userinfo.password;
                    callback(err, userinfo);
                    return;
                }
            }
            // ユーザが存在しない場合
            // (想定)画面入力されたUSERIDが登録されていない場合
            // (想定)画面入力されたPASSWORDが誤っている場合
            callback(err, null);
            return;
        });
    });
};

/* ユーザ登録 */
exports.insertUserAccount = function(userid, username, password, callback) {
    // パスワードは必ず値が設定されている前提（Clientサイドでチェック済）
    var hashedPassword = _hashPassword(password);
    pg.connect(connectionString, function(err, client) {
        client.query('INSERT INTO user_account(user_id, user_name, password, postcode, address, email, job, birthday) values ( $1, $2, $3, \'\', \'\', \'\', \'\', now())', [userid, username, hashedPassword], function(err, result){
            if (err){
                callback(err);
            }else{
                callback(false);
            }
        });
    });    
};

// パスワードのハッシュを作成する
function _hashPassword(password) {
  if (password === '') {
    return '';
  }
  var shasum = crypto.createHash('sha256');
  shasum.update(password);
  return shasum.digest('hex');
}

// ユーザーを作成する
createUser = function (password) {
  var hashedPassword = _hashPassword(password);
  // TBA
};
