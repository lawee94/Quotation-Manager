import React from 'react';
import { NavLink } from 'react-router-dom'

const toolbar = ( props ) => (
    <nav className="navbar navbar-expand-lg navbar-dark  p-0" style={{backgroundColor: props.bg}}>
        <NavLink  className="navbar-brand border px-3 my-1 mx-4 text-white " to="/"><h3 className="m-0">A</h3></NavLink>
        <button className="navbar-toggler collapsed mr-3" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon" ></span>
        </button>
            {props.children}
    </nav>
);

export default toolbar;