import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link, useParams, Redirect } from "react-router-dom";
import { SearchPage } from './SearchPage';
import { HomePage } from './HomePage';
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
//State variable that will allow rerendering of page when value changes
import {useState} from "react";
import { MyListPage } from './MyListPage';
import { SignUpPage } from './SignUpPage';
import {SearchOtherUsers} from './SearchOtherUsers';




// 35977a70 API Key
// URL to request
// Example requests:
// Request: GET http://www.omdbapi.com/?t=stranger things&apikey=<yourApiKey>
// Request: GET http://www.omdbapi.com/?s=stranger things&apikey=<yourApiKey>

export default function App() {

  return (
    
   <Router>
    <main>  
      <nav>
      </nav>
    <Routes>
      <Route path="/" element={<SignUpPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} exact />
      <Route path="/mylist" element={<MyListPage />} exact />
      <Route path="/searchUser" element={<SearchOtherUsers />} exact />
      <Route path="*" element={<SignUpPage />} />
      { /* Example of routing and sending parameter from internet: <Route path="/about/:name" component={About} /> */ }
    </Routes>
    <div padding="20px">
      </div>
    </main>
</Router>
     
  );
}

// Header to be carried across all pages, and serve to switch routes


/*
  Using local storage notes:
  const json = localStorage.getItem('options');
            const options = JSON.parse(json); 
  
  // Convert options array to JSON to store in local storage
            const json = JSON.stringify(this.state.options);
            localStorage.setItem('options', json);
*/
