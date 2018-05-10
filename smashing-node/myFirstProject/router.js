// 路由：根据pathname, 调用对应的请求处理函数
// 路由将response, postData传递给handler, 进行响应
function route(handle, pathname, response, postData){
    //handle： 对象，键为请求的pathname, 值为对应的处理函数

    console.log(`路由来自${pathname}的请求`);

    if(typeof handle[pathname] === "function"){
        handle[pathname](response, postData);
    }else{
        console.log(`没有找到${pathname}的请求处理函数。`);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
}
exports.route = route;