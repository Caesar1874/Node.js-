const http = require("http")
const qs = require("querystring")
const stdout = process.stdout
const stdin = process.stdin

// client
stdout.write("\n your name: ")
stdin.resume()
stdin.setEncoding("utf8")
stdin.on("data", function(name) {
    send(name.replace("/n", ""))
})

function send(theName) {
    const options = {
        host: "127.0.0.1",
        port: "3000",
        path: "/", 
        method: "POST",
    }
    const request = http.request(options, function(res) {
        res.setEncoding("utf8")
        res.on("data", function(chunk) {
            console.log(chunk)
        })
        res.on("end", function() {
            console.log("request completa!")
            stdout.write("\n your name: ")
        });
    });
    request.end(qs.stringify( {name: theName} ))
}