const net = require('net')
const log = console.log

// count 称为状态
// 如果不同的连接都需要修改同一个状态, 称为共享状态的并发
let count = 0
const users = {}

const validateUser = (socket, data, user) => {
    // 删去\r\n
    const d = data.replace('\r\n', '')
    
    if (!user.nickname) {
        // 第一次发送的数据认为是用户名
        if (users[d]) {
            // 用户名已占用
            socket.write('nickname alreaduy in use. \n')
        } else {
            // 用户可用
            // 存储
            user.nickname = d
            users[d] = socket
            
            // 通知所有用户
            const name = user.nickname
            const msg = `${d} joined the room. \n`
            broadcast(name, msg, true)
        }
    } else {
        // 之后的连接是聊天消息
        // 将消息发送给除当前用户外的用户
        const name = user.nickname
        const msg = `${name}: ${d}\n`
        broadcast(name, msg, false)
    }
    
}

// 抽象出广播的逻辑
function broadcast (nickname, message, includeSelf) {
    for (let u in users) {
        if (includeSelf || u !== nickname) {
            users[u].write(message)
        }
    }
}

const server = net.createServer(function (socket) {
    socket.write(
      `welcom to node-chat \n
        current people: ${count} \n
        write your name: 
        `
    )
    count++
    
    // 当前用户
    const user = { nickname: '' }
    
    socket.setEncoding('utf8')
    socket.on('data', function (data) {
        log('data', data)
        validateUser(socket, data, user)
    })
    
    socket.on('close', function () {
        count--
        broadcast(`${user.nickname} left the room. \n`)
        delete users[user.nickname]
        
    })
})
server.listen(3000, function () {
    console.log('server listening on')
})