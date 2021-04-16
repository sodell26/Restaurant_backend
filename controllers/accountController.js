const express = require('express')
const users = express.Router()
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')


//POST creating New Account
users.post('/:id', (req, res)=>{
    console.log('Post creating New Review working')

    userModel.create(req.body, (error, createdAccount)=>{
        if(error){
            res.status(400).json({error: error.message})
        }
        else{
            res.status(200).json(createdAccount)
        }
    })
})

// POST for creating Account Name/password 
users.post('/', (req,res) => {
	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(13))
	userModel.create(req.body, (err, createdAccount) => {
		if (err) {
			if(err.code === 11000) {
			    res.status(400).json({message: 'User Already Exists'})
			}
		} else {
			console.log(createdAccount)
            res.status(200).json(createdAccount)
		}
	})
})


module.exports = users