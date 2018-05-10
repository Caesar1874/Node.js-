const http = require("http");
const qs = require("querystring");

const log = console.log

//server
http.createServer(function(req, res) {
    let body = ''

    req.on("data", function(chunk) {
        body += chunk
    })
    req.on("end", function() {
        res.writeHead(200)
        res.end("Done")
        log(`got name: ${qs.parse(body).name}`)
    })
}).listen(3000, function() {
    log("listening...")
})





