var fs = require("fs");
//读取数据
var data = fs.readFile("./resource.json", "utf8", function(err, data){
    console.log(data);
})