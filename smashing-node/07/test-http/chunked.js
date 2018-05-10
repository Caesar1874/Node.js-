const http = require('http')
const fs = require('fs')
const log = console.log

const server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'image/png'})
    const stream = fs.createReadStream('image.png')
    stream.on('data', function(data) {
        res.write(data)
    })
    stream.on('end', function() {
        res.end()
    })
})

server.listen(3000, function() {
    log('listening')
})

