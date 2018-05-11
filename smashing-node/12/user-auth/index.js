const express = require('express')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')

const app = express()

// 中间件
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({secret: 'my secret'}))

// 模板引擎
app.set('view engine', 'pug')

// 路由
app.get('/', function(req, res) {
    res.render('index', {authenticated: false})
})

app.get('/login', function(req, res) {
    res.render('login')
})

app.get('/signup', function(req, res) {
    res.render('signup')
})

app.listen(3000, () => {
    console.log('listening...')
})

