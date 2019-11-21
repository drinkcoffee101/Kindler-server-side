const router = require('express').Router()
const cheerio = require('cheerio');
const axios = require('axios')
const Nightmare = require('nightmare');
const queryString = require('query-string');
//imports .env variables
require('dotenv').config()
//models
const Resturant = require('../models/resturant.model')


/*=============================================
=            Helper functions             =
=============================================*/
let config = {
    headers: {
        "user-key": process.env.FOOD_KEY
    }
}

let cuisines = [
    {
        "cuisine": {
            "cuisine_id": 1035,
            "cuisine_name": "Afghan"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 152,
            "cuisine_name": "African"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 1,
            "cuisine_name": "American"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 151,
            "cuisine_name": "Argentine"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 175,
            "cuisine_name": "Armenian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 3,
            "cuisine_name": "Asian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 131,
            "cuisine_name": "Australian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 193,
            "cuisine_name": "BBQ"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 955,
            "cuisine_name": "Bagels"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 5,
            "cuisine_name": "Bakery"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 227,
            "cuisine_name": "Bar Food"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 132,
            "cuisine_name": "Belgian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 270,
            "cuisine_name": "Beverages"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 159,
            "cuisine_name": "Brazilian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 182,
            "cuisine_name": "Breakfast"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 133,
            "cuisine_name": "British"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 168,
            "cuisine_name": "Burger"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 30,
            "cuisine_name": "Cafe"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 491,
            "cuisine_name": "Cajun"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 111,
            "cuisine_name": "Cambodian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 121,
            "cuisine_name": "Cantonese"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 158,
            "cuisine_name": "Caribbean"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 25,
            "cuisine_name": "Chinese"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 161,
            "cuisine_name": "Coffee and Tea"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 928,
            "cuisine_name": "Creole"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 153,
            "cuisine_name": "Cuban"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 192,
            "cuisine_name": "Deli"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 100,
            "cuisine_name": "Desserts"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 958,
            "cuisine_name": "Dominican"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 959,
            "cuisine_name": "Donuts"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 268,
            "cuisine_name": "Drinks Only"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 651,
            "cuisine_name": "Eastern European"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 149,
            "cuisine_name": "Ethiopian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 38,
            "cuisine_name": "European"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 40,
            "cuisine_name": "Fast Food"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 112,
            "cuisine_name": "Filipino"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 45,
            "cuisine_name": "French"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 501,
            "cuisine_name": "Frozen Yogurt"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 274,
            "cuisine_name": "Fusion"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 134,
            "cuisine_name": "German"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 156,
            "cuisine_name": "Greek"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 181,
            "cuisine_name": "Grill"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 521,
            "cuisine_name": "Hawaiian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 148,
            "cuisine_name": "Indian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 114,
            "cuisine_name": "Indonesian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 140,
            "cuisine_name": "Iranian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 135,
            "cuisine_name": "Irish"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 55,
            "cuisine_name": "Italian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 207,
            "cuisine_name": "Jamaican"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 60,
            "cuisine_name": "Japanese"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 67,
            "cuisine_name": "Korean"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 901,
            "cuisine_name": "Laotian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 136,
            "cuisine_name": "Latin American"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 66,
            "cuisine_name": "Lebanese"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 69,
            "cuisine_name": "Malaysian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 70,
            "cuisine_name": "Mediterranean"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 73,
            "cuisine_name": "Mexican"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 137,
            "cuisine_name": "Middle Eastern"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 74,
            "cuisine_name": "Mongolian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 147,
            "cuisine_name": "Moroccan"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 117,
            "cuisine_name": "Nepalese"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 996,
            "cuisine_name": "New American"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 321,
            "cuisine_name": "Pacific"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 963,
            "cuisine_name": "Pacific Northwest"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 139,
            "cuisine_name": "Pakistani"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 183,
            "cuisine_name": "Patisserie"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 162,
            "cuisine_name": "Peruvian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 87,
            "cuisine_name": "Portuguese"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 84,
            "cuisine_name": "Russian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 601,
            "cuisine_name": "Salvadorean"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 691,
            "cuisine_name": "Scandinavian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 210,
            "cuisine_name": "Scottish"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 83,
            "cuisine_name": "Seafood"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 128,
            "cuisine_name": "Sichuan"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 461,
            "cuisine_name": "Soul Food"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 267,
            "cuisine_name": "South African"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 471,
            "cuisine_name": "Southern"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 966,
            "cuisine_name": "Southwestern"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 89,
            "cuisine_name": "Spanish"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 177,
            "cuisine_name": "Sushi"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 190,
            "cuisine_name": "Taiwanese"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 964,
            "cuisine_name": "Teriyaki"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 150,
            "cuisine_name": "Tex-Mex"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 95,
            "cuisine_name": "Thai"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 93,
            "cuisine_name": "Tibetan"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 142,
            "cuisine_name": "Turkish"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 308,
            "cuisine_name": "Vegetarian"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 641,
            "cuisine_name": "Venezuelan"
        }
    },
    {
        "cuisine": {
            "cuisine_id": 99,
            "cuisine_name": "Vietnamese"
        }
    }
]

let test1 = {
    "cuisine": "Chinese",
    "sortBy": "rating",
    "location": "47.652071,-122.413393"
}

let testResturant = {
    "name": "Wild Ginger",
    "location": "1401 3rd Avenue 98101",
    "times": "11:30 AM to 11 PM (Mon-Sat),4 PM to 9 PM (Sun)",
    "thumbnail": "https://b.zmtcdn.com/data/res_imagery/16718687_RESTAURANT_b25bc478f507ad301a07023ac4e41c3c_c.jpg?output-format=webp",
    "rating": "4.7",
    "food_photos": [
        "https://b.zmtcdn.com/data/reviews_photos/dcf/10dc6c2c9aa9c41f9b1457a81a347dcf_1550189837.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "https://b.zmtcdn.com/data/reviews_photos/37b/5053df94ea5be68f371b0fc30739c37b_1550189837.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "https://b.zmtcdn.com/data/reviews_photos/32e/f611814cd52bd5d9a1ad22ef0a3dd32e_1550189838.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "https://b.zmtcdn.com/data/reviews_photos/1e5/bf9c1b8def1dd7ddee5c619e71b981e5_1539317234.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "https://b.zmtcdn.com/data/reviews_photos/a0d/31f3f841982d8632a5562bcbcb67da0d_1523843398.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "https://b.zmtcdn.com/data/reviews_photos/a88/474250ce1c816b63458cb411609aaa88_1523843397.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "https://b.zmtcdn.com/data/reviews_photos/c23/de570bc6444775007c2a9f0dd985dc23_1520632879.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "https://b.zmtcdn.com/data/reviews_photos/487/fd3717af799cacf2576e20c2667fd487_1505866699.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "https://b.zmtcdn.com/data/reviews_photos/c4d/6bd8631e94d28a566e753624ac7ccc4d_1507505481.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
        "https://b.zmtcdn.com/data/reviews_photos/377/19025bfa8e11c6a9d2ab0676f7884377.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A"
    ],
    "phone": "(206) 623-4450, (206) 623-4450",
    "menu_link": "https://www.zomato.com/seattle/wild-ginger-downtown/menu?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1&openSwipeBox=menu&showMinimal=1#tabtop"
}

let getFoodPictures = arr => {
    let pics = []
    let count = 0
    //want 5 pictures from the object 
    while (count < 10) {
        //get the pic
        pics.push(arr[count].photo.thumb_url)
        ++count
    }
    return pics
}
/*=====  End of Helper functions   ======*/


/*=============================================
=            Routes            =
=============================================*/
//route that gets 5 resturants 
/* 
-sort the returned array by user distance 
-should be able to check if the user has selected that resturant already 
    -try to add another entry if so 
-if none are choose, give the user the option to reselect 
    -this should increment the offset by 5 and then re-search (the axios call should probably be its own function)

-add the menu to the db with the resturant (add filed for text menu vs img menu)
*/

//generate 5 search results for the user 
router.route('/get_resturants').get((req, res) => {
    /*
        User - defines cuisine, sortBy (location, price, rating)
        Controller - provides location, offest (start at 0) by 5(?) if user decides to reshuffle
    */
    const { cuisine, sortBy, location, offset } = req.body

    //convert the cuisine to the id
    for (let i = 0; i < cuisines.length; i++) {
        // console.log('hello')
        if (cuisines[i].cuisine.cuisine_name == cuisine) {
            cuisineID = cuisines[i].cuisine.cuisine_id
            break
        }
    }

    axios.get(`https://developers.zomato.com/api/v2.1/search?entity_id=279&entity_type=city&count=5&cuisines=${cuisineID}&sort=${sortBy}&start=${offset}`, config)
        .then(result => {

            let generatedResturants = []
            //contruct resturant models 
            result.data.restaurants.forEach(r => {
                let newResturant = {
                    name: r.restaurant.name,
                    location: r.restaurant.location.address,
                    times: r.restaurant.timings,
                    thumbnail: r.restaurant.featured_image,
                    rating: r.restaurant.user_rating.aggregate_rating,
                    food_photos: getFoodPictures(r.restaurant.photos),
                    phone: r.restaurant.phone_numbers,
                    menu_link: r.restaurant.menu_url
                }
                generatedResturants.push(newResturant)
            });
            res.json(generatedResturants)
        })
        .catch(err => {
            res.status(400).json('Error: ' + err)
        })
})


//so once the user selects the resturant, store into db, and return ID of the document so we can store and associate with date model
router.route('/store_resturant').post((req, res) => {
    //will recieve these values
    const { name, location, times, thumbnail, rating, food_photos, phone, menu_link } = req.body

    const newResturant = {
        name: name,
        location: location,
        times: times,
        thumbnail: thumbnail,
        rating: rating,
        food_photos: food_photos,
        phone: phone,
        menu_link: menu_link
    }
    //add the selected resturant to the db
    Resturant.create(newResturant)
        //scrape and add the menu
        .then(dbResturant => {
            // res.json(dbResturant)
            const nightmare = Nightmare();
            nightmare
                .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
                .goto(`${dbResturant.menu_link}`)
                .evaluate(() => { return document.querySelector('#menu-container').innerHTML })
                .end()
                .then(function (html) {
                    const $ = cheerio.load(html);

                    let menuImg = $('#menu-image').find('img').attr('src')
                    if (menuImg === undefined) {
                        let menu = []
                        $('.text-menu-cat').each((i, item) => {

                            let menuCategory = {
                                category: $(item).find('.category_name').text(),
                                food_items: []
                            }

                            $(item).find('.tmi-text-group').each((i, el) => {
                                let foodItem = {
                                    name: $(el).find('.tmi-name').text().replace(/\n/gi, '').split('$')[0].trim(),
                                    price: $(el).find('.tmi-price-txt').text().replace(/\n/gi, '').trim(),
                                    desc: $(el).find('.tmi-desc-text').text().replace(/\n/gi, '').trim()
                                }
                                menuCategory.food_items.push(foodItem)
                            })
                            menu.push(menuCategory)
                        })
                        res.json(menu)
                    }
                    else {
                        res.json(menuImg)
                    }
                })
                .catch(error => {
                    console.error('Search failed:', error)
                })
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

/*=====  End of Routes  ======*/

// Export routes for server.js to use.
module.exports = router;
