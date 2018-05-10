var fs =require("fs");
var request = require("request");
var htmlparser = require("htmlparser");
var configFilename = "./rss_feeds.txt";

// 把任务保存到数组中
var tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFeed,
    parseRSSFeed
];
// 执行任务
function next(err, result) {
    if(err) {
        throw err;
    }
    var currentTask = tasks.shift();
    if(currentTask) {
        currentTask(result);
    }
}


// 任务1：检查rss文件是否存在
function checkForRSSFile() {
    fs.exists(configFilename, function(exists) {
        if(!exists) {
            return next(new Error("Missing RSS file: " + configFilename));
        }
        // 如果存在进行下一个任务，传递文件名作为参数
        next(null, configFilename);
    })
}

// 任务2：读取并解析文件
function readRSSFile(configFilename) {
    fs.readFile(configFilename, function(er, feedList) {
        if(err) {
            return next(err);
        }
        feedList = feedList.toString().replace(/^\s+|\s+$/g, "");
    })
}

