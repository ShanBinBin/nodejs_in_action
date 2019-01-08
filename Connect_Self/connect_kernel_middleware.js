const connect  = require('connect');
const logger = require('morgan'); // connect的logger更换成了morgan，需要单独引用

function hello(req, res, next) {
    res.end(`${req}`)
}

let app = connect()
    .use(logger())
    .use(hello)
    .listen(3000)
