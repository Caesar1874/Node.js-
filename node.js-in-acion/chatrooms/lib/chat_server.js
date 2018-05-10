
// 定义聊天状态的的变量
var socketio = require("socket.io");
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

// 聊天服务器函数
function chatServer(server) {
    
    // 启动Socket.IO服务器将其搭载在已有的HTTP服务器
    io = socketio.listen(server);
    console.log("socketio")
    // 指定socket.io向控制台输出日志的详细程度 【已经没有这个方法？】
    // io.set("log level", 1);

    // 定义每个用户连接的处理逻辑
    io.sockets.on("connection", function(socket) {
        
        //将用户加入lobby聊天室
        joinRoom(socket, "Lobby room");

        // 用户连接上来时赋予其访客名
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        
        //处理用户的消息: message
        handleMessageBroadcasting(socket, nickNames);

        // 创建聊天室或变更: join
        handleRoomJoining(socket);

        // 处理用户名变更: nameChange
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        
        // 提供已占用的聊天室列表
        socket.on("getRooms", function(id, message) {
            // socket.emit("rooms", io.sockets.manager.rooms); // manager
            var arr = [];
            for(var key in currentRoom) {
                arr.push(currentRoom[key]);
            }

            socket.emit("currRooms", arr);
            // console.log("rooms", arr)
        });

        // 用户断开连接后清除逻辑
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
}
module.exports = chatServer;

// 分配用户昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    // 生成访客昵称
    var name = `Guest${guestNumber}`;
    // 关联客户端连接id与用户昵称
    nickNames[socket.id] = name;
    // 将昵称发送给用户
    socket.emit("nameResult", {
        success: true,
        name: name
    });
    // 存储以占用的昵称
    namesUsed.push(name);

    // 昵称计数器
    return guestNumber + 1;
}

// 加入聊天室
function joinRoom(socket, room) {
    // 让用户进入房间
    socket.join(room);
    // 记录用户当前的房间
    currentRoom[socket.id] = room;
    // 告知用户他们进入了新房间
    socket.emit("joinResult", {room: room});
    // 告知房间里的其他用户新用户进入房间
    socket.to(room).emit("messageAccept", {   //broadcast..
        text: `<div class="chatroom-message-hint">${nickNames[socket.id]} has joined room.</div>`
    });

    // 获取房间内的所有用户
    // 所有的socket
    var usersInRoom;
    io.sockets.in(room).clients( function(err, clients) {
        if(err) {
            console.log(err, "err");
        } else {
            usersInRoom = clients;
            if( usersInRoom.length > 1) {
                var usersInRoomSummary = `Users curently in ${room}: `;
                // 汇总所有昵称
                for( var index in usersInRoom){
                    var userSocketId = usersInRoom[index];
                    if(userSocketId != socket.id) {
                        if(index > 0) {
                            usersInRoomSummary += ", ";
                        }
                        usersInRoomSummary +=  nickNames[userSocketId];
                    }
                }
                usersInRoomSummary += ".";
                console.log(usersInRoomSummary);
                socket.emit("messageAccept", {text: `<div class="chatroom-message-hint">${usersInRoomSummary}</div>`});
            }
        }
    });
    
}

// 处理聊天消息
function handleMessageBroadcasting(socket){
    socket.on("messageSend", function(message) {
        // console.log("message", message);
        socket.to(message.room).emit("messageAccept", { //.broadcast
            text: `<div class="chatroom-message-friend">
                        <img src="images/guest.jpg" alt="" class="chatroom-message-icon">
                        <span class="chatroom-message-text">
                            ${message.text}
                        </span>
                  </div>`
        });
    });
}
// <div class="chatroom-message-friend">${nickNames[socket.id]}: ${message.text}</div>

// 更换房间
function handleRoomJoining(socket) {
    socket.on("join", function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    })
}

// 用户更名
function handleNameChangeAttempts(socket, nickNames, namesUsed){
    socket.on("nameChange", function(name){
        // 昵称不能以Guest开始
        if(name.indexOf("Guest") === 0){
            socket.emit("nameResult", {
                success: false,
                message: "Names cannot begin with 'Guest'."
            });
        }else{
            // 用户名未注册
            if(namesUsed.indexOf(name) === -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                // 保存用户名
                namesUsed.push(name);
                nickNames[socket.id] = name;
                // 删除之前的用户名
                delete namesUsed[previousNameIndex];
                // 将用户名发送给用户
                socket.emit("nameResult", {
                    success: true,
                    name: name
                });
                // 向其他用户说明
                socket.to(currentRoom[socket.id]).emit("message", { //broadcast.
                    text: `${previousName} is now known as ${name}.`
                });
            }else{
                socket.emit("nameResult", {
                    success: false,
                    message: "That name is already in use."
                });
            }
        }
    });
}


// 用户断开连接
function handleClientDisconnection(socket) {
    socket.on("disconnect", function() {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    })
}
