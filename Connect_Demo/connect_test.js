const connect = require('connect');
const app = connect();
const logger = require('./logger');

// function logger(req, res, next) {
//     console.log('%s %s', req.method, req.url); // 这个log打印出来的req.url是/admin,而后面的admin中间件却是/，可能是因为admin挂载了/admin的原因
//     next();
// }

function hello(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello world');
}

function restrict(req, res, next) {
    let authorization = req.headers.authorization;
    if (!authorization) {
        return next(new Error('Unauthorized'));
    }

    let parts = authorization.split(' ');
    let scheme = parts[0];
    let auth = new Buffer(parts[1], 'base64').toString().split(':');
    let user = auth[0];
    let pass = auth[1];

    authenticateWithDatabase(user, pass, function (err) {
        if (err) {
            return next(err);
        }

        next();
    })
}
function authenticateWithDatabase(user, pass, callbak) {
    let authorizated = false;
    let users = [
        {user: 'tobi', pass: 'ferret'},
        {user: 'loki', pass: 'ferret'},
        {user: 'jane', pass: 'ferret'}
    ];
    users.forEach(function (item) {
        if (user === item.user && pass === item.pass) {
            authorizated = true;
        }
    })
    if (authorizated) {
        callbak();
    } else {
        callbak('authorizated faild')
    }
}

function admin(req, res, next) {
    switch (req.url) {
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['tobi', 'loki', 'jane']));
            break;
    }
}

app.use(logger(':method :url'));
app.use('/admin', restrict); // 当.use()的第一个参数是个字符串时，只有URL前缀与之匹配时，Connect才会调用后面的中间件
app.use('/admin', admin);
app.use(hello);

app.listen(5000);