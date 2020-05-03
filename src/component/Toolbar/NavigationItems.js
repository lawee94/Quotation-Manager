import React, { Component } from 'react';
import NavigationItem from './NavigationItem';
import { connect } from 'react-redux';

class NavigationItems extends Component {

    reset = () => {
        localStorage.removeItem('client')
        localStorage.removeItem('choice')
        localStorage.removeItem('material')
        localStorage.removeItem('key')
    }

    render(){
        let logout = this.props.isAuthenticated ? 
                <NavigationItem clicked={this.reset} link="/logout">Logout</NavigationItem> : <div />

        return (
            <div className="collapse navbar-collapse p-0 m-0" id="collapsibleNavbar">
                <ul className="navbar-nav mx-auto text-right p-0">
                    <NavigationItem clicked={this.reset} link="/home" exact>New Quota</NavigationItem>
                    <NavigationItem link="/matlist">Materials</NavigationItem>
                    <NavigationItem link="/quotalist">Quotation</NavigationItem>
                    
                </ul>
                <div className="navbar-nav text-right pr-3">
                    {logout}
                </div>
            </div>
        )
    }
}
 
const mapStateToProps = state => {
	return {
	  isAuthenticated: state.auth.isAuthenticated,
	};
  }

  export default connect(mapStateToProps)(NavigationItems);
