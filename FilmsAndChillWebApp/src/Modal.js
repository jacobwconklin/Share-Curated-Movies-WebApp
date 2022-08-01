import React from "react";
import {useState} from "react";
import "./Modal.css";
import { callSpecificApi } from "./api";


class Modal extends React.Component {

    constructor(props) {
        super(props)
        this.getInfo = this.getInfo.bind(this);
        callSpecificApi(props.title, props.imdbid, this.getInfo);
        //const info = {rating: 'yes', Actors: 'jlo'}; // Need t get request for more information. 
        
        this.state = {
            info: this.getInfo
        }
    }

    getInfo (info) {
        this.setState(() => ({ info }))
        console.log(info);
        return info
    }


    getMoreInformation() {

    }

    render () {
        return(
            <div className="modalBackground">
                <div className="modalContainer">
    
                    
                <div className = "xButton">
                    <button onClick={() =>{this.props.closeModal(false);}}>  X</button>
                 </div>
    
                <div className ="Title">
               
                    <h1> {this.props.title} </h1>
                </div>
                <div className ="Body">
                <p>Rating: {this.state.info.imdbRating}</p>
                <p> Actors: {this.state.info.Actors}</p>
                <p> Plot: {this.state.info.Plot}</p>
                <p>Genre: {this.state.info.Genre}</p>
                <p>Awards: {this.state.info.Awards}</p>
                <p>Writers: {this.state.info.Writer}</p>
                <p>Length: {this.state.info.Runtime}</p>
               
    
                </div>
                <div className ="Footer">
                    <a href = {"https://www.amazon.com/s?k=" + this.props.title.replaceAll(" ", "+") + "&i=instant-video"}> Watch Now  </a> 
                </div>
                </div>
    
            
            </div>
        );
    }
    
}
export default Modal;


