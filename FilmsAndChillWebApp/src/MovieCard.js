import React from 'react'
import Modal from "./Modal";
import {useState} from "react";

// Each  movie shown on the website will be made this way, they 
const MovieCard = (props) => {
    // props for imdbid, title, and poster
    // props.title
    // props.poster
    // props.imdbid
        const [openModal,setOpenModal] = useState(false);
        return (
            <div className="MovieCardImage">
                {console.log(props)}
                {props.title && <p>{props.title}</p>}
                {props.poster && 
                <button className="openModalBtn" onClick={() =>{
                    setOpenModal(true);}}> 
                    <img src={`${props.poster}`} />
                </button> }
                    {openModal && <Modal title={props.title} imdbid={props.imdbid} closeModal={setOpenModal}/>}
            </div>
        );
    }


export { MovieCard }