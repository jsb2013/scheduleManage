var pg = require('pg');
var sys = require("sys");
var config = require("../conf/common_config");

// ModelBase: Modelのベースクラス
var Database = function () {};

// データベースの認証情報を格納する
Database.prototype.dbAuth = config.connectionString;

// MySQLクライアントオブジェクトを作成する
Database.prototype._getClient = function () {
  if (this.client === undefined) {
    this.client = new pg.Client(this.dbAuth);
  }
  return this.client;
};

// クエリを実行する
Database.prototype.query = function (query, params) {
  var client = this._getClient();
  client.connect();
  return client.query(query, params);
};

// Databaseクラスのインスタンスを作成する
function createClient() {
  return new Database();
}

exports.createClient = createClient;

exports.getErrorMsg = function(error){
    return sys.inspect(error);
};
