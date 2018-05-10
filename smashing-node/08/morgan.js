var connect = require("connect");
var morgan = require("morgan");

var app = connect();
app.use(morgan("combined"));

app.use(function(req, res) {
    res.writeHead(200);
    res.end("hello world");
})
app.listen(3000);