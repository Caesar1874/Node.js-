
// 该模块暴露一个函数，该函数将返回中间件函数
// 函数接受option对象作为参数
function requestTime(option) {
    // 超时阈值的默认值
    var time = option.time || 100;
    return function(req, res, next) {
        // 计时器，超时时触发
        var timer = setTimeout(function() {
            console.log("mis taking too long！", req.method, req.url);
        }, time);

        // 重写方法： monkey-patch
        // 保存到方法的引用
        var end = res.end;
        // 重写
        res.end = function(chunk, encoding) {
            res.end = end;
            res.end(chunk, encoding);
            clearTimeout(timer);
        }

        next();
    }
    }


module.exports = requestTime;

