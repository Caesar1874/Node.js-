
var events = require("events");
var net = require("net");

// 创建服务器, 匿名函数是connection事件的监听器
// client是net.Socket的实例, connect, data, close是其事件
// 通过用户的ip (id) 和 socket （client）来标记用户

var server = net.createServer(function(client) {
    // ip 和 port
    var id = client.remoteAddress + ":" + client.remotePort;

    // 当用户连接到服务器时发出join事件
    client.on("connect", function() {
        channel.emit("join", id, client);
    });
    // 当用户发送数据时发出broadcast事件
    client.on("data", function(data) {
        data = data.toString();

        // 用户发送停止聊天服务的命令
        if(data == "shutdown\r\n") {
            channel.emit("shutdown");
        }
        // 广播
        channel.emit("broadcast", id, data);
    });

    // 用户断开连接是 发射leave事件
    client.on("close", function (){
        channel.emit("leave", id);
    });
});
server.listen(8888, "127.0.0.1", function() {
    console.log("开始监听。。。");
});

// 创建事件发射器实例
var channel = new events.EventEmitter();
// 保存用户信息： id: client
channel.clients = {};
// 监听器：id: function(senderId, message)
channel.subscriptions = {};

// 用户连接到服务器时：join事件监听器
channel.on("join", function(id, client) {
    this.clients[id] = client;
    // 订阅：其他用户(senderIs)广播时向当前用户(id)发送信息
    this.subscriptions[id] = function(senderId, message) {
        if(id != senderId) {
           this.clients[id].write(message);
       }
    };

    // 订阅：其他用户广播时向当前用户发送广播内容
    this.on("broadcast", this.subscriptions[id]);

    // 向当前用户显示已连接的用户数量
    var welcome = "Welcome! \n Guests online: " + this.listenerCount("broadcast");
    client.write(welcome + "\n");
});
// 设置事件发射器上监听器的最大数量
channel.setMaxListeners(50);

// 用户离开时移除订阅： leave事件监听器
channel.on("leave", function(id) {
    // 移除当前用户broadcast事件的监听器
    channel.removeListener("broadcast", this.subscriptions[id]);
    // 向其他用户广播当前用户已离开
    channel.emit("broadcast", id, id + "has left the chat. \n");
})

// 用户输入shutdown命令
channel.on("shutdown", function() {
    // 向所有用户广播
    channel.emit("broadcast", "", "Chat had shut down.\n");
    // 移除所有广播
    channel.removeAllListeners("broadcast");
});
