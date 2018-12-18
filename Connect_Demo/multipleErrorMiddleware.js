const connect = require('connect');
const db = {
    users: ['tobi', 'loki', 'jane']
}

function hello(req, res, next) {
    if (req.url.match(/^\/hello/)) {
        res.end('Hello world\n');
    } else {
        next();
    }
}

function users(req, res, next) {
    let match = req.url.match(/^\/users\/(.+)/);// 表示匹配'/users/...'，并将省略号处的内容保存在match中，match格式：[ 'req.url', '匹配项保存位置', index: 0, input: 'req.url']
    if (match) {
        let user = '';
        db.users.forEach(function (u) {
            if (u === match[1]) {
                user = u;
            }
        });
        
        if (user) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        } else {
            let err = new Error('User not found');
            err.notFound = true;
            next(err);
        }
    } else {
        next();
    }
}

function pets(req, res, next) {
    if (req.url.match(/^\/pet\/(.+)/)) {
        foo();
    } else {
        next();
    }
}

// 不暴露非必要数据的错误处理组件
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.setHeader('Content-Type', 'application/json');
    if (err.notFound) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: err.message }))
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

function errorPage(err, req, res, next) {
    console.error(err.stack);
    res.end('<html><p>Internal Error</p></html>')
}

// 这里有两个错误处理的中间件，正常程序出错时，出错的中间件之后的非错误处理中间件不会被调用，会调用后面的错误处理中间件（用中间件参数数量标识，错误处理中间件多了一个err参数）
// 对于app主程序，想要碰到一个错误时渲染一个HTML错误页，但是/api想要返回详细的错误信息，所以需要两个错误处理中间件进行错误分离处理
let api = connect() 
    .use(users)
    .use(pets)
    .use(errorHandler);

let app = connect()
    .use(hello)
    .use('/api', api)
    .use(errorPage)
    .listen(5000)

