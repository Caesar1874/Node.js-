
var http = require("http");
var fs = require("fs");

// 创建服务器，并用回调定义响应逻辑
/*http.createServer(function(req, res) {

    if(req.url === "/") {
        // 读取json文件， 并用回调定义如何处理其中的内容
        fs.readFile("./titles.json", function(err, data) {
            // 如果出错, 输出错误日志， 并向客户端返回“Server Error"
            if(err) {
                consolog.error(err);
                res.end("Server Error");
            } else {
                // 解析JSON
                console.log("json",data)
                var titles = JSON.parse(data.toString());

                // 读取html模板
                fs.readFile("./template.html", function(err, data) {
                    if(err) {
                        console.error(err);
                        res.end("Server Error");
                    } else {
                        console.log("html Data", data);
                        // data 是 Buffer
                        var tmpl = data.toString();
                        // titles是数组，拼接为字符串
                        var html = tmpl.replace("%", titles.join("</li><li>"));
                        res.writeHead(200, {"Content-Type": "text/html"});
                        res.end(html);
                    }
                });
            }
        });
    }
}).listen(8000, "localhost", function() {
    console.log("开始监听...");
});*/

// 将回调处理为命名函数，减少嵌套层级
// 创建服务器
http.createServer(function(req, res) {
    if( req.url = "/"){
        getTitle(res);
    }
}).listen(8000, "localhost", function() {
    console.log("开始监听...");
});

// 获取标题
function getTitle(res) {
    fs.readFile("./titles.json", function(err, data) {
        if(err) {
            handleErr(err,res);
        } else {
            var titles = JSON.parse(data.toString());
            getTemplate(titles, res);
        }
    });
}
// 获取模板
function getTemplate(titles, res){
    fs.readFile("./template.html", function(err, data) {
        if(err) {
            handleErr(err, res);
        } else {
            formatHtml(titles, data.toString(), res)
        }
    })
}

// 生成html并相应
function formatHtml(titles, tmpl, res) {
    var html = tmpl.replace("%", titles.join("</li><li>"));
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(html);
}

// 处理错误
function handleErr(err, res) {
    console.log(err);
    res.end("Server Error");
}
