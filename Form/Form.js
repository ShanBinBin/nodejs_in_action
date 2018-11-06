var http = require('http');
var qs = require('querystring');
var items = [];

let show = res => {
    let html = '<html><head><title>Todo List</title></head><body>'
               + '<h1>Todo List</h1>'
               + '<ul>'
               + items.map((item) => `<li>${item}</li>`).join('')
               + '</ul>'
               + '<form method="post" action="/">'
               + '<p><input type="text" name="item" /></p>'
               + '<p><input type="submit" value= "Add Item" /></p>'
               + '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

let showEnd = res => {
    let html = '<html><head><title>Todo List</title></head><body>'
               + '<h1>Success</h1>'
               + '</body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

let notFound = res => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}

let badRequest = res => {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
}

let add = (req, res) => {
    let body = '';
    req.setEncoding('utf-8');
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        let obj = qs.parse(body);
        items.push(obj.item);
        showEnd(res);
    })
}

var server = http.createServer((req, res) => {
    if ('/' === req.url) {
        switch (req.method) {
            case 'GET':
                show(res);
                break;
            case 'POST':
                add(req, res);
                break;
            default:
                badRequest(res);
        }
    } else {
        notFound(res);
    }
})

server.listen(3000, () => {
    console.log('Server Start On 3000')
})

