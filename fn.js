const rndStr    = require('randomstring')
const siteURL   = process.env.SITE_URL;

require('dotenv').config()


function fn(data) {
  const tinyFn = {}
  const users = data.users
  const urls = data.urls

  tinyFn.shortUrl = function(key) {
    return siteURL + key
  }

  tinyFn.shortUrlsList = function() {
    const list = []
    for (url in data.urls) {
      url = data.urls[url]
      list.push(tinyFn.shortUrl(url.urlId))
    }
    return list
  }

  tinyFn.getUrlObj = function(id) {
    return urls[id]
  }

  tinyFn.createUrl = function(longURL) {
    const id = rndStr.generate(5)
    urls[id] = {
      longURL,
      urlId: id
    }
    return urls[id]
  }

  tinyFn.editUrl = function(id, edit) {
    urls[id].longURL = edit
  }

  tinyFn.deleteUrl = function(id) {
    delete urls[id]
  }

  tinyFn.findUserIdByEmail = function(email) {
    const userKeys = Object.keys(data.users)
    for (usr of userKeys) {
      if (email === data.users[usr].email) {
        return usr
      }
    }
    return undefined
  }

  tinyFn.validate = function({ email, password }) {
    const usrId = tinyFn.findUserIdByEmail(email)
    if (!usrId) { return }
    if (password === users[usrId].password) {
      return users[usrId]
    }
  }

  tinyFn.register = function({ email, password, name }) {
    console.log(users)
    if (tinyFn.findUserIdByEmail(email)) {
      return
    }
    const id = rndStr.generate(5)
    users[id] = {
      id,
      name,
      email,
      password
    }
    return tinyFn.validate({ email, password })
  }

  tinyFn.setCookie = function(res, id) {
    res.cookie('usrId', id)
  }

  tinyFn.checkCookie = function(req, res, next) {
    usrCookie = req.cookies.usrId
    res.locals.usr = users[usrCookie] ? users[usrCookie] : undefined
    next()
  }

  return tinyFn
}

module.exports = fn





















