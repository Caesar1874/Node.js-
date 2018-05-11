
const express = require('express')
const websocketio = require('websocket.io')

const log = console.log

const app = express()

// webscoket server
const server = websocketio.attach(app)

app.use(express.static('public'))

server.on('connection', function(socket) {
    // 这里的 socket 是 websocketio 的封装
    socket.on('message', (msg) => {
        log('message', msg)
        socket.send('pong')
    })
})

server.listen(3000)