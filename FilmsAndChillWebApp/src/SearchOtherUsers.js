import React from "react";
import TextField from '@mui/material/TextField';
import { MovieCard } from "./MovieCard";
import { AddToList } from "./AddToList";
import {Header} from "./Header"

// Master clas for the Search Other Users page
class SearchOtherUsers extends React.Component {
    constructor(props) {
        super(props);
        // Bind methods to this so they can access state
        this.setUsername = this.setUsername.bind(this);
        this.performSearch = this.performSearch.bind(this);
        // The username is not the name of the current user, but the username
        // used for searching on this page!
        this.state ={
            username: undefined,
            successfulSearch: false,
            moviesReturned: [],
            searchMessage: 'Try typing in a friend\'s username and click search!'
        };
    }

    // Changes the username in state when the user types in a new username
    setUsername(username) {
        this.setState(() => ({username}))
    }

    // Actually performs the search Calling to the server and recording both if the search
    // is a hit, and the list of movies returned if it is
    async performSearch() {
        // Check that valid username has been entered
        if (this.state.username && this.state.username.trim()) {
            // Attempt call to server
            const result = await fetch(`http://localhost:4000/getmovies/${this.state.username}`)
            .then( value => value.json())    
            .then(value => { 
                    console.log(value);
                    return value.movies; 
                }).catch( 
                    () => {
                        this.setState ( ()=> ({
                            moviesReturned: [],
                            successfulSearch: false,
                            searchMessage: this.state.username + ' Could not be found'
                        }))
                        return;
                    });
            
                console.log(result);
            // If username not found, reset moviesReturned to a blank array and Search message to say the search failed
            // Set successful Search to false
            if (result.length === 0) {
                this.setState ( ()=> ({
                    moviesReturned: [],
                    successfulSearch: false,
                    searchMessage: this.state.username + ' Has no movies in their list'
                }))
            }
            // Otherwise call to server succeeded, extract the movies to be displayed and adjust the search message and
            // successful Search
            else {
                console.log('retrieved movies');
                this.setState( () => ({
                    searchMessage: `${this.state.username} has ${result.length} titles in their list!`,
                    successfulSearch: true,
                    moviesReturned: result,
                }));
            }

        }
    }

    render () {
        return (
            <div className="App">
                 <Header />
                <h1> Search for a User: </h1>
                <SearchBar 
                    setUsername={this.setUsername} 
                    performSearch={this.performSearch} 
                />
                <SearchResults 
                    searchMessage={this.state.searchMessage} 
                    successfulSearch={this.state.successfulSearch}
                    moviesReturned={this.state.moviesReturned}
                />
            </div>
        );
    }
}

// Function for housing the search bar, it will call back to SearchOtherUsers with the text users put in the field
// and call a function in SearchOtherUsers to perform the search whent the button is clicked
const SearchBar = (props) => {
    return (
        <div>
            <TextField className="UsernameBox" label="Username" variant="filled" onChange={(e) => props.setUsername(e.target.value)} />
            <button onClick={props.performSearch} className="SearchOtherUsersButton">SEARCH</button>
            <br className="Breaks"></br>
        </div>
    );

}

// Function to propogate all of the MovieCards from the search results if there are any, plus the unique search
// message supplied for each circumstance
const SearchResults = (props) => {
    return (
        <div>
            
            <h1>{props.searchMessage}</h1>
            {
                /* The search message is given to us even on a bad search, so here we just check
                 if the search was successful then iterate through the MoviesReturned creating MovieCards for each one */
                props.successfulSearch  && 
                <div className="ValidResults">
                {
                    props.moviesReturned.map(movie => 
                        <div key={movie.imdbID} className="DisplayedMovies">
                        <MovieCard title={movie.Title} poster={movie.Poster} imdbID={movie.imdbID}/>
                        { /*
                        <button className="AddToListButton" onClick={
                            AddToList(localStorage.getItem('username'), movie.Title, movie.Poster, movie.imdbID)
                        }>Add to My List +</button>
                        */ }
                        </div>
                    )
                }
                </div>
            }
        </div>
    );
}

export {SearchOtherUsers};