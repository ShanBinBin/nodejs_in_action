var http = require('http');
var mysql = require('mysql');
var work = require('./lib/timetrack');

var db = mysql.createConnection({ // 连接MySQL
    host: '127.0.0.1',
    user: 'admin',
    password: '123456',
    database: 'timetrack'
})

var server = http.createServer(function(req, res) {
    switch (req.method) {
        case 'POST':
            switch (req.url) {
                case '/':
                    work.add(db,req,res);
                    break;
                case '/archive':
                    work.archive(db, req, res);
                case '/delete':
                    work.delete(db, req, res);
                    break;
            }
            break;
        case 'GET':
            switch (req.url) {
                case '/':
                    work.show(db, res);
                    break;
                case '/archived':
                    work.showArchived(db, res);
                    break;
            }
            break;
    }
})

db.query(
    "CREATE TABLE IF NOT EXISTS work ("
    + "id INT(10) NOT NULL AUTO_INCREMENT, "
    + "hours DECIMAL(5,2) DEFAULT 0, "
    + "date DATE, "
    + "archived INT(1) DEFAULT 0, "
    + "description LONGTEXT, "
    + "PRIMARY KEY(ID))",
    function(err) {
        if (err) throw err;
        console.log('Server Start...');
        server.listen(3000, '127.0.0.1');
    }
)