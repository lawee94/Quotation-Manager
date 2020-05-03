import React, { Component } from 'react';
import './App.css';
import Index from './container/Index'
import Quota from './container/Quota';
import Quotation from './container/Quotation';
import MatList from './container/MatList';
import Home from './container/Home';
import QuotaList from './container/QuotaList';
import Logout from './container/Logout';
import { Switch, Route } from 'react-router-dom'
import Layout from './hoc/Layout/Layout';
import { connect } from 'react-redux';
import ProtectedRoute from "./component/ProtectedRoute";

class App extends Component {

	render() {

		return (
			<div>
				<Switch>
					<Route path='/' exact component={Index} />
					<Layout>
						<ProtectedRoute path='/quotation' exact component={Quotation} 
							isAuthenticated={this.props.isAuthenticated} isVerifying={this.props.isVerifying} />
						<ProtectedRoute path='/quota' exact component={Quota} 
							isAuthenticated={this.props.isAuthenticated} isVerifying={this.props.isVerifying} />
						<ProtectedRoute path='/matlist' exact component={MatList} 
							isAuthenticated={this.props.isAuthenticated} isVerifying={this.props.isVerifying} />
						<ProtectedRoute path='/home' exact component={Home} 
							isAuthenticated={this.props.isAuthenticated} isVerifying={this.props.isVerifying} />
						<ProtectedRoute path='/quotalist' exact component={QuotaList} 
							isAuthenticated={this.props.isAuthenticated} isVerifying={this.props.isVerifying} />
						<Route path='/logout' exact component={Logout} />
					</Layout>
				</Switch>
			</div>
		)
	}
}
const mapStateToProps = state => {
	return {
	  isAuthenticated: state.auth.isAuthenticated,
	  isVerifying: state.auth.isVerifying
	};
  }

  export default connect(mapStateToProps)(App);
