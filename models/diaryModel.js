const mongoose = require('mongoose')
const {Schema, model} = mongoose

const diarySchema = new Schema({
	name: {type:String, required: true},
	address: String,
	rating: {type: Number, max: 5},
	meal: String,
	cost: Number,
	notes: String
})

module.exports = model('Diary', diarySchema)