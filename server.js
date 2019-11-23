const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
//imports .env variables/
require('dotenv').config({path: './backend/.env'})

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const uri = process.env.ATLAS_URI

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })

const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB database connection established successfully')
}).then(() => { }).catch(err => console.error(err))

const moviesRouter = require('./backend/routes/movieAPI')
const resturantsRouter = require('./backend/routes/resturantAPI')
const datesRouter = require('./backend/routes/dateAPI')
const eventsRouter = require('./backend/routes/eventAPI')

app.use('/movies', moviesRouter)
app.use('/resturants', resturantsRouter)
app.use('/date', datesRouter)
app.use('/events', eventsRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})