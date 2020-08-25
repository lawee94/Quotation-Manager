import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { register } from "../store/actions/auth";
import Spinner from "../component/UI/Spinner";
import * as func from "../store/helper";

export class Register extends Component {
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
      password2: {
        ...func.elemConfig("input", "password", "confirm password", {
          required: true,
          minLength: 6,
        }),
      },
    },
    icon: [
      <FontAwesomeIcon icon={faAt} />,
      <FontAwesomeIcon icon={faLock} />,
      <FontAwesomeIcon icon={faLock} />,
    ],
    errorMsg: "",
  };

  onChange = (event, id) => {
    const updatedState = func.inputHandler(event, id, this.state.elements);
    this.setState({ elements: updatedState });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const elem = this.state.elements;
    if (elem.password.value !== elem.password2.value) {
      this.setState({ errorMsg: "Password Mismatch" });
    } else {
      let formStatus = func.validity(this.state.elements);
      formStatus.isvalid
        ? this.props.onRegister(elem.email.value, elem.password.value)
        : this.setState({ elements: formStatus.inp });
    }
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

    if (this.props.loading) form = <Spinner />;
    let checkAuth;
    if (this.props.isAuthenticated) {
      checkAuth = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <>
        {checkAuth}
        <div className="text-center py-5 home">
          <h3>
            <strong>Create your account</strong>
          </h3>
          <div className="w-250">
            <p className="error">{this.state.errorMsg}</p>
            <form onSubmit={(event) => this.onSubmit(event)}>
              {form}
              <button className="btn btn-primary w-100 mt-2">
                Create Account
              </button>
            </form>
          </div>
          <div className="text-center my-2 px-3">
            <span>Already have an account? </span>
            <Link to="/login">Sign In</Link>
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
    onRegister: (email, password) => dispatch(register(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
