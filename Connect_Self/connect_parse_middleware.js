/**
 * 解析cookie、请求主体和查询字符串的中间件
 */
const connect = require('connect');
const cookieParser = require('cookie-parser'); // cookieParser从connect中分离出来了
const bodyParser = require('body-parser');// bodyParser也分离出来了，而且用法有所改变，如下

/**
 * 封装对于不同的请求主体进行不同的限制
 * @param {String} type 请求主体类型
 * @param {Function} fn limit实例
 * @returns {Function} 返回组件
 */
function type(type, fn){ // fn在这里是个limit实例
    return function(req, res, next) {
        let ct = req.headers['content-type'] || '';
        if (0 !== ct.indexOf(type)) { //被返回的中间件首先检查content-type
            return next();
        }
        fn(req, res, next) // 之后会调用传入的limit组件实例
    }
}

let app = connect()
    // .use(cookieParser('tobi is a cool ferret'))
    // .use(limit('32kb')) // limit已经不在connect下了，分离位置待探讨
    // .use(type('application/x-www-form-urlencoded', connect.limit('64kb'))) // 对不同的请求主体分别进行不同的限制
    // .use(type('application/json', connect.limit('32kb')))
    // .use(type('image', connect.limit('2mb')))
    // .use(type('video', connect.limit('300mb')))
    // .use(bodyParser.urlencoded({ extended: false }))
    // .use(bodyParser.json())
    // .use(function (req, res) {
    //     console.log(req.body)
    //     console.log(req.files)
    //     // res.setHeader('Set-Cookie', 'foo=bar');
    //     // console.log(req.cookies);
    //     // console.log(req.signedCookies);
    //     res.end(`lalal`);
    // })
    .use(connect.query()) // connect的query应该是不在了
    .use(function (req, res, next) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(req.query));
    }).listen(3000);