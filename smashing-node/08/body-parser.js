var connect = require("connect");
var bodyParser = require("body-parser");

var app = connect();
app.use(bodyParser.json());
app.use(function(req, res) {
    console.log(req.body);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(req.body));
});
app.listen(3000);
