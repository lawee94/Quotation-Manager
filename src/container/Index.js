import React, { Component } from 'react';
import Toolbar from '../component/Toolbar/Toolbar';
import Input from '../component/UI/Input';
import Spinner from '../component/UI/Spinner';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { Redirect } from 'react-router-dom';

import * as func from '../store/func';

class Index extends Component {

    state = {
        inputElement: {
            username: func.Input('input', 'text', 'Username', { required: true, minLength: 6, maxLength: 30, }),
            password: func.Input('input', 'password', '********', { required: true, minLength: 6, maxLength: 20, })
        },
        loading: false,
        error: null,
        authUser: null
    }

    inputHandler = (event, id, myState) => {
        const updatedState = func.inputHandler(event, id, myState)
        this.setState({ inputElement: updatedState})
    }

    submitHandler = ( event ) => {
        event.preventDefault();
        this.props.onAuth( this.state.inputElement.username.value, this.state.inputElement.password.value );
    }

    render(){

        let box = ( <form onSubmit={this.submitHandler} >
            {func.getArrayFromState(this.state.inputElement).map( formElement => {
                return <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType}  
                    elementConfig={formElement.config.elementConfig}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    display='block' 
                    changed={(event) => this.inputHandler(event, formElement.id, this.state.inputElement)}/> 
                })}
                <button className="btn btn-white m-3">Submit</button>
        </form> )

        if (this.props.loading) {
            box = <Spinner />
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (
                <div className="error">
                    <p>{this.props.error.message}</p>
                </div>
            );
        }
        let checkAuth;

        if(this.props.isAuthenticated){
            checkAuth = <Redirect to={this.props.authRedirectPath} />
        }
        
        return(
            <div className="home">
                {checkAuth}
                <Toolbar />
                <div className="pt-5">
                    <h2 className=" align-text-center mt-5">Quotation Manager</h2>
                </div>
                <div className="container-fluid">
                    <div className="row text-center mt-5" style={{display: 'inline-block'}}>
                        <div className="contentBox" style={{borderColor: 'white', marginTop: '20px'}}>
                            {errorMessage}
                            {box}
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = state => {
	return {
	  isAuthenticated: state.auth.isAuthenticated,
      isVerifying: state.auth.isVerifying,
      loading: state.auth.loading,
      error: state.auth.error,
      isLoggingIn: state.auth.isLoggingIn,
      authRedirectPath: state.auth.authRedirectPath
	};
  }

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch( actions.loginUser( email, password) )
    };
};

  export default connect(mapStateToProps, mapDispatchToProps)(Index);



 
