const bcrypt = require('bcrypt');
const express = require('express');
const sessions = express.Router();
const User = require('../models/userModel');


//session new route
sessions.get('/new', (req,res) => {
	//connect w/ react
	res.send(console.log('new session'))
})

//user login
sessions.post('/', (req,res) => {
	User.findOne({ username: req.body.username}, (err, foundUser) => {
		if (err) {
			res.send(err)
		} else if (!foundUser){
			res.send(console.log('user not found'))
				} else {
					if (bcrypt.compareSync(req.body.password, foundUser.password)) {
						req.session.currentUser = foundUser
						res.send(console.log('user exists!'))
			} else {
				res.send(console.log("password doesn't match"))
			}
		}
	})
})

sessions.delete('/', (req,res) => {
	req.session.destroy(()=> {
		res.send(console.log('session ended'))
	})
})

module.exports = sessions;

// Seamus code:
// req.session.currentUser = loginAttempt.username;

//The last bit is to send some info about whether or not the user is logged from express to react . I am doing this for every endpoint that needs authentication.
// res.status(200).json({
// 	data: myData,
// 	currentUser: req.session.currentUser || null
//   })

// use express-session
// on the backend – cors  should use the "credentials" : true  config
// on the front end – fetch requests should use the credentials: 'include' flag
// JSON responses from the backend should send info about the currentUser attached to req.session