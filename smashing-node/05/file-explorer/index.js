
var fs = require("fs");
var stdin = process.stdin;
var stdout = process.stdout;


console.log(fs.readdirSync(__dirname));

fs.readdir(".", function(err, files) {
    console.log(files);
});

// 当前目录
var cwd = process.cwd();
fs.readdir(cwd, function(err, files) {
    // 目录中不包含文件
    if(files.length === 0) {
        return console.log(" No files to show! \n");
    }

    // 输出：
    console.log("Select which file or directory you want see： \n");

    // 输出目录中的所有文件名
    
    file(0, files);

});
var stats = [];
// 输出目录中的所有文件名
function file(index, files) {
    // 文件名
    var filename = files[index];
    // 输出目录和文件

    fs.stat(`${__dirname}/${filename}`, function(err, stat) {
        statHandler(stat);
    });

    function statHandler(stat) {
        stats[index] = stat;
        if(stat.isDirectory()) {
            console.log(`目录${index}：${filename}`);
        } else {
            console.log(`文件${index}：${filename}`)
        }

        // 如果当前文件时最后一个，则读取用户输入，否则递归调用file
        index ++;
        if(index === files.length) {
            read();
        } else {
            file(index, files);
        }

        // 读取用户输入
        function read() {
            stdout.write("Enter your choice: ");
            stdin.resume();
            stdin.setEncoding("utf-8");
            stdin.on("data", function(data) {
                option(data);
            });
        }

        // 处理用户输入
        function option(data) {
            var currFile = files[Number(data)];
            if(currFile === undefined) {
                stdout.write("Enter your choice: ")
            } else {
                stdin.pause();

                // 读取文件或目录
                var currStat = stats[Number(data)];
                if(currStat.isDirectory()) {
                    fs.readdir(`${__dirname}/`, function(err, files) {
                        console.log(`(${files.length} files)`);
                        files.forEach(function(file) {
                            console.log(`-${file}`);
                        })
                    })
                } else {
                    fs.readFile(`${__dirname}/${filename}`, "utf-8", function(err, data) {
                        console.log(data);
                    });
                }

            }
        }
    }








}




