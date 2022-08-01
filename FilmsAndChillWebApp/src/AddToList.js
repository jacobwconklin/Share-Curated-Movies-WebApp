

// name in the url, body needs to be the movie object, (title, imdbid, poster)
const AddToList = (username, Title, Poster, imdbID) => {
    // POST to server the movie and user to add the movie to the user's list
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Poster, Title, imdbID})
    };
    fetch('http://localhost:4000/movie/' + username, requestOptions)
}

export {AddToList};

