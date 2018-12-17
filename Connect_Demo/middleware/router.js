const parse = require('url').parse;

module.exports = function route(obj) {
    return function (req, res, next) {
        if (!obj[req.method]) {
            next();
            return;  // 注意要停止之后的后续操作
        }

        let routes = obj[req.method];
        let url = parse(req.url); // 解析url，以便和pathname匹配
        let paths = Object.keys(routes);

        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let fn = routes[path];
            path = path
                .replace(/\//g, '\\/')
                .replace(/:(\w+)/g, '([^\\/]+)');
            let re = new RegExp('^' + path + '$'); // 构造正则表达式
            let captures = url.pathname.match(re);
            if (captures) { // 尝试和pathname匹配
                let args = [req, res].concat(captures.slice(1)); // 传递被捕获的分组
                fn.apply(null, args);
                return; // 有匹配的则返回，放之后续的next调用
            }
        }
        next();
    }
}