import React from 'react';
import { NavLink } from 'react-router-dom'

const navigationItem = ( props ) => (
    <li className="nav-link p-0" >
        <NavLink 
            onClick={props.clicked}
            to={props.link}  
            exact={props.exact}
            activeClassName="active">{props.children}
        </NavLink>
    </li>
);

export default navigationItem;