require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy

const app = express()

const isAuth = (req, res, next) => {
  if (req.user) 
    next()
  else 
    res.redirect('/login')
}

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, 
  }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.deserializeUser((id, cb) => {
  // console.log(id)
  cb(null, id)
})

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile)
    cb(null, profile)
  }
))

app.get('/', isAuth, (req, res) => {
  res.sendFile(__dirname + '/dashboard.html')
})

app.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/')
  }
  res.sendFile(__dirname + '/login.html')
})

app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.get('/auth/github',
  passport.authenticate('github'))

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/')
  })

app.listen(3000, () => console.log('http://localhost:3000'))