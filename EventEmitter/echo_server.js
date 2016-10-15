// 创建一个会将接收的内容发送回去的服务器
var net = require("net");
var server = net.createServer(function(socket) {
    socket.on("data", function(data) {
        socket.write(data);
    });
});
server.listen(8888, "127.0.0.1", function(){
    console.log("开始监听...");
});
