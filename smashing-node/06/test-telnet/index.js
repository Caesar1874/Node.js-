
const http = require('http')

const server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(`<h1>Hello world</h1>`)
})

server.listen(3000, function() {
    console.log('listening...')
})

// mac 中使用 telnet
// brew install telnet
// telnet
// 建立 tcp 连接: telnet localhost 3000
// 建立 http 连接: GET / HTTP/1.1
// 响应内容
// HTTP/1.1 200 OK
// Content-Type: text/html
// Date: Wed, 09 May 2018 06:39:05 GMT
// Connection: keep-alive
// Transfer-Encoding: chunked
//
// 14
// <h1>Hello world</h1>
// 0