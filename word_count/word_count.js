var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete() {
    completedTasks++;
    if (completedTasks == tasks.length) {
        for (var index in wordCounts) {
            console.log(`${index}: ${wordCounts[index]}`); // 当所有任务全部完成之后，列出文件中用到的每个单词的数量
        }
    }
}

function countWordsInText(text) {
    var words = text.toString().toLowerCase().split(' ').sort();
    for (var index in words) {
        var word = words[index];
        if (word) {
            wordCounts[word] = (wordCounts[word])? wordCounts[word] + 1: 1;
        }
    }
}

fs.readdir(filesDir, function(err, files) {
    if (err) throw err;
    for (var index in files) {
        var task = (function(file) {
            return function() {
                fs.readFile(file, 'utf-8', function(err, text) {
                    console.log('1', text);
                    if (err) throw err;
                    countWordsInText(text);
                    checkIfComplete();
                })
            }
        })(`${filesDir}/${files[index]}`);
        tasks.push(task);
    }
    for (var task in tasks) {
        tasks[task]();
    }
})