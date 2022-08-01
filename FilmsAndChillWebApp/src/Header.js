import { BrowserRouter as Router, Route, Routes, Link, useParams, Redirect } from "react-router-dom";
import film from './FilmChill1.png' // relative path to image;

const Header = () => {
    

    return (
      <div className="HeaderBar">
        <img className="logo" src= {film} ></img>
        <Link to="/home" className="RouterLink">Home</Link>
        <Link to="/search" className="RouterLink">Find a Movie</Link>
        <Link to="/mylist" className="RouterLink">My List</Link>
        <Link to="/searchUser" className="RouterLink">Find a Friend's List</Link>
        <Link to="/" className="SignOutButton" onClick={() => {
          console.log('signing off');
          localStorage.setItem('username', 'invalid'); 
          /* Remove fact that user is logged in and maybe hide Header bar*/}}>sign out</Link>
      </div>
    );
  }

  export { Header };