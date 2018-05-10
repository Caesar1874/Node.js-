/*!
 * connect
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var debug = require('debug')('connect:dispatcher');
var EventEmitter = require('events').EventEmitter;
var finalhandler = require('finalhandler');
var http = require('http');
var merge = require('utils-merge');
var parseUrl = require('parseurl');

/**
 * Module exports.
 * @public
 */


// connect模块最终暴露的是creatServer函数， 也就是实际应用的connect()函数；
module.exports = createServer;

/**
 * Module variables.
 * @private
 */

var env = process.env.NODE_ENV || 'development';
var proto = {};

/* istanbul ignore next */
var defer = typeof setImmediate === 'function'
    ? setImmediate
    : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

/**
 * Create a new connect server.
 *
 * @return {function}
 * @public
 */
// createServer()返回app函数，也就是应用时的app;
function createServer() {
    // app的函数体调用handle(req, res, next);
    // 所以app可以作为http.createServer()的参数，处理请求；
    function app(req, res, next){
        app.handle(req, res, next);
    }

    // 通过merge()为app添加proto和EventEmitter的特性；
    // proto上定义了.use(), .handle(), .listen()方法；
    merge(app, proto);
    merge(app, EventEmitter.prototype);

    app.route = '/';
    app.stack = [];

    return app;
}

/**
 * Utilize the given middleware `handle` to the given `route`,
 * defaulting to _/_. This "route" is the mount-point for the
 * middleware, when given a value other than _/_ the middleware
 * is only effective when that segment is present in the request's
 * pathname.
 *
 * For example if we were to mount a function at _/admin_, it would
 * be invoked on _/admin_, and _/admin/settings_, however it would
 * not be invoked for _/_, or _/posts_.
 *
 * @param {String|Function|Server} route, callback or server
 * @param {Function|Server} callback or server
 * @return {Server} for chaining
 * @public
 */

// use函数将{route: path, handle: handle}压入中间件堆栈app.stack,
// 返回app, 进行链式操作
proto.use = function use(route, fn) {

    // route为请求url的路径, fn为中间件处理函数；
    var handle = fn;
    var path = route;

    // default route to '/'
    // 如果只传入一个中间件函数参数，path默认为/, route此时为中间件函数
    if (typeof route !== 'string') {
        handle = route;
        path = '/';
    }

    // wrap sub-apps
    // 传入的中间件是 app, handler就是app.handle【？】
    if (typeof handle.handle === 'function') {
        var app = handle;
        app.route = path;
        handle = function (req, res, next) {
            app.handle(req, res, next);
        };
    }

    // wrap vanilla http.Servers
    // 传入的中间件是http.server, handle是server的request事件的listener
    if (handle instanceof http.Server) {
        handle = handle.listeners('request')[0];
    }

    //  去掉末尾的 /
    if (path[path.length - 1] === '/') {
        path = path.slice(0, -1);
    }

    // add the middleware
    debug('use %s %s', path || '/', handle.name || 'anonymous');

    // 添加中间件
    this.stack.push({ route: path, handle: handle });

    return this;
};

/**
 * Handle server requests, punting them down
 * the middleware stack.
 *
 * @private
 */

proto.handle = function handle(req, res, out) {
    var index = 0;
    var protohost = getProtohost(req.url) || '';
    var removed = '';
    var slashAdded = false;
    var stack = this.stack;

    // final function handler
    var done = out || finalhandler(req, res, {
            env: env,
            onerror: logerror
        });

    // store the original URL
    req.originalUrl = req.originalUrl || req.url;

    function next(err) {
        if (slashAdded) {
            req.url = req.url.substr(1);
            slashAdded = false;
        }

        if (removed.length !== 0) {
            req.url = protohost + removed + req.url.substr(protohost.length);
            removed = '';
        }

        // next callback
        var layer = stack[index++];

        // all done
        if (!layer) {
            defer(done, err);
            return;
        }

        // route data
        var path = parseUrl(req).pathname || '/';
        var route = layer.route;

        // skip this layer if the route doesn't match
        if (path.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
            return next(err);
        }

        // skip if route match does not border "/", ".", or end
        var c = path[route.length];
        if (c !== undefined && '/' !== c && '.' !== c) {
            return next(err);
        }

        // trim off the part of the url that matches the route
        if (route.length !== 0 && route !== '/') {
            removed = route;
            req.url = protohost + req.url.substr(protohost.length + removed.length);

            // ensure leading slash
            if (!protohost && req.url[0] !== '/') {
                req.url = '/' + req.url;
                slashAdded = true;
            }
        }

        // call the layer handle
        call(layer.handle, route, err, req, res, next);
    }

    next();
};

/**
 * Listen for connections.
 *
 * This method takes the same arguments
 * as node's `http.Server#listen()`.
 *
 * HTTP and HTTPS:
 *
 * If you run your application both as HTTP
 * and HTTPS you may wrap them individually,
 * since your Connect "server" is really just
 * a JavaScript `Function`.
 *
 *      var connect = require('connect')
 *        , http = require('http')
 *        , https = require('https');
 *
 *      var app = connect();
 *
 *      http.createServer(app).listen(80);
 *      https.createServer(options, app).listen(443);
 *
 * @return {http.Server}
 * @api public
 */


// app.listen()创建http.createServer实例，并传入app作为回调
// 并调用server的listen方法
proto.listen = function listen() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
};

/**
 * Invoke a route handle.
 * @private
 */

function call(handle, route, err, req, res, next) {
    var arity = handle.length;
    var error = err;
    var hasError = Boolean(err);

    debug('%s %s : %s', handle.name || '<anonymous>', route, req.originalUrl);

    try {
        if (hasError && arity === 4) {
            // error-handling middleware
            handle(err, req, res, next);
            return;
        } else if (!hasError && arity < 4) {
            // request-handling middleware
            handle(req, res, next);
            return;
        }
    } catch (e) {
        // replace the error
        error = e;
    }

    // continue
    next(error);
}

/**
 * Log error using console.error.
 *
 * @param {Error} err
 * @private
 */

function logerror(err) {
    if (env !== 'test') console.error(err.stack || err.toString());
}

/**
 * Get get protocol + host for a URL.
 *
 * @param {string} url
 * @private
 */

function getProtohost(url) {
    if (url.length === 0 || url[0] === '/') {
        return undefined;
    }

    var searchIndex = url.indexOf('?');
    var pathLength = searchIndex !== -1
        ? searchIndex
        : url.length;
    var fqdnIndex = url.substr(0, pathLength).indexOf('://');

    return fqdnIndex !== -1
        ? url.substr(0, url.indexOf('/', 3 + fqdnIndex))
        : undefined;
}