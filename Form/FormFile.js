var http = require('http');
var formidable = require('formidable');

let isFormData = (req) => {
    let type = req.headers['content-type'] || '';
    return 0 === type.indexOf('multipart/form-data');
}

const requestField = {
    'GET': show = (req, res) => {
        let html = ''
            + '<form method="post" action="/" enctype="multipart/form-data">'
            + '<p><input type="text" name="name" /></p>'
            + '<p><input type="file" name="file" /></p>'
            + '<p><input type="submit" value="Upload" /></p>'
            + '</form>';
        res.setHeader("Content-Type", 'text/html');
        res.setHeader('Content-Length', Buffer.byteLength(html));
        res.end(html);
    },
    'POST': upload = (req, res) => {
        if (!isFormData(req)) {
            res.statusCode = 400;
            res.end('Bad Requset: expecting multipart/form-data');
            return;
        }
    
        var form = new formidable.IncomingForm();
        // form.on('field', (field, value) => {
        //     console.log('field', field);
        //     console.log('value', value);
        // })
        // form.on('file', (name, file) => {
        //     console.log('name',name);
        //     console.log('file', file);
        // })
        // form.on('end', () => {
        //     res.end('upload complete');
        // })
        form.on('progress', (bytesReceived, bytesExpected) => {
            let percent = Math.floor(bytesReceived / bytesExpected * 100);
            res.write('<div style="display:inline-block;height:500px">'
            + `<div style="background-color:green; width:5px; height:${percent}%"> </div>`
            + '</div>', 'utf-8')
        })
        form.parse(req, (err, fields, files) => {
            console.log('fields', fields);
            console.log('files', files);
            res.end('upload complete');
        });
    },
    'other': 'nothing'
};

var server = http.createServer((req, res) => {
    let dealReq = requestField[req.method] || requestField['other'];
    dealReq(req, res);
})

server.listen(3000);