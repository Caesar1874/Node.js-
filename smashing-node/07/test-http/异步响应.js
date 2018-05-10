const http = require('http')
const log = console.log

const server = http.createServer(function(req, res) {
    res.writeHead(200)
    res.write('Hello')
    setTimeout(function() {
        res.end('World')
    }, 500)
})

server.listen(3000, function() {
    log('listening')
})
//
// HTTP/1.1 200 OK
// Date: Wed, 09 May 2018 08:08:14 GMT
// Connection: keep-alive
// Transfer-Encoding: chunked
//
// b
// Hello world
// 0
