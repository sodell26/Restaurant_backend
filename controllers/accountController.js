const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const userModel = require('../models/userModel')



//POST / Sign Up Route
users.post('/signup', (req, res)=>{
    console.log('Post creating New Account working')

    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    userModel.create(req.body, (error, createdUser) =>{
        if(error){
            res.status(400).json({error: error.message})
        } else{
            const userData = createdUser.toObject()
            delete userData.password
            res.status(201).json(userData)
        }
    })
})

// User Log In Route (Create sessions route)
users.post('/login', (req, res) => {
    userModel.findOne({ username: req.body.username }, (error, foundUser)=>{
        if(error){
            res.send(error)
        }else{
            if(foundUser){
                if(bcrypt.compareSync(req.body.password, foundUser.password)) {
                    //login user and create session
                    req.session.currentUser = foundUser
                    //add to signup so they login when they signup
                    res.status(200).json(foundUser)
                }else{
                    res.status(404).json({ error: 'User Not Found'})
                }
            } else{
                res.status(400).json({ error: error.message})
            }
        }
    })
})

//Users Delete
users.delete('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.status(200).json({msg: 'Users Logged Out'})
    })
})

module.exports = users