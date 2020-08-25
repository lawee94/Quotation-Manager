import React, { Component } from "react";
import Input from "../component/UI/Input";
import Button from "../component/UI/Button";
import Modal from "../component/UI/Modal";
import Spinner from "../component/UI/Spinner";
import { setAuthRedirectPath } from "../store/actions/auth";
import * as func from "../store/func";
import Firebase from "../firebase/Firebase";
import { connect } from "react-redux";

class MatList extends Component {
  _isMounted = false;

  state = {
    inputElement: {
      name: func.Input("input", "text", "Name", {
        required: true,
        minLength: 3,
      }),
      price: func.Input("input", "text", "Unit Price", {
        required: true,
        minLength: 2,
        maxLength: 10,
        isNumeric: true,
      }),
    },
    updateElement: {
      name: func.Input("input", "text", "Name", {
        required: true,
        minLength: 3,
      }),
      price: func.Input("input", "text", "Unit Price", {
        required: true,
        minLength: 2,
        maxLength: 10,
        isNumeric: true,
      }),
    },
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
    materials: [],
    edit: false,
    loading: false,
    matLoading: false,
    error: null,
    key: null,
  };

  componentDidMount() {
    this._isMounted = true;
    this.loadMaterial("/materials/houseWiring/");
    this.props.onSetAuthRedirectPath("/matlist");
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  loadMaterial = (url) => {
    this.setState({ matLoading: true, error: null });
    let query = Firebase.database().ref(url);
    query.once("value", (snapshot) => {
      let mat = [];
      snapshot.forEach((val) => {
        mat.push({ key: val.key, value: val.val() });
      });
      this.setState({ materials: mat });
      this.setState({ matLoading: false, error: null });
    });
  };

  updateMaterial = () => {
    let isValid = this.validation(this.state.updateElement, "updateElement");
    if (isValid) {
      let url =
        this.state.choiceElement.choice.value === "computer"
          ? "/materials/computer"
          : "/materials/houseWiring";
      Firebase.database().ref(url).child(this.state.key).update({
        name: this.state.updateElement.name.value,
        price: this.state.updateElement.price.value,
      });
      let index = this.state.materials.findIndex(
        (res) => res.key === this.state.key
      );
      this.setState((state) => {
        state.materials[index] = {
          key: this.state.key,
          value: {
            name: this.state.updateElement.name.value,
            price: this.state.updateElement.price.value,
          },
        };
        return state;
      });
      this.modalCancelHandler();
    }
  };

  deleteMaterial = () => {
    let url =
      this.state.choiceElement.choice.value === "computer"
        ? "/materials/computer"
        : "/materials/houseWiring";
    Firebase.database().ref(url).child(this.state.key).remove();
    let updatedState = this.state.materials.filter(
      (res) => res.key !== this.state.key
    );
    this.setState({ materials: updatedState });
    this.modalCancelHandler();
  };

  addMat = (myState, types, choice) => {
    const clickMat = func
      .getArrayFromState(myState)
      .map((formElement, index) => {
        return (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            options={formElement.config.options}
            elementConfig={formElement.config.elementConfig}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            value={formElement.config.value}
            display="inline-block"
            changed={(event) =>
              this.inputHandler(event, formElement.id, myState, types, choice)
            }
          />
        );
      });
    return clickMat;
  };

  inputHandler = (event, id, myState, types, choice) => {
    const updatedState = func.inputHandler(event, id, myState);
    if (choice) {
      updatedState[id].value === "computer"
        ? this.loadMaterial("/materials/computer")
        : this.loadMaterial("/materials/houseWiring");
    } else {
      this.setState({ types: updatedState });
    }
  };

  validation = (myState, types) => {
    let isValid = true;
    const updatedInput = { ...myState };
    func.getArrayFromState(updatedInput).map((val) => {
      val.config.valid = func.checkValidity(
        val.config.value,
        val.config.validation
      );
      val.config.touched = true;
      updatedInput[val.id] = val.config;
      if (!func.checkValidity(val.config.value, val.config.validation))
        isValid = false;
      return "";
    });
    this.setState({ types: updatedInput });
    return isValid;
  };

  addMaterial = () => {
    let url =
      this.state.choiceElement.choice.value === "computer"
        ? "/materials/computer"
        : "/materials/houseWiring";
    let itemRef = Firebase.database().ref(url);
    let values = {
      name: this.state.inputElement.name.value,
      price: this.state.inputElement.price.value,
    };
    let newItem = itemRef.push(values).key;
    let updatedState = { key: newItem, value: values };
    let newState = [...this.state.materials];
    newState.push(updatedState);
    let newElement = {
      name: func.Input("input", "text", "Name", {
        required: true,
        minLength: 3,
      }),
      price: func.Input("input", "text", "Unit Price", {
        required: true,
        minLength: 2,
        maxLength: 10,
        isNumeric: true,
      }),
    };
    this.setState({ materials: newState, inputElement: newElement });
  };

  addMaterialHandler = (myState, types) => {
    let isValid = this.validation(this.state.inputElement, "inputElement");
    if (isValid === true) {
      this.addMaterial();
    }
  };

  modalCancelHandler = () => {
    this.setState({ edit: false });
  };

  showModalHandler = (list, key) => {
    let updated = null;
    func
      .getArrayFromState(this.state.updateElement)
      .map((formElement, index) => {
        updated = func.inputHandler(
          "",
          formElement.id,
          this.state.updateElement,
          list[index]
        );
        return "";
      });
    this.setState({ updateElement: updated, edit: true, key: key });
  };

  render() {
    let lists = this.state.materials.map((list, index) => {
      return (
        <tr
          style={{ cursor: "pointer" }}
          key={index}
          onClick={() =>
            this.showModalHandler([list.value.name, list.value.price], list.key)
          }
        >
          <td>{index + 1}</td>
          <td>{list.value.name}</td>
          <td>{list.value.price}</td>
        </tr>
      );
    });

    let content = (
      <div>
        <div className="col-lg-12 mt-4">
          <h4 className="text-left">Material List</h4>
          <div style={{ float: "right" }} className="Inp">
            {this.addMat(this.state.choiceElement, "choiceElement", true)}
            {this.addMat(this.state.inputElement, "inputElement")}
            <div className="mybtn">
              <button
                onClick={this.addMaterialHandler}
                className="btn btn-green"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="container-fliud">
          <table className="table table-hover table-striped">
            <thead>
              <tr className="bg-blue text-white">
                <th>S/N</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>{lists}</tbody>
            <tfoot className="bg-blue">
              <tr>
                <td colSpan="3">" "</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );

    let update = this.addMat(this.state.updateElement, "updateElement");

    if (this.state.matLoading) {
      content = <Spinner />;
    }

    return (
      <div className="container-fliud">
        <Modal show={this.state.edit} modalClosed={this.modalCancelHandler}>
          {update}
          <div>
            <Button clicked={this.modalCancelHandler}>Cancel</Button>
            <Button clicked={this.updateMaterial}>Update</Button>
            <button className="btn btn-danger" onClick={this.deleteMaterial}>
              Delete
            </button>
          </div>
        </Modal>
        <div>{content}</div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onSetAuthRedirectPath: (path) => dispatch(setAuthRedirectPath(path)),
  };
};

export default connect(null, mapDispatchToProps)(MatList);
