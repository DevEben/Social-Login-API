const express = require('express');
const router =express.Router()

const {
    homepage,
    createUser,
    logIn,
    logOut,
    
}= require("../controller/userController")

//endpoint for the homepage
router.get('/', homepage);

//endpoint to create a new user
router.post('/signUp', createUser)

//endpoint to create a new user
 router.post('/logIn', logIn)

//endpoint to logOut a user
router.post("/logout",logOut)








//endpoint to create a new user
router.get('/sociallogIn', async(req, res) => {
    res.redirect("http://localhost:4455/auth/google/")

})


const passport = require('passport')
    

router.get("/auth/google", passport.authenticate("google", {scope: ["email", "profile"]}) )


router.get("/auth/google/callback", passport.authenticate("google", {
    // if authentication is suuccessful
    successRedirect: "/auth/google/success",
    // if authentication fails
    failureRedirect: "/auth/google/failure"
}))
router.get("/auth/google/success", (req, res)=>{

    // Set user information in session
    //req.session.user = req.user;
    const username = req.user.email;
    req.session.user = {username};
    res.json("user authenticated")

})





//endpoint to create a new user with github
router.get('/githublogIn', async (req, res) => {
    res.redirect("http://localhost:4455/auth/github")

})

// GitHub login route
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
router.get('/auth/github/callback',
  passport.authenticate('github', { 
    successRedirect: "/auth/github/success",
    failureRedirect: "/auth/github/failure" 
}));
router.get("/auth/github/success", (req, res) => {

    // Set user information in session
    //req.session.user = req.user;
    const username = req.user.email;
    req.session.user = {username};
    res.json("user authenticated")
  
})





//endpoint to create a new user with facebook
router.get('/facebooklogIn', async (req, res) => {
    res.redirect("http://localhost:4455/auth/facebook")

})

// Facebook login route
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

// Facebook callback route
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect: "/auth/facebook/success",
    failureRedirect: "/auth/facebook/failure" 
}));
router.get("/auth/facebook/success", (req, res) => {

    // Set user information in session
    //req.session.user = req.user;
    const username = req.user.email;
    req.session.user = {username};
    return res.json("user authenticated")
    
})




module.exports = router