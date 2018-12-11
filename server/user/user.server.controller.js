/*
 * @author: Manuel Araujo <alejandromanuel5187@gmail.com>
 * Created on 2017-10-13 11:42:57 
 */
const User      = require('./user.server.model');
const jwt       = require('jsonwebtoken');
const config    = require('../config/config');
const common    = require('../config/common');
const privateKey = config.privateKey

/**
 * Get a specific user's information.
 * 
 * @param userId - User id
 * @returns specified user's information.
 */
function getUserById(req, res) {
    if (!req.params.userId) return res.status(400).json({success: false, message: 'User ID not provide'}); // Return Error
    User.findById(req.params.userId, (err, user) => {
        if (err) return res.status(500).json({ success: false, message: `Request failed: ${err}`}); // Return Coneccition Error
        if (!user) return res.status(404).json({ success: false, message: 'User not found'}) // Return as not found user
        return res.status(200).json({ success:true, user: user}); // Return user
    });
}
/**
 * Get a specific user's information.
 * 
 * @param username 
 * @returns specified user's information.
 */
function getUserByUsername(req, res) {
    if(!req.body.username) return res.status(400).json({success: false, message: 'Username not provide' }); // Return Error
    User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
        if (err) return res.status(500).json({ success: false, message: `Request failed: ${err}` }); // Return Coneccition Error
        if (!user) return res.status(404).json({ success: false, message: 'User not found' }) // Return as not found user
        return res.status(200).json({ success :true, user: user}); // Return user
    });
}

/**
 * Save user to database
 * 
 * @param user - user object
 * @returns JSON object with success boolean and message
 */

function saveUser(req, res) {
    
    if (!req.body.email)    return res.status(400).json({ success: false, message: 'You must provide an e-mail' });
    if (!req.body.username) return res.status(400).json({ success: false, message: 'You must provide a username' });
    if (!req.body.password) return res.status(400).json({ success: false, message: 'You must provide a password' });
    let user = new User({
        email: req.body.email.toLowerCase(),
        username: req.body.username.toLowerCase(),
        password: req.body.password
    })
    
    user.save( (err) => {
        if (err) {
            // Check if error is an error indicating duplicate account
            if (err.code === 11000) return res.status(409).json({ success: false, message: 'Username or e-mail already exists' }); // Return error
            if(err.errors) {
                if (err.errors.email) return res.status(400).json({ success: false, message: err.errors.email.message }); // Return error
                  
                // Check if validation error is in the username field
                if (err.errors.username) return res.status(400).json({ success: false, message: err.errors.username.message }); // Return error

                // Check if validation error is in the password field
                if (err.errors.password) return res.status(400).json({ success: false, message: err.errors.password.message }); // Return error
                
                return res.status(500).json({ success: false, message: `Could not save user. Error: ${err}` }); // Return any other error not already covered
                      
            } 
            return res.status(500).json({ success: false, message: `Could not save user. Error: ${err}` }); // Return any other error not already covered
        }
        return res.status(201).json({ success: true, message: 'Acount registered! Please ckeck your email for authenticate your account'})
        
       /* let tokenData = {
            username: user.username,
            id: user._id
        }
        common.sentMailVerificationLink(user, jwt.sign(tokenData, privateKey, {expiresIn: '1h' }), (err, result) => {
            if(err) return res.status(500).json({ success: false, message: `Could not save user. Error: ${err}` })
            return res.status(201).json({ success: true, message: 'Acount registered! Please ckeck your email for authenticate your account'})
        });*/
    });
}

/**
 * Update user in dataBase
 * 
 * @param {string} userId - id user
 * @param {any} update - JSON object to update 
 * @returns 
 */
function updateUser(req, res) {
    let userId = req.params.userId;
    let update = req.body
    if(!userId) return res.status(400).json({ success: false, message: 'No user id provided' }) // Return Error
    
    User.findByIdAndUpdate(userId, { $set: update}, (err, user) => {
        if(err) return res.status(500).json({ success: false, message: `Request failed: ${err}`}); // Return Coneccition Error
        // Check if id is valid ID
        if(!user) return res.status(404).json({ success: false, message: 'User id not found'}); // Return error message

        return res.status(200).json({success: true, user: user});
        
    });
}

function checkEmail(req, res) {
    if (!req.params.email) return res.status(400).json({ success: false, message: 'E-mail was not provided' })
    
    // Search for user's e-mail in database
    User.findOne({ email: req.params.email}, (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err}); //Return connction error
        
        if (user) return res.json({ success: false, message: 'E-mail is already taken'}); //Return as taken email
            
        return res.status(200).json({ success: true, message: 'E-mail is available'}); //Return as available email
    });
    
}

function checkUsername(req, res) {
    if (!req.params.username) return res.status(400).json({ success: false, message: 'Username was not provided' })

    // Search for user's username in database
    User.findOne({ username: req.params.username}, (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err}); //Return connction error
        
        if (user) return res.json({ success: false, message: 'Username is already taken'}); //Return as taken username
            
        return res.status(200).json({ success: true, message: 'Username is available'}); //Return as available username
    });   
}

function authenticate(req, res) {
    if(!req.body.username) return res.status(400).json({ success: false, message: 'No username was provided'});
    if(!req.body.password) return res.status(400).json({ success: false, message: 'No password was provided'});
    
    User.findOne({ username: req.body.username.toLowerCase()}, (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err}); //Return connction error
        
        if (!user) return res.status(422).json({ success: false, message: `User not found`}); //Return as taken username
        
        if ( !user.comparePassword(req.body.password) ) return res.status(401).json({ success: false, message: 'Password Invalid'});
       
        // if (!user.isVerified) return res.status(401).json({ success: false, message: `Your email address is not verified. please verify your email address to proceed` });
        
        var tokenData = {
            username: user.username,
            _id: user._id
        }
        
        var token = jwt.sign(tokenData, privateKey, {expiresIn: '24h'});

        res.status(200).json({
            success: true,
            token: `JWT ${token}`,
            user: {
                username: user.username
            }
        });
    });
}



module.exports = {
    getUserById,
    getUserByUsername,
    saveUser,
    updateUser,
    checkEmail,
    checkUsername, 
    authenticate
}