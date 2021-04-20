require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')


//sessions
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}))
//middleware
app.use(express.json())

//cors

const corsOptions = {
	"origin": "http://localhost:3000" ,
	"methods":
	"GET, PUT, PATCH, POST, DELETE",
	"credentials": true
}
app.use(cors(corsOptions))
// const whitelist = ['http://localhost:3000']
// const corsOptions = {
// 	origin: function (origin, callback) {
// 	  if (whitelist.indexOf(origin) !== -1 || !origin) {
// 		callback(null, true)
// 	  } else {
// 		callback(new Error('Not allowed by CORS'))
// 	  }
// 	}
//   }
// app.use(cors(corsOptions))

//Database
const mongoURI = process.env.MONGODBURI
const db = mongoose.connection
mongoose.connect(mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=>{
    console.log("Database Connection Checked..")
})
db.on('error', (err)=> { console.log('ERROR: ', err)})
db.on('connected', ()=> { console.log("MONGO Connected")})
db.on('disconnected', ()=> { console.log("MONGO Disconnected")})
app.use((req, res, next)=>{
    next()
})

//controllers
app.use('/account', require('./controllers/accountController'));
app.use('/reviews', require('./controllers/diaryController'))

app.listen(PORT, () => {
	console.log(`Server is listening on port: ${3003}`)
})