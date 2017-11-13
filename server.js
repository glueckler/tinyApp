require('dotenv').config()
const express   = require('express')
const app       = require('express')()
const fn        = require('./api/tinyFn')
const body      = require('body-parser')
const cookieP   = require('cookie-parser')
const session   = require('express-session')
const morgan    = require('morgan')
const flash     = require('connect-flash')

const data  = require('./db/fakedata')
const tinyFn    = fn(data)

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(morgan('tiny'))
app.use(body.urlencoded({extended: true}))
app.use(cookieP('keyboard cat'))
app.use(session({
  secret: 'I am tinyapp',
}))
app.use(flash())


app.use(tinyFn.checkCookie)

app.get('/', (req, res) => {
  res.redirect('/urls')
})

app.get('/urls', (req, res) => {
  const shortUrlsList = tinyFn.shortUrlsList(res.locals.usr)
  res.locals.loginError = req.flash('loginError')
  res.render('urls', {shortUrlsList, urls: tinyFn.urls})
})

app.post('/urls', (req, res) => {
  tinyFn.createUrl(req.body.url, res.locals.usr.id)
  res.redirect('/')
})

app.get('/:url/editurl', (req, res) => {
  const urlId = req.params.url
  const url = tinyFn.getUrlObj(urlId)
  res.render('edit-url', { url })
})

app.post('/:url/editurl', (req, res) => {
  tinyFn.editUrl(req.params.url, req.body.edit)
  res.redirect(`/${req.params.url}/editurl`)
})

app.post('/:url/delete', (req, res) => {
  tinyFn.deleteUrl(req.params.url)
  res.redirect('/')
})

app.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    req.flash('loginError', 'Email and Password must not be blank.')
  }
  const user = tinyFn.validate(req.body)
  if (!user) {
    req.flash('loginError', 'Sorry, wrong username or password.')
  } else {
    tinyFn.setCookie(res, user.id)
  }
  res.redirect('/urls')
})

app.get('/register', (req, res) => {
  res.status(200).render('register')
})

app.post('/register', (req, res) => {
  const { email, password, name } = req.body
  const user = tinyFn.register(req.body)
  if (!user) {
    res.status(404).send('registration fucked up')
  } else {
    tinyFn.setCookie(res, user.id)
    res.redirect('/')
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('usrId').redirect('/')
})


const PORT = process.env.PORT || 8080;

app.listen(PORT)