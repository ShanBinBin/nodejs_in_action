var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFileName = './rss_feeds.txt';

var tasks = [checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed];

// 任务1：确保包含RSS预订源URL列表的文件存在
function checkForRSSFile () {
    fs.exists(configFileName, function(exists) {
        if (!exists) {
            return next(new Error(`Missing RSS file: ${configFileName}`));// 有错误就尽早地返回
        }
        next(null, configFileName);
    })
}

// 任务2：读取并解析包含预定源URL的文件
function readRSSFile (configFileName) {
    fs.readFile(configFileName, function (err, feedList) {
        if (err) {
            return next(err);
        }
        feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split("\n"); // 将读取的内容转化为字符串，分割成一个数组
        var random = Math.floor(Math.random()*feedList.length);// 从数组中随机选择一个预定源URL
        next(null, feedList[random]);
    })
}

// 任务3：向选定的预定源发送HTTP请求获取数据
function downloadRSSFeed (feedUrl) {
    request({uri: feedUrl}, function (err, res, body) {
        if (err) return next(err);
        if (res.statusCode != 200) {
            return next(new Error('Abnormal response status code'))
        }
        next(null, body);
    })
}

// 任务4：将预定源数据解析到一个条目数组中
function parseRSSFeed (rss) {
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);
    if (!handler.dom.items.length) {
        return next(new Error('No RSS items found'));
    }

    var item = handler.dom.items.shift();
    console.log(item.title);
    console.log(item.link);
}

// 负责执行任务的next函数
function next (err, result) {
    if (err) throw err;

    var currentTask = tasks.shift(); // 从任务数组中取出下个任务

    if (currentTask) {
        currentTask(result); // 执行当前任务
    }
}
next();
