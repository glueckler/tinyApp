require('dotenv').config()
const express   = require('express')
const app       = require('express')()
const fn        = require('./api/tinyFn')
const body      = require('body-parser')
const cookieP   = require('cookie-parser')
// const session   = require('express-session')
const morgan    = require('morgan')
const flash     = require('connect-flash')
const cookieSes = require('cookie-session')

const data      = require('./db/fakedata')
const tinyFn    = fn(data)

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(morgan('tiny'))
app.use(body.urlencoded({extended: true}))
app.use(cookieP('keyboard cat'))
// app.use(session({
//   secret: process.env.SESSION_SECRET
// }))
app.use(cookieSes({
  name: 'session',
  secret: process.env.COOKIE_SESSION_SECRET
}))
app.use(flash())

app.use(tinyFn.checkCookie)

app.get('/', (req, res) => {
  res.redirect('/urls')
})

app.get('/:url', (req, res, next) => {
  console.log(req.params.url)
  const url = tinyFn.longUrl(req.params.url)
  if (url) {
    res.redirect(url)
  } else {
    next()
  }
})

app.get('/urls', (req, res) => {
  const urlsList = tinyFn.UrlsList(res.locals.usr)
  res.locals.creationError = req.flash('creationError')
  res.locals.loginError = req.flash('loginError')
  res.status('200').render('urls', {urlsList})
})

app.post('/urls', (req, res) => {
  if (!res.locals.usr) {
    req.flash('creationError', 'You\'re not even logged in, sorry')
    res.redirect('/')
  }
  const create = tinyFn.createUrl(req.body.url, res.locals.usr.id)
  if (!create) {
    req.flash('creationError', 'That didn\'t work, invalide url')
  }
  res.redirect('/')
})

app.get('/:url/editurl', (req, res) => {
  const urlId = req.params.url
  const url = tinyFn.getUrlObj(urlId)
  url.shortUrl = process.env.SITE_URL + url.urlId
  res.render('edit-url', { url })
})

app.post('/:url/editurl', (req, res) => {
  tinyFn.editUrl(req.params.url, res.locals.usr, req.body.edit)
  res.redirect(`/${req.params.url}/editurl`)
})

app.post('/:url/delete', (req, res) => {
  tinyFn.deleteUrl(req.params.url, res.locals.usr)
  res.redirect('/')
})

app.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    req.flash('loginError', 'Username and Password must not be blank.')
  }
  const user = tinyFn.validateLogin(req.body)
  if (!user) {
    req.flash('loginError', 'Sorry, wrong username or password.')
  } else {
    tinyFn.setCookie(req, res, user.id)
  }
  res.redirect('/urls')
})

app.get('/register', (req, res) => {
  res.locals.registerError = req.flash('registerError')
  res.status(200).render('register')
})

app.post('/register', (req, res) => {
  const user = tinyFn.register(req.body)
  if (user.error) {
    req.flash('registerError', user.error)
    res.redirect('/register')
  } else {
    tinyFn.setCookie(req, res, user.id)
    res.redirect('/')
  }
})

app.post('/logout', (req, res) => {
  req.session = null
  res.redirect('/')
})

const PORT = process.env.PORT || 8080;

app.listen(PORT)