
//服务器
var server = require("./server");
// 路由
var router = require("./router");
// 请求处理函数
var requestHandlers = require("./requestHandler");
// 绑定pathname和请求处理函数
var handle= {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

// 启动服务器
server.start(router.route, handle);