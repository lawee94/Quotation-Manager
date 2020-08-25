import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../component/UI/Spinner";
import * as func from "../store/helper";
import { loginUser, loginWithGoogle } from "../store/actions/auth";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faLock } from "@fortawesome/free-solid-svg-icons";

export class Login extends Component {
  static propTypes = {
    register: PropTypes.func,
  };

  state = {
    elements: {
      email: {
        ...func.elemConfig("input", "email", "Email", {
          required: true,
          isEmail: true,
          maxLength: 30,
        }),
      },
      password: {
        ...func.elemConfig("input", "password", "***********", {
          required: true,
          minLength: 6,
          maxLength: 20,
        }),
      },
    },
    icon: [<FontAwesomeIcon icon={faAt} />, <FontAwesomeIcon icon={faLock} />],
  };

  onChange = (event, id) => {
    const updatedState = func.inputHandler(event, id, this.state.elements);
    this.setState({ elements: updatedState });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const elem = this.state.elements;
    let formStatus = func.validity(this.state.elements);
    formStatus.isvalid
      ? this.props.onLogin(elem.email.value, elem.password.value)
      : this.setState({ elements: formStatus.inp });
  };

  render() {
    let form = func
      .getArrayFromState(this.state.elements)
      .map((formElement, index) => {
        return (
          <div key={index} className="input-container">
            {this.state.icon[index]}
            {func.formElement(formElement, (event) =>
              this.onChange(event, formElement.id)
            )}
          </div>
        );
      });
    let error = null;
    if (this.props.loading) form = <Spinner />;
    if (this.props.error) {
      error = (
        <div className="error">
          <p>{this.props.error.message}</p>
        </div>
      );
    }
    let checkAuth;
    if (this.props.isAuthenticated) {
      checkAuth = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <>
        {checkAuth}
        <div className="home py-5">
          <div className="flex w-300 mb-3">
            <img height="30" src="/images/Logo.jpg" className="mr-2" alt="" />
            <h3 className="inlineBlock">
              <strong>FESTAC TECHNOLOGY</strong>
            </h3>
          </div>

          <div className="w-250">
            {error}
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={this.props.onLoginWithGoogle}
            >
              <img
                width="15"
                className="mr-2"
                src="/images/google.svg"
                alt="login with google"
              />
              Continue with Google
            </button>
            <span className="linetext">OR</span>

            <form onSubmit={(event) => this.onSubmit(event)}>
              {form}
              <button className="btn btn-primary w-100 my-2">
                Login to Continue -->
              </button>
            </form>

            <span className="subtitle ">
              <Link to="/auth/password-reset" target="_blank">
                Forgot password?
              </Link>
            </span>
          </div>

          <div className="text-center my-2 px-3">
            <span>Need to get started? </span>
            <Link to="/register">Create a new account</Link>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.isAuthenticated,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (email, password) => dispatch(loginUser(email, password)),
    onLoginWithGoogle: () => dispatch(loginWithGoogle()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
