# Kindler (repo for the server/backend which is hosted on heroku)
** The primary codebase can be found in this [repo](https://github.com/satchelsmidt/Kindler)


### About
  
Kindler is a mobile application built using React Native, and developed by a team of 3

The goal of this application is to provide individuals and those in relationships with planning tools to empower them during the decision making process of going out on a date with someone. The idea is to provide fun and varied options for couples in established relationships, as well as people dating for the first time. Oftentimes, the date planning process becomes routine and it can be difficult to come up with new and interesting things to do with your partner. Kindler is trying to change that. 

Kindler was built using React Native, with routing and the server-side framework using Node.js and Express.js. Data is retrieved from both open source and custom-built APIs, and stored using MongoDB. The application is deployed on Heroku. 

### Walkthrough

The user begins on the login page, which allows them to log in using either their Google account, or an existing email and password of their choice. 

Once the user is logged in, they are taken straight to their dates page. This page shows them a list of all the dates they have created, and includes the day each date is planned, as well as a summary of each activity that has been planned for the date. 

The user can click the 'create' tab at the bottom of the app to begin the process for creating a new date. The user will first be prompted to choose the date of that date. Once this is done, they will select cuisine types they are interested in, movie genres they want to watch, and an event type (music, sports, or theater/art) and genre that they like. Once all of the users preferences have been recorded, the app makes API calls to the following sources to retrieve data:
* Zomato
* Ticketmaster
* Custom-Built movie scraping API

Once data matching user preferences is returned, the user is shown a page with swipeable cards for each category. They can filter through the returned restaurants, movies, and events, and add one of each to their plan that they are interested in. 

The following link shows a demo of the app, and walks through the entire flow from a user perspective:

<a href="https://www.youtube.com/watch?v=9QN2OPpL3Kc" target="_blank">Link</a>


### Technology Used

* JavaScript
  * React.js
  * React Native
  * Node.js
  * Express.js
* MongoDB
  * Mongoose
* Expo

### Contributers
 * Deron Coffie
 * Cesar Silva
 * Satchel Smidt
	
### Future Development

* Remove rendering error
* Comment all lines of code with clear explanations
* Make UI consistent accross entire app
* Remove .env file from public view
* Work on readme for projcet (include videos, gifs, description)
* Make folder structure meet MVC criteria
  * Add front end to client folder

__Satchel__:
* Make genre selection for events reflect user choice
* In-app feedback/response when user selects date, all other categories, or
swipes card
* Add in ability to select types of date plans before creation 
(movie, food, event, or all) after 'day' selection 
* Turn all separate selector wheels into one component, update based on page
loaded
* Remove outdated comments

__Deron__: 
* Animations on page load + login
* Add in 'staying in' option (after 'day' selection)
* Consistent UI font styling, page animations/images
* Add in ability to login with emails

__Cesar__:
* To add
