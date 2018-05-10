
window.onload = function() {
    var socket = io();
    
    // 连接
    socket.on("connect", function() {
        // 输入昵称 并显示
        var nickname = prompt("what is your nickname?");
        console.log(nickname);
        document.getElementById("player").innerHTML = nickname;
        document.getElementById("chat").style.display = "block";

        // 发射join事件，nickname将传入join事件的listener
        socket.emit("join", nickname);

        console.log("connect");
    });

    // 通告
    socket.on("announcement", function(message) {
        // 通告内容
        var li = document.createElement("li");
        li.className = "announcement";
        li.innerHTML = message;
        document.getElementById("messages").appendChild(li);

        console.log("announcement")
    })

    // 发送消息
    var input = document.getElementById("input");
    var form = document.getElementById("form");
    form.onsubmit = function() {
        // 在本地显示消息
        var li = addMessage("我", input.value);

        // 发射消息事件
        socket.emit("text", input.value, function(date) {
            li.classList.add("confirmed");
            li.title = date;
        });

        // 重置输入框
        input.value = "";
        input.focus();

        return false;
    }
    
    // 其他人发送消息
    socket.on("text", addMessage);
    
    function addMessage(from, text) {
        var li = document.createElement("li");
        li.className = "message";
        li.innerHTML = `<b>${from}</b>: ${text}`;
        document.getElementById("messages").appendChild(li);
        return li;
    }
}