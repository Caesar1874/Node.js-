
var http = require("http");
var url = require("url");
var qs = require("querystring");

var htmlString = `
         <form action="/url" method="POST">
            <h1>my form</h1>
            <fieldset>
                <label for="">Personal information</label>
                <p>what is your name</p>
                <input type="text" name="name" id="">
                
            </fieldset>
                    <button type="submit">submit</button> 
        </form>
    `;

http.createServer(function(req, res) {


    var pathname = url.parse(req.url).pathname;

    if(pathname === "/") {
        res.writeHead(200, {"Content-type": "text/html"});

        res.end(htmlString);
    } else if(pathname=== "/url" && req.method === "POST") {
        var body = "";
        req.on("data", function(chunk) {
            body += chunk;
        });
        req.on("end", function() {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(`content-type: ${req.headers["content-type"]}; <br>
                    data: ${body};<br>
                    your name: ${qs.parse(body).name}
            `);
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
}).listen(3000, "localhost", function() {
    console.log("listening...")
});