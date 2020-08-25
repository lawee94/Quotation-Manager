import React, { Component } from "react";
import Modal from "../component/UI/Modal";
import Firebase from "../firebase/Firebase";
import { setAuthRedirectPath } from "../store/actions/auth";
import { connect } from "react-redux";

class QuotaList extends Component {
  _isMounted = false;

  state = {
    quotation: [],
    edit: false,
    loading: false,
    error: null,
    key: null,
  };

  componentDidMount() {
    this._isMounted = true;
    this.loadMaterial();
    this.props.onSetAuthRedirectPath("/quotalist");
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadMaterial = () => {
    this.setState({ loading: true, error: null });
    let query = Firebase.database().ref("/savedQuotation");
    query.once("value", (snapshot) => {
      let mat = [];
      snapshot.forEach((val) => {
        mat.push({ key: val.key, value: val.val() });
      });
      this.setState({ quotation: mat });
      this.setState({ loading: false, error: null });
    });
  };

  deleteMaterial = () => {
    Firebase.database().ref("/savedQuotation").child(this.state.key).remove();
    let updatedState = this.state.quotation.filter(
      (res) => res.key !== this.state.key
    );
    this.setState({ quotation: updatedState });
    this.modalCancelHandler();
  };

  addMaterialHandler = () => this.props.history.push("/home");

  modalCancelHandler = () => this.setState({ edit: false });

  showModalHandler = (list) => this.setState({ edit: true, key: list.key });

  updateKey = (list) => this.setState({ key: list.key });

  viewQuotation = (list) => {
    localStorage.setItem("key", list.key);
    this.setState({ key: list.key });
    let index = this.state.quotation.findIndex(
      (res) => res.key === localStorage.getItem("key")
    );
    let selMat = this.state.quotation[index].value;
    let clientDetail = JSON.stringify({
      name: selMat.clientName,
      compName: selMat.companyName,
      address: selMat.clientAddress,
      date: selMat.expired,
    });
    localStorage.setItem("material", JSON.stringify(selMat.material));
    localStorage.setItem("client", clientDetail);
    localStorage.setItem("choice", selMat.quotationType);
    this.props.history.push("/quota");
  };

  render() {
    let lists = this.state.quotation.map((list, index) => {
      return (
        <tr style={{ cursor: "pointer" }} key={index}>
          <td>{index + 1}</td>
          <td onClick={() => this.viewQuotation(list)}>
            {list.value.quotationName}
          </td>
          <td>{list.value.quotationType}</td>
          <td>{list.value.created}</td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => this.showModalHandler(list)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

    let content = (
      <div>
        <div className="col-lg-12 mt-4">
          <h4 className="text-left">Quotation List</h4>
          <div style={{ float: "right" }}>
            {this.state.loading ? (
              <h3 style={{ display: "inline-block" }}>Loading....</h3>
            ) : (
              " "
            )}
            <button onClick={this.addMaterialHandler} className="btn btn-green">
              Create New Quotation
            </button>
          </div>
        </div>
        <div className="container-fliud">
          <table className="table table-hover table-striped">
            <thead className="bg-blue text-white">
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Type</th>
                <th>Date Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{lists}</tbody>
            <tfoot className="bg-blue">
              <tr>
                <td />
                <td />
                <td>''</td>
                <td />
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );

    return (
      <div className="container-fluid">
        <Modal show={this.state.edit} modalClosed={this.modalCancelHandler}>
          <span className="mb-3">Confirm Delete</span>
          <div>
            <button
              onClick={this.modalCancelHandler}
              className="btn btn-green mr-3"
            >
              Cancel
            </button>
            <button onClick={this.deleteMaterial} className="btn btn-green">
              Cancel
            </button>
          </div>
        </Modal>
        <div className=" ">{content}</div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetAuthRedirectPath: (path) => dispatch(setAuthRedirectPath(path)),
  };
};

export default connect(null, mapDispatchToProps)(QuotaList);
