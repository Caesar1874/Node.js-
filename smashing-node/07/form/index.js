const http = require('http')
const qs = require('querystring')

const log = console.log

const responseIndex = (request, response) => {
    const res = response
    res.writeHead(200, { 'Content-Type': 'text/html' })
    
    const html =
      `
      <form method="POST" action="/url">
          <h1>my form</h1>
          <fieldset>
              <label for="">personal information</label>
              <p>what is your name?</p>
              <input type="text" name="name" id="">
              <p><button>submit</button></p>
          </fieldset>
      </form>
      `
    res.end(html)
}

const responsePost = (request, response) => {
    const res = response
    const req = request
    let body = ''
    req.on('data', function (chunk) {
        body += chunk
    })
    
    req.on('end', function () {
        const name = qs.parse(body).name
        
        const html =
          `
        <p>Content-Type: ${req.headers['content-type']}</p>
        <p>Data: ${body}</p>
        <h2>hello, ${name}</h2>
        `
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(html)
    })
}

const responseNotFound = (request, response) => {
    const res = response
    const req = request
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(`<h1>404 NOT FOUND</h1>`)
}

const server = http.createServer(function (req, res) {
    // 路由
    const url = req.url
    if (url === '/') {
        responseIndex(req, res)
    } else if (url === '/url' && 'POST' === req.method) {
        responsePost(req, res)
    } else {
        responseNotFound(req, res)
        
    }
    
})

server.listen(3000, function () {
    console.log('listening...')
})