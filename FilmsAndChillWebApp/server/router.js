// router.js is used to define CRUD operations

const { RssFeed } = require('@mui/icons-material');
const e = require('express');
const express = require('express');
const ObjectID = require('mongodb').ObjectId;

// This function will hold all the routing functionality for the database, and will be used in server.js
const newRouter = function (collection) {

  const router = express.Router();
  
  // Function for catching errors, this is to keep the code DRY
  const errorCatcher = function(inputError){
    console.error(inputError);
    /* res.status(500);
    res.json({ status: 500, error: inputError }); */
  }
  
  // Route for getting all user data
  router.get('/', (req, res) => {
    collection
      .find()
      .toArray()
      .then((docs) => res.json(docs))
      .catch((err) => errorCatcher(err));
  });

  // Route for getting whether user is okay to log on
  router.get('/login/:username/:password', async (req, res) => {
    // console.log('in login!');
    const id = req.params.username;
    const pass = req.params.password;
    const user = await collection.findOne({ username: id, password: pass})
    if(user) {
      res.status(200).send();
    } else {
      res.status(400).send()
    }
  });

  // Route for getting user's movie list
  router.get('/getmovies/:username', async (req, res) => {

    const id = req.params.username;
    let user = await collection.findOne({ username: id });
    // res.append( 'body', user.movies);
    if (user) { // Check if the entered user name hits a match in the database
      res.status(200).json({movies: user.movies});
    }
    else {
      res.status(400).send();
    }


      // .then((doc) => res.json(doc.movies))
      // .catch((err) => res.status(500).json({error: "error with DB"}));
  });

    // Route for getting user's movie list
  router.get('/getmovies/:username', async (req, res) => {
    
    // console.log('the function starts with ' + req.params.username);
    // console.log('in getmovies!');
    const id = req.params.username;
    
    // console.log(id);
    
    let user = await collection.findOne({ username: id });

    // console.log(user);
    // console.log(user.movies);
    // res.append( 'body', user.movies);
    res.status(200).json({movies: user.movies});

      // .then((doc) => res.json(doc.movies))
      // .catch((err) => res.status(500).json({error: "error with DB"}));
  });

  // Route for getting most popular movies
  router.get('/getpopular/', async (req, res) => {    
    // console.log('in get popular movies!');

    const movies = await collection.findOne({ category: 'popular' });
    movies.popularMovies.sort((a, b) => {
      return b.count - a.count;
    })

    res.status(200).json({popular: movies.popularMovies});
  });

  // Route for deleting a movie from a user
  router.delete('/movie/:username', async (req, res) => {
    const imdbId = req.body.imdbId;

    await collection
    .updateOne({ username: req.params.username }, { $pull: {'movies.imdbID': imdbId} })
    .then(() => {
      res.status(200);
    })
    .catch((err) => errorCatcher(err));
  });

  // Route for creating new user
  router.post('/signup/', async (req, res) => {
    const newData = {
      username: req.body.username,
      password: req.body.password,
      movies: []
    }

    // Check that username isn't taken if ()

    const existingUser = await collection.findOne({username: newData.username});
    if (existingUser) {
      res.status(404).send();
    }

    await collection
    .insertOne(newData)
    .then((result) => {
      console.log('');
      res.status(200).send( {msg: "user successfully created"} );
    })
    .catch((err) => errorCatcher(err));
  });


 async function addToPopular(movie) {

  const existingMovies = await collection.findOne({category: 'popular'});

  let alreadyExists = false;

  existingMovies.popularMovies.forEach(curr => {
    if(curr.imdbID == movie.imdbID) {
      curr.count += 1;
      collection
      .updateOne({ category: 'popular' }, { $set: {popularMovies: existingMovies.popularMovies } })
      alreadyExists = true;
    }
  });

  movie.count = 1;
  if (!alreadyExists) {
    await collection
    .updateOne({ category: 'popular' }, { $push: {popularMovies: movie} })
  }
  

}

  // Route for adding a new movie to a user
 router.post('/movie/:username', async (req, res) => {
    // console.log('in add to my list');
    const newMovie = req.body;

    const existingMovie = await collection.findOne({username: req.params.username, 'movies.imdbID': newMovie.imdbId});

    if (existingMovie) {
      res.status(404).send({err: "movie already added"});
    }
    
    await addToPopular(newMovie);

    await collection
    .updateOne({ username: req.params.username }, { $push: {movies: newMovie} })
    .then(() => {
      res.status(200);
    
    })
    .catch((err) => errorCatcher(err));
  });

  
  
  return router;

};

module.exports = newRouter;