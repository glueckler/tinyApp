require('dotenv').config()
const express   = require('express')
const app       = require('express')()
const fn        = require('./tinyFn')
const body      = require('body-parser')
const cookieP   = require('cookie-parser')

const data  = require('./fakedata')
const tinyFn    = fn(data)

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(body.urlencoded({extended: true}))
app.use(cookieP())

app.use(tinyFn.checkCookie)

app.get('/', (req, res) => {
  res.redirect('/urls')
})

app.get('/urls', (req, res) => {
  const shortUrlsList = tinyFn.shortUrlsList(res.locals.usr)
  res.render('urls', {shortUrlsList, urls: tinyFn.urls})
})

app.post('/urls', (req, res) => {
  console.log(res.locals.usr)
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

app.get('/login', (req, res) => {
  res.status(200).render('login')
})

app.post('/login', (req, res) => {
  const user = tinyFn.validate(req.body)
  if (user) {
    tinyFn.setCookie(res, user.id)
    res.redirect('/')
  } else {
    res.status(404)
  }
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





app.get('/set', (req, res) => {
  res.cookie('usrId', 1234)
  res.status(200).send('setcookie')
})

app.get('/clear', (req, res) => {
  res.clearCookie('usrId')
  res.send('cleared')
})

app.listen(9999)