
function Chat(socket) {
    this.socket = socket;
}
// 发送聊天消息
Chat.prototype.sendMessage = function(room, text) {
    var message = {
        room: room,
        text: text
    };
    this.socket.emit("messageSend", message);
};
// 变更房间
Chat.prototype.changeRoom = function(room) {
    this.socket.emit("join", {newRoom: room });
};

// 处理聊天命令
// join命令加入或创建房间
// nick命令修改昵称
Chat.prototype.processCommand = function(command) {
    // 解析命令
    var words = command.split(" ");

    // 命令中的指令部分
    var command = words[0].substring(1, words[0].length).toLowerCase();
    // console.log("command", command);
    var message= false;
    switch(command){
        case "join":
            // 移除命令中的指令部分
            words.shift();
            // 获取命令中的房间
            var room = words.join(" ");
            // console.log("room", room);
            // 变更
            this.changeRoom(room);
            break;
        case "nick":
            words.shift();
            var name = words.join(" ");
            this.socket.emit("nameChange",name);
            break;
        // 无法识别的命令
        default:
            message= "Unrecognized command.";
            break;
    }
    return message;
}





