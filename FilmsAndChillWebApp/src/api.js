// require('dotenv').config();
// const fetch = require('node-fetch');

// can work on hiding this later
const apiKey = '35977a70';

export function callApi(title) {
    return fetch(`http://www.omdbapi.com/?s=${title}&apikey=${apiKey}`)
    .then((response) => { 
        return response.json().then((data) => {
            console.log(data);
            return data;
        }).catch((err) => {
            console.log(err);
        }) 
    });
}

export function callSpecificApi(title, imdbid, callback) {
    return fetch(`http://www.omdbapi.com/?t=${title}&i=${imdbid}&apikey=${apiKey}`)
    .then((response) => { 
        return response.json().then((data) => {
            callback(data);
        }).catch((err) => {
            console.log(err);
        }) 
    });
}

// callApi().then(data => console.log(data));