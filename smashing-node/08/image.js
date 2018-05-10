var http = require("http");
var fs = require("fs");
var url = require("url");
var server = http.createServer(function(req, res) {
    var method = req.method;
    var pathname = url.parse(req.url).pathname;

    if(method === "GET" && pathname.slice(0, 7) === "/images") {
        fs.stat(__dirname + req.url, function(err, stat) {
            // 检查文件出错或路径不是文件
            if( err || stat.isFile() === false) {
                resNotFound(res);
                return;
            } else {
                serve(res, __dirname + req.url, "application/jpg");
            }
        } )
    } else if(method === "GET" && pathname === "/") {
        serve(res, `${__dirname}/image.html`, "text/html");
    } else {
        resNotFound(res);
    }
});
server.listen(3000);

function serve(res, path, type) {
    res.writeHead(200, {"Content-Type": type});
    fs.createReadStream(path).pipe(res);

    // 等价于
/*    fs.createReadStream(path)
        .on("data", function(data) {
            res.write(data);
        })
        .on("end", function() {
            res.end();
        })*/
}

function resNotFound(res) {
    res.writeHead(400);
    res.end("Not Found");
}