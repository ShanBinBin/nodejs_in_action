var fs = require('fs');
var path = require('path');

var args = process.argv.splice(2); // 去掉‘node cli_tasks.js’，只留下参数
var command = args.shift(); // 取出第一个参数（命令）
var taskDescription = args.join(' '); // 合并剩余的参数
var file = path.join(process.cwd(), '/.tasks'); // 根据当前的工作目录解析数据库的相对路径

// 定义辅助函数，用来获取已有的任务
let loadOrInitializeTaskArray = (file, cb) => {
    fs.exists(file, function (exists) { // 检查.tasks文件是否已经存在
        var tasks = [];
        if (exists) {
            fs.readFile(file, 'utf8', function(err, data) {
                if (err) throw err;
                console.log('data1', data);
                var data = data.toString();
                tasks = JSON.parse(data || '[]');
                console.log('tasks1', tasks)
                cb(tasks);
            })
        } else {
            cb([]);
        }
    })
}

// 列出任务的函数
let listTasks = (file) => {
    loadOrInitializeTaskArray(file, function(tasks) {
        for (var i in tasks) {
            console.log(tasks[i]);
        }
    })
}

// 存放任务的辅助函数
let storeTasks = (file, tasks) => {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
        if (err) throw err;
        console.log('Saved.');
    })
}

let addTask = (file, taskDescription) => {
    loadOrInitializeTaskArray(file, function (tasks) {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    })
}

// 确定CLI脚本应该采取什么动作
switch (command) {
    case 'list': // 'list'会列出所有已经保存的任务
        listTasks(file); 
        break;
    case 'add':
        addTask(file, taskDescription);
        break;
    default:
        console.log(`Usage: ${process.argv[0]} list|add [taskDescription]`); // 其他任何参数都会显示帮助
}