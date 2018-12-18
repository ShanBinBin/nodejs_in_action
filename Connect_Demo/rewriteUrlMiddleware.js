const connect = require('connect');
const url = require('url');

function rewrite(req, res, next) {
    let path = url.parse(req.url).pathname;
    let match = path.match(/^\/blog\/posts\/(.+)/); 
    if (match) { // 只针对/blog/posts请求查找
        findPostIdBySlug(match[1], function (err, id) {
            if (err) return next(err); // 如果查找出错，则通知错误处理器并停止处理
            if (!id) return next(new Error('User not found')); // 如果没有找到跟缩略名相对应的ID，则返回错误信息
            req.url = `/blog/posts/${id}`; // 重写req.url属性，以便后续中间件可以使用正式的ID
            next();
        })
    } else {
        next();
    }
}

const app = connect()
    .use(rewrite)
    .use(showPost)
    .listen(5002)

