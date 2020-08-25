import React, { Component } from "react";
import "./App.css";
import Index from "./container/Index";
import Login from "./container/Login";
import Register from "./container/Register";
import Quota from "./container/Quota";
import Quotation from "./container/Quotation";
import MatList from "./container/MatList";
import Home from "./container/Home";
import QuotaList from "./container/QuotaList";
import Logout from "./container/Logout";
import Error from "./container/Error";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./hoc/Layout";
import { connect } from "react-redux";
import ProtectedRoute from "./component/ProtectedRoute";

class App extends Component {
  render() {
    let checkAuth;
    if (this.props.isAuthenticated) {
      checkAuth = <Redirect to="{this.props.authRedirectPath}" />;
    }
    return (
      <div>
        {checkAuth}
        <Switch>
          <Route path="/" exact component={Index} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/error" exact component={Error} />
          <Redirect to="/error" />
          <Layout>
            <ProtectedRoute
              path="/quotation"
              exact
              component={Quotation}
              isAuthenticated={this.props.isAuthenticated}
              isVerifying={this.props.isVerifying}
            />
            <ProtectedRoute
              path="/quota"
              exact
              component={Quota}
              isAuthenticated={this.props.isAuthenticated}
              isVerifying={this.props.isVerifying}
            />
            <ProtectedRoute
              path="/matlist"
              exact
              component={MatList}
              isAuthenticated={this.props.isAuthenticated}
              isVerifying={this.props.isVerifying}
            />
            <ProtectedRoute
              path="/home"
              exact
              component={Home}
              isAuthenticated={this.props.isAuthenticated}
              isVerifying={this.props.isVerifying}
            />
            <ProtectedRoute
              path="/quotalist"
              exact
              component={QuotaList}
              isAuthenticated={this.props.isAuthenticated}
              isVerifying={this.props.isVerifying}
            />
            <Route path="/logout" exact component={Logout} />
          </Layout>
        </Switch>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
};

export default connect(mapStateToProps)(App);
