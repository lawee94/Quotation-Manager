import React, { Component } from "react";
import Input from "../component/UI/Input";
import * as func from "../store/func";
import { setAuthRedirectPath } from "../store/actions/auth";
import { connect } from "react-redux";

class Home extends Component {
  _isMounted = false;

  state = {
    choiceElement: {
      choice: {
        elementType: "select",
        options: [
          { value: "house wiring", displayValue: "House Wiring" },
          { value: "computer", displayValue: "Computer" },
        ],
        value: "",
      },
    },
    authUser: null,
  };

  componentDidMount() {
    this._isMounted = true;
    const updatedState = func.inputHandler(
      "",
      "choice",
      this.state.choiceElement,
      "house wiring"
    );
    this.setState({ choiceElement: updatedState });
    this.props.onSetAuthRedirectPath("/home");
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  inputHandler = (event) => {
    const updatedState = func.inputHandler(
      event,
      "choice",
      this.state.choiceElement
    );
    this.setState({ choiceElement: updatedState });
  };

  submitHandler = () => {
    let choice = this.state.choiceElement.choice.value;
    if (choice !== "")
      localStorage.setItem("choice", this.state.choiceElement.choice.value);
    this.props.history.push("/quota");
  };

  render() {
    let choice = this.state.choiceElement.choice;
    const cont = (
      <div className="Inp mt-4">
        <Input
          elementType={choice.elementType}
          options={choice.options}
          elementConfig={choice.elementConfig}
          invalid={!choice.valid}
          shouldValidate={choice.validation}
          touched={choice.touched}
          value={choice.value}
          changed={(event) => this.inputHandler(event)}
        />
        <div className="mt-3">
          <button className="btn btn-green" onClick={this.submitHandler}>
            Submit
          </button>
        </div>
      </div>
    );

    return (
      <div className="mt-5 w-300">
        <h3>
          <strong> Quotation Type</strong>
        </h3>
        {cont}
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onSetAuthRedirectPath: (path) => dispatch(setAuthRedirectPath(path)),
  };
};

export default connect(null, mapDispatchToProps)(Home);
