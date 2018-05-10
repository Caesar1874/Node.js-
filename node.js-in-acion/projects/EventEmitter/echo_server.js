
var net = require("net");
var server = net.createServer(function(socket) {
    socket.on("data", function(data) {
        socket.write(data);
    });
});
server.listen(8888, "127.0.0.1", function(){
    console.log("开始监听...");
});

/*// 注册一次性事件
socket.once("data", function(data) {
    socket.write(data);
});

// 自定义事件发射器
// 获取EventEmitter类
var events = require("events")
var EventEmitter = events.EventEmitter;

// 创建事件发射器实例
var channel = new EventEmitter();
// 自定义事件
channel.on("join", function() {
    console.log("Welcome!");
});
// 触发事件
channel.emit("join");*/

