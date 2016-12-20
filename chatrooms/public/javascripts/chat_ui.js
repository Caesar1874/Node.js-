

// 客户端程序初始化逻辑

var socket = io("http://localhost:3000");
$(document).ready(function() {
    var chatApp = new Chat(socket);
    var str = `
        <div class="guest-card">
                <img src="images/guest2.jpg" alt="" class = guest-card-icon>
                <h3 class = "guest-card-name">Bob Dylan</h3>
                <p class="guest-card-info">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, consequatur hic magnam sed velit voluptas.
                </p>
            </div>`;
    $(".chat-guest").append(str);

    // 提交表单发送消息
    $(".chatroom-input").focus();
    $(".chatroom-form").submit(function() {
        processUserInput(chatApp, socket);
        return false;
    });
    // 显示接收到的消息
    socket.on("messageAccept", function(message) {
        // console.log("message", message);
        // var newElement = $("<div class = 'chatroom-message-hint'></div>").text(message.text);
        // var newElement = `<div class = 'chatroom-message-hint'>${message.text}</div>`
        $(".chatroom-message").append(message.text);
    });
    // 显示用户名 或 更名结果
    socket.on("nameResult", function(result) {
        // console.log(result);
        var message;
        if(result.success) {
            message = `Your are now known as ${result.name}.`;
        } else {
            message = result.message;
        }
        $("#message").append(divMessageHint(message));
    });

    // 显示可用的房间列表
    // 定期请求可用房间列表
    setInterval(function() {
        socket.emit("getRooms");
    }, 1000);
    socket.on("currRooms", function(rooms) {
        // console.log("rooms", rooms);
        $(".roomlist-avail").empty();
        rooms.forEach(function(room) {
            // room = room.substring(1, room.length);
            if(room !== ""){
                // console.log(divMessageHint(room));
                $(".roomlist-avail").append(`<div class="roomlist-room">${room}</div>`);
            }
        });

        // 点击房间名切换房间
        $(".roomlist-room").click(function() {
            // console.log("click");
            chatApp.processCommand("/join " + $(this).text());//空格
            // console.log($(this).text());
            $("#send-message").focus();
        });
    });
    // 显示变更房间的结果
    socket.on("joinResult", function(result) {
        $(".chatroom-name").html(`<span>${result.room}</span>`);
        $(".chatroom-message").append(divMessageHint(`joined Room ${result.room}`));
    });

});

// 预处理文本数据
// hint
function divMessageHint(message) {
    return `<div class = "chatroom-message-hint">${message}</div>`;
}
// self
function divMessageSelf(message) {
    return `<div class="chatroom-message-self">
                <img src="images/guest2.jpg" alt="" class="chatroom-message-icon">
                <span class="chatroom-message-text">${message}</span>
            </div>`;
}
function divMessageFriend(message) {
    return `<div class = "chatroom-message-friend">${message}</div>`;
}

// 处理原始的用户输入
function processUserInput(chatApp, socket) {
    var message = $(".chatroom-input").val();
    var systemMessage;

    // 命令
    if(message.charAt(0) === "/") {
        systemMessage = chatApp.processCommand(message);
        // 不能识别的命令
        if(systemMessage) {
            $(".chatroom-message").append(divMessageHint(systemMessage));
        }
    // 消息
    }else{
        // 发送给其他用户
        chatApp.sendMessage($(".chatroom-name > span").text(), message);

        console.log("roomname", $(".chatroom-name>span").text());
        $("#message").append(divMessageSelf(message));
        $("#message").scrollTop($("#message").prop("scrollHeight"));
    }
    $("#send-message").val("");
}

