// Lets use some of the packages we've installed

const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const newRouter = require('./router.js');

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

//The names we're using below were defined in the last post
MongoClient.connect('mongodb://localhost:27017') // This is the location of where your local database is living.
  .then((client) => {
    const db = client.db('userstorage'); // The name we gave our DB
    const staffCollection = db.collection('user'); // The name we gave our collection inside the DB
    const staffRouter = newRouter(staffCollection); // We haven't built the router functionality yet, but we will next!
  
    app.use('', staffRouter); // Defining the base route where we can later access our data
    console.log("Connected to Mongo client");
  })  .catch(console.err);
/*
var http = require('http');

var server = http.createServer(function (req, res) {   // 2 - creating server

});
*/
//server.listen(5000);

app.listen(4000, function () {
  console.log(`Listening on this port: ${this.address().port}`);
});