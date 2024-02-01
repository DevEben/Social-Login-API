const express = require('express');
require("./dbConfig/dbConfig")

require("dotenv").config()
const userRouter = require("./router/router");
const session = require('express-session');
const passport = require("passport");
const userModel = require('./models/userModel');
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express()

app.use(express.json())

app.use(session({
    secret: process.env.sessionSecret, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }))

// intialize passport
  app.use(passport.initialize())
// integrate passport with session auth
  app.use(passport.session())


  // Set up Google strategy
  passport.use(new GoogleStrategy({
    clientID:    process.env.clientID,
    clientSecret: process.env.clientsecret,
    callbackURL: process.env.callbackURL,
   // passReqToCallback   : true
  },

    // Save user information to session or database
  async (request, accessToken, refreshToken, profile, done)=> {
    try {
        let user = await userModel.findOne({email: profile.email})
        if (!user) {
            user = await userModel.create({
                firstName: profile.given_name,
                lastName: profile.family_name,
                email: profile.email,
                profilePicture: profile.picture,
                isVerified: profile.email_verified,
            })
            return done(null, user)
        }
        else {
            return done(null, profile)
        }
    } catch (error) {
        return done(error, false)
    }    
  }
))



// Set up GitHub strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUBcallbackURL,
}, 

async (accessToken, refreshToken, profile, done) => {
  // Save user information to session or database
  try {
    let user = await userModel.findOne({email: profile.emails[0].value})
    if (!user) {
        user = await userModel.create({
            firstName: profile.displayName.split(' ')[1],
            lastName: profile.displayName.split(' ')[0],
            email: profile.emails[0].value,
            profilePicture: profile._json.avatar_url,
            isVerified: true,
        })
        return done(null, user)
    }
    else {
        return done(null, profile)
    }
} catch (error) {
    return done(error, false)
}    
}));



// Set up Facebook strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOKcallbackURL,
  profileFields: ['id', 'displayName', 'photos', 'email'],
}, 

async (accessToken, refreshToken, profile, done) => {
  // Save user information to session or database
  try {
    let user = await userModel.findOne({email: profile.emails[0].value})
    if (!user) {
        user = await userModel.create({
            firstName: profile.displayName.split(' ')[0],
            lastName: profile.displayName.split(' ')[1],
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
            isVerified: true,
        })
        return done(null, user)
    }
    else {
        return done(null, profile)
    }
} catch (error) {
    return done(error, false)
}    
}));



// Serialize user information into the session
passport.serializeUser((user, done)=>{
  return done(null, user)
})

// Deserialize user from the session
passport.deserializeUser((user, done)=>{
  return done(null, user)
})


app.use("/", userRouter)


const port = process.env.port
app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`)
})