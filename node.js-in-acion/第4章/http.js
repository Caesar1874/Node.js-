var http = require("http");
var server = http.creatServer(function(req, res) {
    res.write("Hello world");
    res.end();
});
server.listen("3000");

// write()和end()
res.end("Hello world");

// 设置响应头
var body = "Hello World";
res.setHeader("Content-Type", "text/html");
res.setHeader("Content-Length", body.length);
res.end(body);

var url = "http://www.google.com";
var body = `<p>Redirecting to <a  href = "${url}">${url}</a></p>`;
res.setHeader("Location", url);
res.setHeader("Content-Length", body.length);
res.setHeader("Content-Type", text/html);
res.statusCode = 302;
res.end(body);
