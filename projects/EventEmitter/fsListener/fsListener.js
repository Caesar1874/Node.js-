// 创建继承EventEmitter的Watcher类, 监视指定目录
// 将目录中的文件名改为小写

var events = require("events");
var util = require("util");
var fs = require("fs");

function Watcher(watchDir, processDir) {
    // 要监视的目录
    this.watchDir = watchDir;
    // 防止修改后文件的目录
    this.processedDir = processDir;
}
// 继承事件发射器
util.inherits(Watcher, events.EventEmitter);
// 等价于
// Watcher.prototype = new events.EventEmitter();

// 扩展Watcher

// 开始监控指定目录
Watcher.prototype.start = function() {
    var watcher = this;
    // 当目录发生变化时调用回调
    fs.watchFile(watchDir, function() {
        watcher.watch();
        console.log("开始处理...");
    });
    console.log("开始监控...");
}

// 读取指定目录，对每个文件发出process事件
Watcher.prototype.watch = function() {
    // 保存this以在回调中引用
    var watcher = this;
    // 读取指定目录
    fs.readdir(this.watchDir, function(err, files) {
        if(err) {
            throw err;
        }
        // files是文件名数组
        files.forEach(function(ele) {
            watcher.emit("process", ele);
        });
    });
}

// 实例
var watchDir = "./watch";
var processedDir = "./done";
var watcher = new Watcher(watchDir, processedDir);

watcher.on("process", function(file) {
    var watchFile = `${this.watchDir}/${file}`;
    var processedFile = `${this.processedDir}/${file.toLowerCase()}`;
    // 修改文件名实际上修改的是路径
    fs.rename(watchFile, processedFile, function(err) {
        if(err) {
            throw err;
        }
    });

});

watcher.start();

