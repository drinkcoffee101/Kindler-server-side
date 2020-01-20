const router = require('express').Router()
const axios = require('axios')
require('dotenv').config()
//models
const Event = require('../models/event.model')


/*=============================================
=            Helper Functions            =
=============================================*/
//TODO for front-end: Let users choose more than one option because this search might return 1 or no events 
//TODO: give the user the option to just search for 'All' (which should return an empty value)

let classifications = ['music', 'sports', 'arts&theater']

let sportsIDs = [{ name: 'Aquatics', id: 'KnvZfZ7vAeI' },
{ name: 'Athletic Races', id: 'KnvZfZ7vAet' },
{ name: 'Badminton', id: 'KnvZfZ7vAen' },
{ name: 'Bandy', id: 'KnvZfZ7vAel' },
{ name: 'Baseball', id: 'KnvZfZ7vAdv' },
{ name: 'Basketball', id: 'KnvZfZ7vAde' },
{ name: 'Biathlon', id: 'KnvZfZ7vAdd' },
{ name: 'Body Building', id: 'KnvZfZ7vAd7' },
{ name: 'Boxing', id: 'KnvZfZ7vAdA' },
{ name: 'Cricket', id: 'KnvZfZ7vAdk' },
{ name: 'Curling', id: 'KnvZfZ7vAdF' },
{ name: 'Cycling', id: 'KnvZfZ7vAda' },
{ name: 'Equestrian', id: 'KnvZfZ7vAd1' },
{ name: 'eSports', id: 'KnvZfZ7vAJF' },
{ name: 'Extreme', id: 'KnvZfZ7vAdJ' },
{ name: 'Field Hockey', id: 'KnvZfZ7vAJv' },
{ name: 'Fitness', id: 'KnvZfZ7vAJ7' },
{ name: 'Floorball', id: 'KnvZfZ7vA1l' },
{ name: 'Football', id: 'KnvZfZ7vAdE' },
{ name: 'Golf', id: 'KnvZfZ7vAdt' },
{ name: 'Gymnastics', id: 'KnvZfZ7vAdn' },
{ name: 'Handball', id: 'KnvZfZ7vAdl' },
{ name: 'Hockey', id: 'KnvZfZ7vAdI' },
{ name: 'Ice Skating', id: 'KnvZfZ7vA7v' },
{ name: 'Indoor Soccer', id: 'KnvZfZ7vA7e' },
{ name: 'Lacrosse', id: 'KnvZfZ7vA77' },
{ name: 'Martial Arts', id: 'KnvZfZ7vA7d' },
{ name: 'Miscellaneous', id: 'KnvZfZ7vA7A' },
{ name: 'Motorsports/Racing', id: 'KnvZfZ7vA7k' },
{ name: 'Netball', id: 'KnvZfZ7vA76' },
{ name: 'Rodeo', id: 'KnvZfZ7vAea' },
{ name: 'Roller Derby', id: 'KnvZfZ7vAJA' },
{ name: 'Roller Hockey', id: 'KnvZfZ7vA7a' },
{ name: 'Rugby', id: 'KnvZfZ7vA71' },
{ name: 'Ski Jumping', id: 'KnvZfZ7vA7J' },
{ name: 'Skiing', id: 'KnvZfZ7vAd6' },
{ name: 'Soccer', id: 'KnvZfZ7vA7E' },
{ name: 'Softball', id: 'KnvZfZ7vAJd' },
{ name: 'Squash', id: 'KnvZfZ7vA7I' },
{ name: 'Surfing', id: 'KnvZfZ7vA7t' },
{ name: 'Swimming', id: 'KnvZfZ7vA7n' },
{ name: 'Table Tennis', id: 'KnvZfZ7vA7l' },
{ name: 'Tennis', id: 'KnvZfZ7vAAv' },
{ name: 'Toros', id: 'KnvZfZ7vAAe' },
{ name: 'Track & Field', id: 'KnvZfZ7vAAd' },
{ name: 'Volleyball', id: 'KnvZfZ7vAA7' },
{ name: 'Waterpolo', id: 'KnvZfZ7vAAA' },
{ name: 'Wrestling', id: 'KnvZfZ7vAAk' }]

let musicGenreIDs = [{ name: 'Alternative', id: 'KnvZfZ7vAvv' },
{ name: 'Ballads/Romantic', id: 'KnvZfZ7vAve' },
{ name: 'Blues', id: 'KnvZfZ7vAvd' },
{ name: 'Chanson Francaise', id: 'KnvZfZ7vAvA' },
{ name: 'Children\'s Music', id: 'KnvZfZ7vAvk' },
{ name: 'Classical', id: 'KnvZfZ7vAeJ' },
{ name: 'Country', id: 'KnvZfZ7vAv6' },
{ name: 'Dance/Electronic', id: 'KnvZfZ7vAvF' },
{ name: 'Folk', id: 'KnvZfZ7vAva' },
{ name: 'Hip-Hop/Rap', id: 'KnvZfZ7vAv1' },
{ name: 'Holiday', id: 'KnvZfZ7vAvJ' },
{ name: 'Jazz', id: 'KnvZfZ7vAvE' },
{ name: 'Latin', id: 'KnvZfZ7vAJ6' },
{ name: 'Medieval/Renaissance', id: 'KnvZfZ7vAvI' },
{ name: 'Metal', id: 'KnvZfZ7vAvt' },
{ name: 'New Age', id: 'KnvZfZ7vAvn' },
{ name: 'Other', id: 'KnvZfZ7vAvl' },
{ name: 'Pop', id: 'KnvZfZ7vAev' },
{ name: 'R&B', id: 'KnvZfZ7vAee' },
{ name: 'Reggae', id: 'KnvZfZ7vAed' },
{ name: 'Religious', id: 'KnvZfZ7vAe7' },
{ name: 'Rock', id: 'KnvZfZ7vAeA' },
{ name: 'Undefined', id: 'KnvZfZ7vAe6' },
{ name: 'World', id: 'KnvZfZ7vAeF' }]

let artsAndTheaterIDs = [{ name: 'Children\'s Theatre', id: 'KnvZfZ7v7na' },
{ name: 'Circus & Specialty Acts', id: 'KnvZfZ7v7n1' },
{ name: 'Classical', id: 'KnvZfZ7v7nJ' },
{ name: 'Comedy', id: 'KnvZfZ7vAe1' },
{ name: 'Cultural', id: 'KnvZfZ7v7nE' },
{ name: 'Dance', id: 'KnvZfZ7v7nI' },
{ name: 'Espectaculo', id: 'KnvZfZ7v7nt' },
{ name: 'Fashion', id: 'KnvZfZ7v7nn' },
{ name: 'Fine Art', id: 'KnvZfZ7v7nl' },
{ name: 'Magic & Illusion', id: 'KnvZfZ7v7lv' },
{ name: 'Miscellaneous', id: 'KnvZfZ7v7le' },
{ name: 'Miscellaneous Theatre', id: 'KnvZfZ7v7ld' },
{ name: 'Multimedia', id: 'KnvZfZ7v7l7' },
{ name: 'Music', id: 'KnvZfZ7v7lA' },
{ name: 'Opera', id: 'KnvZfZ7v7lk' },
{ name: 'Performance Art', id: 'KnvZfZ7v7l6' },
{ name: 'Puppetry', id: 'KnvZfZ7v7lF' },
{ name: 'Spectacular', id: 'KnvZfZ7v7la' },
{ name: 'Theatre', id: 'KnvZfZ7v7l1' },
{ name: 'Variety', id: 'KnvZfZ7v7lJ' }]

//DRY: both axios calls return similar data structures 
let foundDataReduction = (data, res, date) => {

    let foundEvents = []
    data.forEach(e => {
        let event = {
            name: e.name,
            link: e.url,
            image: e.images[0].url,
            time: e.dates.start.localTime,
            //returned the array to avoid null error
            price: e.priceRanges,
            venue: e._embedded.venues[0].name,
            address: e._embedded.venues[0].address.line1,
            date: date
        }
        foundEvents.push(event)
    })

    res.json(foundEvents)

}
//find the ID associated with the specific genre of the classification 
let findID = (genre, classification) => {
    let count = 0

    if (classification === 'music') {
        while (count < musicGenreIDs.length) {
            if (musicGenreIDs[count].name === genre) {
                return musicGenreIDs[count].id
            }
            ++count
        }
    }
    else if (classification === 'sports') {
        while (count < sportsIDs.length) {
            if (sportsIDs[count].name === genre) {
                return sportsIDs[count].id
            }
            ++count
        }
    }
    else {
        while (count < artsAndTheaterIDs) {
            if (artsAndTheaterIDs[count].name === genre) {
                return artsAndTheaterIDs[count].id
            }
            ++count
        }

    }
}
/*=====  End of Helper Functions  ======*/


/*=============================================
=            Routes                       =
=============================================*/
//get route to search all of Seattle by classification and muisc/sport/art ID
router.route('/find_events').post((req, res) => {
    const { date, classification, genre } = req.body

    axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?city=seattle&localStartDateTime=${date}T00:00:00,${date}T23:00:00&size=5&classificationName=${classification}&genreId=${findID(genre, classification)}&apikey=${process.env.EVENT_KEY}`)
        .then(result => {
            //if the search returns something
            if (result.data._embedded != undefined) {
                let data = result.data._embedded.events
                foundDataReduction(data, res, date)
            }
            // if no events found, suggest some
            else {
                axios.get(`https://app.ticketmaster.com/discovery/v2/suggest?apikey=${process.env.EVENT_KEY}&keyword=${classification}&latlong=47.6062095,-122.3320708&radius=15&locale=*&size=5&countryCode=US&preferredCountry=us&localStartEndDateTime=${date}T00:00:00,${date}T23:00:00`)
                    .then(result => {
                        let data = result.data._embedded.events
                        foundDataReduction(data, res, date)
                    })
                    .catch(err => {
                        res.status(400).json('Error: ' + err)
                    })
            }
        })
        .catch(err => {
            res.status(400).json('Error: ' + err)
        })
})

//post route to add the selection to the db
router.route('/store_event').post((req, res) => {
    const { name, link, time, price, venue, image, address, date, classification } = req.body

    const newEvent = {
        name: name,
        link: link,
        time: time,
        price: price,
        venue: venue,
        image: image,
        address: address,
        date: date,
        type: classification
    }

    Event.create(newEvent)
        .then(dbEvent => {
            res.json(dbEvent)
        })
        .catch(err => res.status(400).json('Error: ' + err))
})
/*=====  End of Routes  ======*/



// Export routes for server.js to use.
module.exports = router;