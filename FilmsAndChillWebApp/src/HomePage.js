
import React, { useEffect } from "react";
import { MovieCard } from './MovieCard';
import { Header } from "./Header.js";

// Master Class for Home Page, Will have methods to perform the calls to the API since
// the homepage just displays the most popular movies without opportunity for user input
class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.requestMostPopular = this.requestMostPopular.bind(this);

        this.setFirst = this.setFirst.bind(this);

        this.state = {
            first: true,
            mostPopular: []
        }
    }


    async requestMostPopular() {
        // Perform fetch to server
        // console.log( 'in request most pop' );
        const result = await fetch(`http://localhost:4000/getpopular`)
            .then( value => value.json())    
            .then(value => { 
                // console.log(value);
                // Truncate Array to only show 9 most popular movies
                value.popular.length = Math.min(value.popular.length, 9);
                return value.popular; 
            }).catch( error => {alert('error fetching movie')});
        this.setState(() => ({
            mostPopular: result,
            first: false
        }));
    }

    setFirst() {
        this.setState(() => ({ first: false }));
    }

    render () {
        
        return (
            <div className="App">
                <Header />
                <h1> Most Popular Movies </h1>
                
                <MostPopularResults mostPopular={this.state.mostPopular} request={this.requestMostPopular} setFirst={this.setFirst} first={this.state.first}/>
            </div>
        );
    }
}




const MostPopularResults = (props) => {

    useEffect(() => {
        if (props.first) {
            // console.log(' in use effect');
          props.request();
          props.setFirst();
        }
      });


    return (
        <div>
            {
                /* Display the movies returned.  */
                <div className="ValidResults">
                {
                    props.mostPopular.map(movie => 
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


export { HomePage }