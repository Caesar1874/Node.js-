var http = require("http");
var fs = require("fs");

http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "image/png"});

/*    var stream = fs.createReadStream("img.png");
    stream.on("data", function(chunked) {
        res.write(chunked);
    });
    stream.on("end", function() {
        res.end();
    })*/

    fs.createReadStream("img.png").pipe(res);

}).listen(3000, function() {
    console.log("listening...");
});