const http = require('http');

let req = http.request({
    method: 'POST',
    port: 3000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 发送超大数组
req.write('[');
let n = 300000;
while (n--) {
    req.write('"foo",'); 
}
req.write('"bar"]');
req.end();