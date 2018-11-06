var qs = require('querystring');

exports.sendHtml = function(res, html) { // 发送HTML响应
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

exports.parseReceivedData = function(req, cb) { // 解析HTTP POST数据
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { body += chunk; });
    req.on('end', function() {
        var data = qs.parse(body);
        cb(data);
    })
}

exports.actionForm = function(id, path, label) { // 渲染简单的表单
    var html = '<form method="POST" action="' + path + '">' +
        '<input type="hidden" name="id" value="' + id + '">' + 
        '<input type="submit" value="' + label + '" />' + 
        '</form>';
    return html;
}

exports.add = function(db, req, res) {
    exports.parseReceivedData(req, function(work) {
        db.query(
            'INSERT INTO work (hours, date, description) '+ 
            ' VALUES (?, ?, ?)', // 问号是占位符，防止遭到SQL注入攻击
            [work.hours, work.date, work.description], //工作记录数据， 会替换占位符
            function (err) {
                if (err) throw err;
                exports.show(db, res); // 给用户显示工作记录清单
            }
        )
    })
}


