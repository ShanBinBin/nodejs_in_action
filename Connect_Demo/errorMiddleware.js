const connect = require('connect');

function errorHandler() {
    let env = process.env.NODE_ENV || 'development'; //根据不同环境对错误进行不同的处理，例如在开发环境下将错误发送给客户端进行错误报告，在生产环境中则只返回简单的错误提示，以免暴露敏感信息
    return function (err, req, res, next) { // 错误中间件定义四个参数
        res.statusCode = 500;
        switch (env) {
            case 'development':
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(err));
                break;
            default:
                res.end('Server error')
        }
    }
}

connect()
    .use(function hello(req, res) {
        foo();
        res.setHeader('Content-Type', 'text/plain');
        res.end('hello world');
    })
    .listen(5000)