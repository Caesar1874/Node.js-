var connect = require("connect");
var morgan = require("morgan");
var time = require("./requestTime");

var server = connect();

server.use(morgan("dev"));

server.use(time( {time: 500} ));

// 快速响应
server.use(function(req, res, next) {
    if(req.url === "/a") {
        res.writeHead(200);
        res.end("FasT!");
    } else {
        next();
    }
})

// 慢速响应
server.use(function(req, res, next) {
    if(req.url === "/b") {
        setTimeout(function() {
            res.writeHead(200);
            res.end("Slow!");
        }, 1000);
    } else {
        next();
    }
})

server.listen(3000, function() {
    console.log("listening...");
})