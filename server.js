const express = require('express')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy

const app = express()

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html')
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html')
})

app.listen(3000, () => console.log('http://localhost:3000'))