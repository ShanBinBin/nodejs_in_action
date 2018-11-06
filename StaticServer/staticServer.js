var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;

// 最基本的ReadStream服务器
var server = http.createServer(function(req, res) {
    var url = parse(req.url);
    var path = join(root, url.pathname); // 构造绝对路径
    fs.stat(path, function(err, stat) {
        if (err) {
            if ('ENOENT' == err.code) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        } else {
            res.setHeader('Content-Length', stat.size);
            var stream = fs.createReadStream(path); // 创建fs.ReadStream
            stream.pipe(res); // res.end()会在stream.pipe()内部调用
            stream.on('error', function(err) {
            res.statusCode = 500;
            res.end('Internal Server Error')
            }) 
        }
    })
    // stream.on('data', function(chunk) {
    //     res.write(chunk);
    // })
    // stream.on('end', function() {
    //     res.end();
    // })
})

server.listen(3000, function() {
    console.log('Server Start on 3000');
})
