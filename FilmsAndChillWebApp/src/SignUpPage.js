import React, { useEffect } from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router";


// To make life easy, why not have the login and sign up page be the same page?
class SignUpPage extends React.Component {
    constructor(props) {
        super(props)
        this.onLogIn = this.onLogIn.bind(this);
        this.onSignUp = this.onSignUp.bind(this);
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.state = {
            username: 'dummy',
            password: '123pass',
            doNavigate: false
        }
    }

    onLogIn() {
        // Check that username and password match existing ones
        // Save fact that user is logged in somewhere
        // Something something fetch(https:// other server to ask Mongo )
        fetch('http://localhost:4000/login/' + this.state.username + '/' + this.state.password, 
            {params: {username: this.state.username, password: this.state.password}})
        .then(response => {
            
            // console.log(response)
            // if login is successful
            if ( response.status === 200 ) {
                localStorage.setItem('username', this.state.username);
                // Navigate to home
                this.setState(() => ({ doNavigate: true}));
            }
            // Else if login is invalid
            else {
                alert('Login failed, please check username and password are correct');
            }
        
        }).catch(error => {alert(error)});

        // if valid login, put username into local storage and navigate to Home page
    }

    onSignUp() {
        // Check that username is not already taken
        // save fact that user is logged in somewhere
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.state.username, password: this.state.password })
        };
        fetch('http://localhost:4000/signup', requestOptions).then( response => {
            console.log(response);
            // console.log(response.ok);
            // console.log(response.statusText);
            // if valid SignUp, put username into local storage and navigate to Home page
            if (response.status === 200) {
                // console.log('valid signup detected');
                localStorage.setItem('username', this.state.username);
                // Navigate to correct route
                this.setState(() => ({ doNavigate: true}));
            }
            else {
                alert('Username already taken');
            }
            
        }).catch(error => {alert(error)});
        
    }

    // Setters to change the state variables based on texts supplied in the forms
    setUsername(username) {
        this.setState(() => ({ username }));
    }

    setPassword(password) {
        this.setState(() => ({ password }));
    }

    render() {
        return ( 
        <div>
            <div className ="SignUpBackground">
            </div>
            <div className="SignUpPage">
                <h1> Log in or Sign up for free! </h1>
                <br className="Breaks"></br>
                <TextField className="UsernameBox" label="Username" variant="filled" onChange={(e) => this.setUsername(e.target.value)} />
                <br className="Breaks"></br>
                <TextField className="PasswordBox" label="Password" variant="filled" onChange={(e) => this.setPassword(e.target.value)}/>
                <br className="Breaks"></br>
                <div>
                  <button className="SignUpButtons" onClick={this.onLogIn}>Log In</button>
                  <button className="SignUpButtons" onClick={this.onSignUp}>Sign Up</button>
                </div>
            </div>
            {
                // Run Navigator function when doNavigate is true
                this.state.doNavigate && <Navigator />
            }
        </div>
        );
        
    }
}
const Navigator = () => {

    let navigate = useNavigate();
    useEffect(() => {
        console.log('in component did mount');
        navigate("/home");
    });

    return (
        <div>
        </div>
    );
}

export { SignUpPage };