import React, { useEffect } from "react";
import { MovieCard } from './MovieCard';
import {Header} from './Header';

    // Query the database to get movies by user
    async function queryDb() {

        // Fetch my List from the database
        const movies = await fetch(`http://localhost:4000/getmovies/${localStorage.getItem('username')}`)
            .then( value => value.json())    
            .then(value => { 
                    console.log(value);
                    return value.movies; 
                }).catch( error => {alert('error fetching movie')});

        return movies;
    }

class MyListPage extends React.Component {
    initialResults = [];
    // Constructor to bind Methods and set state
    constructor(props) {
      super (props);
      this.setFirst = this.setFirst.bind(this);
      this.updateResults = this.updateResults.bind(this);
      this.state = {
        movieResults: [],
        numOfMovies: 0,
        first: true
      }
      this.initialResults = queryDb();
    }


    setFirst() {
      this.setState(() => ({ first: false }));
    }
  
    async updateResults() {
        console.log('fetch updated results called');

        const allResults = await queryDb();
        console.log(allResults);

        this.setState( () => ({
                movieResults: allResults,
                numOfMovies: allResults.length
        }));
    }
  
    render() {
      return (
       
        <div className="App">
           <Header />
          <h1> View your movies and share with friends!</h1>
          <MovieCard />
          <DisplayMovies 
            updateResults={this.updateResults} 
            movieResults={this.state.movieResults} 
            numOfMovies={this.state.numOfMovies}
            setFirst={this.setFirst}
            first={this.state.first}
            
          />

          <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-size="large" data-text={`Check out what I&#39;m watching! Username: ${localStorage.getItem('username')}`} data-url="https://ourWebsiteDomain.com" data-hashtags="#MyMovieList" data-show-count="false">
            <img src="https://cdn.iconscout.com/icon/free/png-256/twitter-share-button-3289861-2758559.png" alt="Twitter share button"/>
          </a>
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
          {/* Facebook button plugin */}
          <div id="fb-root"></div>
          <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v14.0" nonce="fAVIvF7f"></script>
          <div className="fb-share-button" data-href="https://OurWebsiteDomain" data-layout="button" data-size="small"><a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2FlocalHost:3000%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore">
          <img src="https://tapnetwork2030.org/wp-content/uploads/2016/04/fb-big-share.jpg" alt="Facebook share button" />
          </a></div>
        </div>
      );
    }
  }

//props will hold the movie information.
const DisplayMovies = (props) => {

    useEffect(() => {
      if (props.first) {
        props.updateResults();
        props.setFirst();
      }
    });


    return (
        <div>
        {
            props.numOfMovies > 0 && <div className="ValidResults">
            {
                props.movieResults.map(result => <div className="DisplayedMovies">
                    <MovieCard key={result.imdbID} title={result.Title} poster={result.Poster} imdbID={result.imdbID}/>
                    </div>)
            }
        </div>
        }


        {props.numOfMovies < 1 && <div className="invalidResults">
              <p>No movie has beed added yet.</p>
          </div> 
        }

        </div>
    )
}

export {MyListPage};
