const https = require('https')

const qs = require('querystring')
const stdout = process.stdout
const stdin = process.stdin

const log = console.log

// client

// url = api.douban.com/v2/movie/search?q=张艺谋

const getV1 = function () {
    
    // 获得命令行输入的参数
    const search = process.argv.slice(2).join(' ').trim()
    if (search.length === 0) {
        log('Usage: node filename <search term>')
    }
    
    const options = {
        host: 'api.douban.com',
        port: '443',
        path: `/v2/movie/search?${qs.stringify({ q: search })}`,
        method: 'GET'
    }
    
    const request = https.request(options, function (res) {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', function (chunk) {
            body += chunk
        })
        res.on('end', function () {
            const obj = JSON.parse(body)
            console.log(obj.subjects)
        })
    })
    
    request.end()
}

const getV2 = function () {
    
    // 获得命令行输入的参数
    const search = process.argv.slice(2).join(' ').trim()
    if (search.length === 0) {
        log('Usage: node filename <search term>')
    }
    
    // 使用http.get
    // 去掉method参数，end方法
    const options = {
        host: 'api.douban.com',
        port: '443',
        path: `/v2/movie/search?${qs.stringify({ q: search })}`
    }
    https.get(options, function (res) {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', function (chunk) {
            body += chunk
        })
        res.on('end', function () {
            const obj = JSON.parse(body)
            console.log(obj.subjects)
        })
    })
}

if (require.main === module) {
    getV2()
}



