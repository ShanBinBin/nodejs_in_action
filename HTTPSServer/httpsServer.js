var https = require('https');
var fs = require('fs');

var options = {
    // 作为配置项的SSL密钥和证书
    key: fs.readFileSync('../key_demo/key.pem'),
    cert: fs.readFileSync('../key_demo/key-cert.pem')
}

https.createServer(options, function (req, res) { // 第一个传入的是options,https模块和http模块的API几乎一样
    res.writeHead(200);
    res.end('hello world\n');
}).listen(3000, function () {
    console.log('Server start on 3000')
})