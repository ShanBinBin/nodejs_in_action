const connect = require('connect');
const router = require('./middleware/router');

let routes = {
    GET: {
        '/users': function (req, res) {
            res.end('tobi, loki, ferret');
        },
        '/user/:id': function (req, res, id) {
            res.end('user ' + id);
        }
    },
    DELETE: {
        '/user/:id': function (req, res, id) {
            res.end('deleted user ' + id)
        }
    }
};

connect()
    .use(router(routes)) // 将路由对象传给路由器的setup函数
    .listen(5001);