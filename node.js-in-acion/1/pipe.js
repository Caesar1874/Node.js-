var http = require("http");
var fs = require("fs");
http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "image/png"});

    // 将图片写入响应
    fs.createReadStream("./image.png").pipe(response);

}).listen(8888, "localhost", function(){
    console.log("开始监听...");
});