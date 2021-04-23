const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const userModel = require('../models/userModel')



//POST / Sign Up Route
users.post('/signup', (req, res)=>{
    // console.log(req)
    userModel.findOne({username: req.body.username}, (error, foundUser) => {
            if(error) {
                console.log(error)
            }
            console.log(foundUser)
            if(foundUser) {
                console.log('user already exists')
                res.status(401).json({error: 'User already exists'})
        
        } else {
            console.log('Post creating New Account working')

            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
            userModel.create(req.body, (error, createdUser) =>{

                if(error){
                
                    res.status(400).json({error: error.message})

                } else {
                    const userData = createdUser.toObject()
                    delete userData.password
                    req.session.currentUser = createdUser
                    res.status(201).json(userData)
                    console.log(createdUser)

                }
            })
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
                    // console.log('login route hit', req.body.username)
                    //login user and create session
                    req.session.currentUser = foundUser

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