var http = require("http");
var url = require("url");

function start(route, handle){
    function onRequest(request, response) {

        //解析请求
        var pathname = url.parse(request.url).pathname;
        console.log(`来自${pathname}的请求已收到`);

        // 处理post请求
        var postData = "";
        // 指定数据的编码方式
        request.setEncoding("utf8");
        // 读取数据
        request.addListener("data", function(postDataChunk){
            postData += postDataChunk;
            console.log(`已接受POST数据${postDataChunk}.`);
        });
        // 读取数据完毕
        request.addListener("end", function(){
            //将请求处理函数对象，路径，以及response, postData传递给路由，响应由路由实现
            route(handle, pathname, response, postData);
        });
    }
    // 创建服务器, onRequest函数是request事件的监听函数
    http.createServer(onRequest).listen(8888, "localhost", function(){
        console.log("开始监听...")
    }); //开始接受指定端口、域名的链接， callback是listening事件的监听函数
    console.log("服务器已经启动");
}
exports.start = start;
