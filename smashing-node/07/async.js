var http = require("http");
http.createServer(function(req, res) {
    res.writeHead(200);
    res.write("Hello");
    setTimeout(function() {
        res.end(" World");
    }, 1000);
}).listen(3000, function() {
    console.log("listening...");
});