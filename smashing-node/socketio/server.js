var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var socketio = require("socket.io");



var app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
// app.listen(3000); 不需要， 手动传入app并监听

var server = http.createServer(app);
server.listen(3000);

var io = socketio(server);
io.on("connection", function(socket) {
    console.log("Someone connect");
    
    // 有新用户加入时发出通告
    socket.on("join", function(name) {
        socket.nickname = name;
        socket.broadcast.emit("announcement", name + " joined the chat.");
        console.log("join");
    });

    // 发送消息
    socket.on("text", function(message, fn) {
        socket.broadcast.emit("text", socket.nickname, message);
        fn(Date.now());
    });
});


