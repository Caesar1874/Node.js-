var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");


// 缓存文件内容
var cache = {};

// 创建HTTP服务器
var server = http.createServer(function(req, res) {
    var filePath = false;

    //直接使用req.url可能有问题【没问题】
    // console.log("req.url", req.url);
    
    if(req.url === "/") {
        // 默认html文件
        filePath = "public/index.html";
    }else{
        // 转换为文件的相对路径
        filePath = `public${req.url}`; 
    }
    
    var absPath = `./${filePath}`;
    // 返回静态文件
    serveStatic(res, cache, absPath); 
});
// 启动服务器
server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});

// 辅助函数

// 发送404
function send404(res){
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("Error 404: resource not found");
    res.end();
}

// 发送文件数据
function sendFile(res, filePath, fileContents) {
    res.writeHead(200, {"Content-Type": mime.lookup(path.win32.basename(filePath)) });
    res.end(fileContents);
}

// 静态文件服务
function serveStatic(response, cache, absPath) {
    // 文件是否缓存在内存中
    if(cache[absPath]){
        sendFile(response, absPath, cache[absPath]); // 从内存中返回
    }else{
        // 硬盘中读取文件
        fs.readFile(absPath, function(err, data) {
            if(err) {
                send404(response);
            }else{
                // 缓存并发送
                cache[absPath] = data;
                sendFile(response, absPath, data);
            }
        });
    }
}



// Socket.IO聊天服务器模块

var chatServer = require("./lib/chat_server");

chatServer(server);



