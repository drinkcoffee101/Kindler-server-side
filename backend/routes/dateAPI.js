const router = require('express').Router()
const axios = require('axios')
const date = require('date-and-time');


//models
const UserDate = require('../models/date.model')
const User = require('../models/user.model')



/*=============================================
=            Routes            =
=============================================*/
//see if user exsists 
router.route('/find_user/:auth').get((req, res) => {
    User.find({ auth_return: req.params.auth })
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(400).json('Error: ' + err))
})
//create a user
router.route('/create_user').post((req, res) => {
    const { name, auth } = req.body

    const newUser = {
        name: name,
        auth_return: auth
    }

    User.create(newUser)
        .then(dbUser => {
            res.json(dbUser)
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

//test resturantID: 5dd4befc6e550a0b74d6cd2d
//test movieID: 5dd1d5bc042c8e4b4cd986e1
//test userID: 5dd625cd294dd35110a02b74
//test eventID: 5dd8db4c7156522884c0b999
//a post route that adds the movie, resturant, and event to the user date (just grab the IDs)
router.route('/add_date').post((req, res) => {
    // TODO: add the 'stay in' options

    const { resturantID, movieID, eventID, userID } = req.body
    //generates the current date
    const now = new Date();
    date.format(now, 'ddd., MMM. DD YYYY');


    const newDate = {
        resturants: resturantID,
        movies: movieID,
        events: eventID,
        date_created: now.toString().slice(0, 17)
    }
    //add the date to the db
    UserDate.create(newDate)
        .then(dbDate => {
            //assocate the date with the user
            User.findOneAndUpdate({ _id: userID }, { $push: { dates: dbDate.id } })
                .then(dbUser => {
                    res.json(dbUser)
                })
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err))
})


//a route that gets the users date and populates each date and the info assocsted with each date activity
//test userID: 5dd625cd294dd35110a02b74
router.route('/all_dates/:userID').get((req, res) => {
    User.find({ _id: req.params.userID })
        .populate({
            path: 'dates',
            populate: [{
                path: 'resturants'
            }, {
                path: 'movies'
            }, {
                path: 'events'
            }],
            options: { sort: { '_id': 1 } }
        })
        .sort({ '_id': 1 })
        .then(dbUser => {
            // //write a function that looks at each objet _id and inserts the date_created to that object 
            // dbUser[0].dates.forEach(item => {
            //     let creationDate = item._id.getTimestamp().toString().slice(0, -42)
            //     item.date_created = creationDate
            // });

            res.json(dbUser)
        })
        .catch(err => res.status(400).json('Error: ' + err))
})
/*=====  End of Routes  ======*/




// Export routes for server.js to use.
module.exports = router;