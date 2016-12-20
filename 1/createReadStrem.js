var fs = require("fs");

// 获取可读流
var stream = fs.createReadStream("./resource.json", {start: 50, end: 60, enconding: "utf8"});


stream.on("data", function(chunk){
    console.log("1", chunk);
});
stream.on("end", function() {
    console.log("finished");
})