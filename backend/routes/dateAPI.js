const router = require('express').Router()
const axios = require('axios')


//models
const UserDate = require('../models/date.model')
const User = require('../models/user.model')



/*=============================================
=            Routes            =
=============================================*/
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


//this is like after they hit submit. 
//test resturantID: 5dd4befc6e550a0b74d6cd2d
//test movieID: 5dd1d5bc042c8e4b4cd986e1
//a post route that adds the movie and resturant to the user date (just grab the IDs)
router.route('/add_date').post((req, res) => {
    // TODO: add the event/music eventually

    const { restutantID, movieID } = req.body

    const newDate = {
        resturant: restutantID,
        movie: movieID
    }

    //TODO: will want to assocate the date with the user //

    UserDate.create(newDate)
        .then(dbDate => {
            res.json(dbDate)
        })
        .catch(err => res.status(400).json('Error: ' + err))
})


//a route that gets the users date and populate everything 



/*=====  End of Routes  ======*/




// Export routes for server.js to use.
module.exports = router;