
/*
 * GET home page.
 */

// ログイン表示
exports.login = function(req, res){
  res.render('login', {});
};

// ログイン表示　→　
exports.loginpost = function(request, response){
    var pg = require('pg');
    var connectionString = process.env.DATABASE_URL
        || "tcp://postgres:postgres@localhost:5432/postgres";
        
    var name = request.body.username;
    var pass = request.body.password;
    
    pg.connect(connectionString, function(err, client) {
        var query = client.query('select * from user_account where user_id = $1 and password = $2', [name, pass]);
        var rows = [];
        
        query.on('row', function(row) {
            rows.push(row);
        });
        
        query.on('end', function(row,err) {
            if (rows.length == 0){
                response.render('index_org3', { 
                title: 'Express',
                data:rows
                });
            } else {
                response.render('index_org2', { 
                title: 'Express',
                data:rows
            });
            }
            request.session.user = {
                name: name,
                pass: pass
            };
        });
        
        query.on('error', function(error) {
            console.log("ERROR!!" + error);
            response.render('index_org2', {
                data: null,
                message: "ERROR is occured!"
            });
        });
    });
};

exports.create = function(req, res){
if(req.session.user === undefined){
	res.render('index_org2', { 
                title: 'Express'
            });
            } else {
            console.log(req.session.user.name);
  res.render('create', { title: 'Express' });
  }
};

exports.createpost = function(request, response){
    var pg = require('pg');
    var connectionString = process.env.DATABASE_URL
        || "tcp://postgres:hisashiE82@localhost:5432/postgres";
        
    var name = request.body.username;
    var pass = request.body.password;
    
    pg.connect(connectionString, function(err, client) {
        var query = client.query('INSERT INTO user_account(user_id, user_name, password, postcode, address, email, job, birthday) values ( $1, \'a\', $2, \'a\', \'a\', \'a\', \'a\', \'20130101\')',
         [name, pass], function(err, result){
            if (err){
                console.log("error. test.");
            }else{
                // ���[�U�ꗗ���ʂ��\�������B
                response.redirect('/display_all');
            }
        });
    });
};

exports.display = function(req, res){
    var pg = require('pg');
    var connectionString = process.env.DATABASE_URL
        || "tcp://postgres:hisashiE82@localhost:5432/postgres";
        
    var name = req.body.name;
    var pass = req.body.password;
    
    pg.connect(connectionString, function(err, client) {
        var query = client.query('select * from user_account');
        var rows = [];
        query.on('row', function(row) {
            rows.push(row);
        });
        query.on('end', function(row,err) {
                res.render('display_all', { 
                title: 'Express',
                data:rows
                });
            });
        query.on('error', function(error) {
            console.log("ERROR!!" + error);
                res.render('index_org2', {
                data: null,
                message: "ERROR is occured!"
            });
        });
    });
};
