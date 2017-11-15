const rndStr    = require('randomstring')
// const siteURL   = process.env.SITE_URL
const siteURL   = 'tnyurl.io/'
const bcrypt    = require('bcrypt')

require('dotenv').config()

function tinyFn(data) {
  const tinyFn = {}
  const users = data.users
  const urls = data.urls

  tinyFn.shortUrl = function(key) {
    return siteURL + key
  }

  tinyFn.longUrl = function(urlId) {
    if (data.urls[urlId]) {
      return 'https://' + data.urls[urlId].longUrl
    }
  }

  tinyFn.UrlsList = function(usr) {
    const fullList = []
    // usrList should be falsy if usr doesn't exist
    let usrList

    for (let url in data.urls) {
      url = data.urls[url]
      const shortUrl = tinyFn.shortUrl(url.urlId)
      const longUrl = url.longUrl
      if (usr && url.userLink === usr.id) {
        usrList = usrList || []
        usrList.push({
          shortUrl,
          longUrl,
          id: url.urlId
        })
        continue
      }
      fullList.push({
        shortUrl,
        longUrl,
        id: url.urlId
      })
    }

    return {
      usrList,
      fullList
    }
  }

  tinyFn.getUrlObj = function(urlId) {
    console.log(urlId)
    return urls[urlId]
  }

  tinyFn.createUrl = function(longUrl, userLink) {
    const id = rndStr.generate(5)
    longUrl = longUrl.trim()
    if (longUrl.indexOf(' ') !== -1) {
      return
    }
    const https = longUrl.indexOf('https://')
    const http = longUrl.indexOf('http://')
    if (https !== -1) {
      longUrl = longUrl.substr(8)
    } else if (http !== -1) {
      longUrl = longUrl.substr(7)
    }
    urls[id] = {
      userLink,
      longUrl,
      urlId: id,
    }
    return urls[id]
  }

  tinyFn.editUrl = function(urlId, usr, edit) {
    if ( usr && usr.id === data.urls[urlId].userLink ) {
      urls[urlId].longUrl = edit
    }
  }

  tinyFn.deleteUrl = function(urlId, usr) {
    if ( usr && usr.id === data.urls[urlId].userLink ) {
      delete urls[urlId]
    }
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

  tinyFn.validateLogin = function({ email, password }) {
    console.log(email, password)
    const usrId = tinyFn.findUserIdByEmail(email)
    if (!usrId) { return }
    if (bcrypt.compareSync(password, users[usrId].password)) {
      return users[usrId]
    }
  }

  tinyFn.register = function({ email, password, name }) {
    email = email.trim()
    password = password.trim()
    name = name.trim()
    if (tinyFn.findUserIdByEmail(email)) {
      return {error: 'Email already exists'}
    } else if (!email, !password, !name) {
      return {error: 'Yes I know it\'s hard, you can do it..'}
    } else if (email.indexOf(' ') !== -1) {
      return {error: 'Somethings weird about your email..'}
    }
    const id = rndStr.generate(5)
    users[id] = {
      id,
      name,
      email,
      password: bcrypt.hashSync(password, 7)
    }
    return tinyFn.validateLogin({ email, password })
  }

  tinyFn.setCookie = function(req, res, usrId) {
    req.session.usrId = usrId
  }

  tinyFn.checkCookie = function(req, res, next) {
    if (req.session) {
      let usrCookie = req.session.usrId
      res.locals.usr = users[usrCookie] ? users[usrCookie] : undefined
    }
    next()
  }

  return tinyFn
}

module.exports = tinyFn





















