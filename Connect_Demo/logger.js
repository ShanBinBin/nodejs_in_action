// 构建可配置日志中间件
function setup(format) {
    let regexp = /:(\w+)/g; // 用正则表达式匹配请求属性
    return function logger(req, res, next) { // Connect真正使用的logger组件
        let str = format.replace(regexp, function (match, property) { // 格式化请求的日志条目
            return req[property];
        })
        console.log(str); // 将日志条目输出到控制台
        next(); // 将控制权交给下一个中间件
    }
}

module.exports = setup; // 导出logger的setup函数
