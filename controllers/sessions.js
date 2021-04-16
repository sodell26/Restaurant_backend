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