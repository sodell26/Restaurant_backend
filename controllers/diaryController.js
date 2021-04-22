const express = require('express')
const entries = express.Router()
const diaryModel = require('../models/diaryModel')
const userModel = require('../models/userModel')

// GET (Index) ---- List of Reviews -----------
entries.get('/', (req, res)=>{
    // console.log('Index entries working!')
    // console.log('entry GET hit',req.session.currentUser.username)
    userModel.findById(req.session.currentUser._id, (error, foundUser)=>{
        if(error){
            res.status(400).json(error)
        }else{
            res.status(200).json(foundUser.favReviews)
        }
    }).populate('favReviews')

})


//POST creating New Review
entries.post('/new', (req, res)=>{
    console.log(req.session.currentUser)

    diaryModel.create(req.body, (error, createdEntry)=>{
        if(error){
            res.status(400).json({error: error.message})
        }
        else{

            userModel.findById(req.session.currentUser._id, (error, foundUser)=>{
                if(error){
                    res.status(400).json({ error: error.message })
                }else{
                    foundUser.favReviews.push(createdEntry)
                    foundUser.save()
                    res.status(201).json(createdEntry)
                }
            })
        }
    })
    // console.log('Post creating New Review working')
    // diaryModel.create(req.body, (error, createdEntry)=>{
    //     if(error){
    //         res.status(400).json({error: error.message})
    //     }
    //     else{
    //         res.status(200).json(createdEntry)
    //     }
    // })
})

//PUT for Updating review
entries.put('/:id', (req, res)=>{
    // console.log('PUT for updating working')

    diaryModel.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, updatedEntry)=>{
        if(error){
            res.status(400).json({error: error.message})
        }
        else{
            res.status(200).json({
                message: `Entry ${updatedEntry.id} updated successfully!` ,
                data: updatedEntry 
            })
        }
    })
})

//DELETE Route for reviews
entries.delete('/:id', (req, res)=>{
    // console.log('Delete working')

    diaryModel.findByIdAndDelete(req.params.id, (error, deletedEntry)=>{
        if(error){
            res.status(400).json({error: error.message})
        }
        else if(deletedEntry === null){
            res.status(404).json({message: 'Entry id not found'})
        }
        else{
            res.status(200).json({message: `Entry ${deletedEntry.restName} deleted successfully`})
        }
    })
})

// PATCH ROUTE increments numbers of likes
// holidays.patch('/addlikes/:id', (req, res)=>{

// 	holidaysModel.findByIdAndUpdate(req.params.id, { $inc: { likes : 1} }, {new:true}, (error, updatedHoliday)=>{
// 		if (error){
// 			res.status(400).json({error: error.message})
// 		}
// 		else{
// 			res.status(200).json({
// 				data: updatedHoliday
// 			})
// 		}
// 	})
// })


module.exports = entries