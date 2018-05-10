
var connect = require("connect");
var static = require("serve-static");
var http = require("http");

var app = connect();

app.use(static(__dirname + "/website"));
app.listen(3000);