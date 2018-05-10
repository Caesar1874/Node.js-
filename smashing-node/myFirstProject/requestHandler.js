//请求处理函数：供路由调用
// 请求处理函数接受response, 完成必要的操作后移回调的方式做出响应；
var querystring = require("querystring");

function start(response, postData){
    console.log("已调用start请求处理函数。");
    var body = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>template</title>
        </head>
        <body>
            <form action="/upload" method = "POST">
                <textarea name="text" cols="60" rows="20"></textarea>
                <input type="submit" value="Submit text" />
            </form>
        </body>
        </html>
    `;

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, postData){
    console.log("已调用upload请求处理函数。");
    response.writeHead(200, {"Content-Type": "text/plain"});
    var data = querystring.parse(postData).text;
    response.write("You've sent the text: " + data);
    response.end();
}

exports.start = start;
exports.upload = upload;