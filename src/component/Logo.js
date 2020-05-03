import React from 'react';
import { Link } from 'react-router-dom'


const logo = (props) => (
        <div  >
            <Link to='/'><h1>A</h1></Link>
            <div >
                <h3 style={{display: 'inline-block'}}>{props.compName}</h3>
            </div>
        </div>
        
);

export default logo;