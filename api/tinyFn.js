const rndStr    = require('randomstring')
const siteURL   = process.env.SITE_URL

require('dotenv').config()

function tinyFn(data) {
  const tinyFn = {}
  const users = data.users
  const urls = data.urls

  tinyFn.shortUrl = function(key) {
    return siteURL + key
  }

  tinyFn.longUrl = function(urlId) {
    return 'https://' + data.urls[urlId].longUrl
  }

  tinyFn.UrlsList = function(usr) {
    const fullList = []
    // usrList should be falsy if usr doesn't exist
    let usrList

    for (let url in data.urls) {
      url = data.urls[url]
      if (usr && url.userLink === usr.id) {
        usrList = usrList || []
        usrList.push({
          shortUrl: tinyFn.shortUrl(url.urlId),
          longUrl: url.longUrl,
          id: url.urlId
        })
        continue
      }
      fullList.push({
        shortUrl: tinyFn.shortUrl(url.urlId),
        longUrl: url.longUrl,
        id: url.urlId
      })
    }

    return {
      usrList,
      fullList
    }
  }

  tinyFn.getUrlObj = function(id) {
    return urls[id]
  }

  tinyFn.createUrl = function(longUrl, userLink) {
    const id = rndStr.generate(5)
    longUrl = longUrl.trim()
    const https = longUrl.indexOf('https://')
    const http = longUrl.indexOf('http://')
    if (https !== -1) {
      longUrl = longUrl.substr(8)
      console.log('https')
    } else if (http !== -1) {
      console.log('http')
      longUrl = longUrl.substr(7)
    }
    console.log(longUrl)
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
      return {error: 'Email already exists'}
    } else if (!email, !password, !name) {
      return {error: 'Yes I know it\'s hard, you can do it..'}
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
    let usrCookie = req.cookies.usrId
    res.locals.usr = users[usrCookie] ? users[usrCookie] : undefined
    next()
  }

  return tinyFn
}

module.exports = tinyFn





















