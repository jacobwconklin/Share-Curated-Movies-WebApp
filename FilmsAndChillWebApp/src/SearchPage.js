
import React from 'react';
import { MovieCard } from './MovieCard';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import { AddToList } from './AddToList';
import { Header } from "./Header.js";

const apiKey = '35977a70';

const username = 'exampleUser';

// Master Class containing other classes for Search Page
class SearchPage extends React.Component {
    // Constructor to bind Methods and set state
    constructor(props) {
      super (props);
      this.handleSearch = this.handleSearch.bind(this);
      this.setYear = this.setYear.bind(this);
      this.setType = this.setType.bind(this);
      this.clickLeft = this.clickLeft.bind(this);
      this.clickRight = this.clickRight.bind(this);
      this.setCurrentSearch = this.setCurrentSearch.bind(this);
      this.resetPage = this.resetPage.bind(this);
      this.state = {
        searchResults: null,
        validResults: false,
        numOfHits: 0,
        currentSearch: null, // Holds the latest title searched
        year: '', // Year filter for more specific results
        type: 'any', // type filter where movie, series, and episode, are the three valid types
        page: 1 // Shows page for the search results, 
      }
    }

    setYear(year) {
        this.setState(() => ({ year }));
    }

    setType(type) {
        this.setState(() => ({ type: type.toLowerCase() }));
    }

    clickLeft() {
      if (this.state.page > 1) {
        this.setState((prevState) => ({
          page: prevState.page - 1
        }))
      }
    }

    clickRight() {
      if (this.state.page * 10 < this.state.numOfHits) {
        this.setState((prevState) => ({
          page: prevState.page + 1
        }))
      }
    }

    setCurrentSearch(titleSearched) {
      this.setState(() => ({ currentSearch: titleSearched }));
    }

    resetPage() {
      this.setState(() => ({ page: 1 }));
    }
  
    handleSearch(allResults) {
        // allResults comes with three elements: 
        // Response (bool if search was successful)
        // Search (Array of all matching movies)
        // totalResults (int of number of hits)
        // console.log('Handle search called');

        // First handle invalid search results
        if (!allResults.Response) {
            this.setState( () => ({validResults: false, numOfHits: 0, searchResults: null}));
        }
        // Otherwise save the results changing the state refreshing the ShowResults Component with
        // new Props!
        else {
            this.setState( () => ({
                searchResults: allResults.Search,
                validResults: allResults.Response === 'True',
                numOfHits: allResults.totalResults
            }));
        } 
    }
  
    render() {
      return (
        <div className="App">
          <Header />
          <h1> Enter A Movie Title to Get Started </h1>
          {/* Twitter button plugin */}

          <FilterBox setYear={this.setYear} setType={this.setType}/>
          <SearchBar 
            handleSearch={this.handleSearch} 
            year={this.state.year} 
            type={this.state.type} 
            page={this.state.page} 
            currentSearch={this.state.currentSearch}
            setCurrentSearch={this.setCurrentSearch}
            resetPage={this.resetPage}
          />
          <SearchResults 
            searchResults={this.state.searchResults} 
            validSearch={this.state.validResults} 
            hits={this.state.numOfHits} 
            clickLeft={this.clickLeft}
            clickRight={this.clickRight}
            page={this.state.page}
          />
        </div>
      );
    }
  }
  
  
  class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.SearchForTitle = this.SearchForTitle.bind(this);
        this.SearchNewPage = this.SearchNewPage.bind(this);
        // Use state here for tracking applied filters
        this.state = {
            genre: null,
            length: null,
            currentPage: 1
        }

    }
    // Switches the page with the same search as before
    SearchNewPage() {
      // Search page at this.props.page and update this.state.currentPage
      this.setState(() => ({ currentPage: this.props.page}));
      // Perform call to API this time specifying page number, and using
      // the title previously used
      let getCall = `http://www.omdbapi.com/?s=${this.props.currentSearch}&apikey=${apiKey}`;
      if (this.props.year !== '') {
          getCall = getCall + '&y=' + this.props.year;
      }
      if (this.props.type !== 'any') {
          getCall = getCall + '&type=' + this.props.type;
      }
      // Add in page
      getCall = getCall + '&page=' + this.props.page;
      fetch(getCall).then(
      value => value.json()).then(formattedValue => {
          // console.log(formattedValue);
          this.props.handleSearch(formattedValue);
      }).catch(
        error => {alert('error fetching movie')});
    }


    // Performs search based on event e
    SearchForTitle(e) {
      // prevents page from entirely refreshing
      e.preventDefault();

      // trim removes all leading and trailling spaces
      const title = e.target.elements.title.value.trim();

      // Pass title searched for up to be saved
      this.props.setCurrentSearch(title);

      // Check that title isn't blank
      if (title) {

        // Allso pass up to reset overall page state to 1 
        this.props.resetPage();

        // console.log(`Called Search for Title ${title} and year ${this.props.year} and type `);
        let getCall = `http://www.omdbapi.com/?s=${title}&apikey=${apiKey}`;
        if (this.props.year !== '') {
            getCall = getCall + '&y=' + this.props.year;
        }
        if (this.props.type !== 'any') {
            getCall = getCall + '&type=' + this.props.type;
        }
        fetch(getCall).then(
        value => value.json()).then(formattedValue => {
            // console.log(formattedValue);
            this.props.handleSearch(formattedValue);
        }).catch(
          error => {alert('error fetching movie')});
      }
    }
  
    render() {
      return (
        <div>
        {
          /* This re pulls from the api for different pages */
          this.props.page !== this.state.currentPage &&
          this.SearchNewPage()

        }
          <form  onSubmit={this.SearchForTitle}>
            <input type="text" name="title"/>
            <button>SEARCH</button>
          </form>     
        </div>
      );
    }
  }

  // Class to handle and display all of the Search results utilizing the MovieCard class
  const SearchResults = (props) => {
      return (
          <div>
            {
            props.validSearch && props.hits > 10 && 
            <h1>Showing Results { ((props.page - 1) * 10) + 1} - {((props.page - 1) * 10) + props.searchResults.length} out of {props.hits} total matches.</h1>
            }
            { 
                props.validSearch && 
                <div className="ValidResults">
                { 
                    // console.log(props.searchResults)
                    // ONLY DISPLAYS UP TO 10 MOVIES!!
                    props.searchResults.map(result => <div className="DisplayedMovies" key={result.imdbID}>
                            <MovieCard title={result.Title} poster={result.Poster} imdbID={result.imdbID}/>
                            <button className="AddToListButton" onClick={() => {
                              let username = localStorage.getItem('username');
                              console.log(username);


                              AddToList(localStorage.getItem('username'), result.Title, result.Poster, result.imdbID);
                            }
                            }>Add to My List +</button>
                        </div>)
                }
                </div> 
            }
            {
                props.validSearch && props.hits > 10 && 
                <div>
                <Fab color="secondary" aria-label="add" onClick={props.clickLeft}>
                <ArrowCircleLeftIcon />
                </Fab>
                <strong className="CurrentPageText"> Current Page: {props.page}  </strong>
                <Fab color="secondary" aria-label="add" onClick={props.clickRight}>
                <ArrowCircleRightIcon />
                </Fab>
                </div>
            }
            {
                // props.options.map((option) => <Option key={option} optionText={option} handleDeleteOption={props.handleDeleteOption}/>)
                // props.searchResults.map(result => <p>{result}</p>);
            }
            {!props.validSearch && <div className="invalidResults">
                <p>Try Searching for a Move, TV Show, or Video Game</p>
            </div> }
          </div>
      );
  }

  // The list of set types for the Filter, namely movie, series, episode
  const types = [
      {
        value: 'Movie'
      },
      {
        value: 'Series'
      },
      {
        value: 'Episode'
      },
      {
        value: 'Any'
      }
  ];

  // A stateless functional component to open the filter accordian and allow
  // users to attach filters to their search
  const FilterBox = (props) => {
      return (
        <div className="FilterAccordian">    
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <h2>Filter</h2>
                </AccordionSummary>
                <AccordionDetails>
                    
                    <form></form>
                    <TextField
                        className="FilterButtons"
                        id="filled-number"
                        label="Year"
                        type="number"
                        InputLabelProps={{ shrink: true, }} 
                        onChange={(e) => props.setYear(e.target.value)}
                        variant="filled"
                    />
                    <TextField
                        className="FilterButtons"
                        id="filled-select-currency"
                        select
                        label="Format"
                        onChange={(e) => props.setType(e.target.value)}
                        variant="filled"
                        defaultValue={'Any'}
                        >
                        {types.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.value}
                            </MenuItem>
                        ))}
                    </TextField>

                    
                </AccordionDetails>
            </Accordion>
          </div>
        );
  }

  /* 
  
  */


  export { SearchPage };