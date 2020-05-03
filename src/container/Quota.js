import React, { Component } from 'react';
import Input from '../component/UI/Input';
import Button from '../component/UI/Button'
import * as func from '../store/func';
import { setAuthRedirectPath } from '../store/actions/auth';
import { connect } from 'react-redux';
import Firebase from '../firebase/Firebase'

class Quota extends Component {

    _isMounted = false

    state = {
        first:{
            name: func.Input('select', '', '', {}, this.props.hw),
            unit : func.Input('select', '', '', {}, Array(100).fill().map( (x,i) => ({value: i, displayValue: i} )))
        },
        second: {
            name: func.Input('input', 'text', 'Name', { required: true, minLength: 3 }),
            price: func.Input('input', 'text', 'Unit Price', { required: true, minLength: 2, maxLength: 10, isNumeric: true }),
            unit : func.Input('select', '', '', {}, Array(100).fill().map( (x,i) => ({value: i, displayValue: i} )))
        },
        client: {
            name: func.Input('input', 'text', 'Client Name', { required: true, minLength: 3 }),
            compName: func.Input('input', 'text', 'Company Name', { required: true, minLength: 3 }),
            address: func.Input('input', 'text', 'Address', { required: true, minLength: 7 }),
            date: func.Input('input', 'date', 'Expired', { required: true }),
        },
        isError: true,
        authUser: null,
        loading: false
    }

    componentDidMount(){
       this._isMounted = true
        const url = localStorage.getItem('choice') === 'computer' ? '/materials/computer' : '/materials/houseWiring'  
        this.loadMaterial(url)
        this.hydrateStateFromLocalstorage()
        window.addEventListener(
            'beforeunload',
            this.saveStateToLocalstorage.bind(this)
        )
        this.props.onSetAuthRedirectPath('/quota')
    }

    componentWillUnmount(){
        this._isMounted = false
        window.addEventListener(
            'beforeunload',
            this.saveStateToLocalstorage.bind(this)
        )
        this.saveStateToLocalstorage()
    }

    loadMaterial = (url) => {
        if(this._isMounted){
            this.setState({ loading: true})
        }
        let query = Firebase.database().ref(url )
        query.once('value', snapshot => {
            let mat = []
            snapshot.forEach( val => { mat.push({ 
                value: val.val().name,   displayValue: val.val().name, price: val.val().price }) })
            this.props.hydrateMaterial(mat)
            const updatedInput = {...this.state.first}
            const inpElement = updatedInput['name']
            inpElement.options = mat
            updatedInput['name'] = inpElement
            if(this._isMounted){
                this.setState({ first: updatedInput, loading: false })
            }
        })   
    }

    hydrateStateFromLocalstorage = () => {
        let mat = JSON.parse(localStorage.getItem('material'));
        let client = JSON.parse(localStorage.getItem('client'))
        if(client && mat){
            this.props.hydrateState(mat)
            let clientDet = [client.name, client.compName, client.address, client.date]
            func.getArrayFromState(this.state.client).map((res, index) => {
                let updatedState = func.inputHandler('', res.id, this.state.client, clientDet[index] )
                this.setState({ client: updatedState})
                return ''
        })
        }  
    }

    saveStateToLocalstorage = () => {
        let mat = [...this.props.selMat]
        if(mat.length > 0){
            mat = JSON.stringify(mat)
            localStorage.setItem('material', mat)
        }
    }

    inputHandler = (event, id, myState, type) => {
        const updatedState = func.inputHandler(event, id, myState)
        this.setState({ type: updatedState})
    }

    submitHandler = (event, myState, type) => {
       event.preventDefault()
       const formdata = {}
        func.getArrayFromState(myState).map( formElement => formdata[formElement.id] = myState[formElement.id].value )
        if(formdata.name !== '' && formdata.unit !== '' && formdata.price !== '') {
            if(type === 'second'){
                try{
                   if(+formdata.price) { 
                       this.props.addText(formdata) 
                       let newElement = {
                        name: func.Input('input', 'text', 'Name', { required: true, minLength: 3 }),
                        price: func.Input('input', 'text', 'Unit Price', { required: true, minLength: 2, maxLength: 10, isNumeric: true }),
                        unit : func.Input('select', '', '', {}, Array(100).fill().map( (x,i) => ({value: i, displayValue: i} )))
                    }
                    this.setState({ second: newElement})
                    }
                }catch(error){ console.log( error) }
            }else if(type === 'first'){ this.props.addDrop(formdata) 
            }else{ 
                this.props.addClient(formdata) 
                localStorage.setItem('client', JSON.stringify(formdata))
            }
        }
    }

    continueHandler = (event) => {
        let isValid = true
        const updatedInput = {...this.state.client}
        func.getArrayFromState(this.state.client).map( val => {
            val.config.valid = func.checkValidity(val.config.value, val.config.validation)
            val.config.touched = true
            updatedInput[val.id] = val.config
            !func.checkValidity(val.config.value, val.config.validation) ? isValid = false : console.log()
            return ''
        })
        this.setState({ client: updatedInput})

        //Continue quotation is the list of aedded material isn't empty
        if(this.props.selMat.length > 0 && isValid === true ){
            this.submitHandler(event, this.state.client, 'client')
            this.props.history.push('/quotation');
        }
    }

    resetHandler = () => {
        this.props.reset()
        localStorage.removeItem('material')
        localStorage.removeItem('client')
        let client = {
            name: func.Input('input', 'text', 'Client Name', { required: true, minLength: 3 }),
            compName: func.Input('input', 'text', 'Company Name', { required: true, minLength: 3 }),
            address: func.Input('input', 'text', 'Address', { required: true, minLength: 7 }),
            date: func.Input('input', 'date', 'Expired', { required: true }),
        }
       this.setState({ client: client})
       return ''
    } 

    box = (myState, type, disp, sb)=> (
        <form onSubmit={(event) => this.submitHandler(event, myState, type)}>
            {func.getArrayFromState(myState).map( formElement => {
                return <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    options={formElement.config.options} 
                    elementConfig={formElement.config.elementConfig}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    value={formElement.config.value}
                    display={disp}
                    changed={(event) => this.inputHandler(event, formElement.id, myState, type)} /> 
                })}
            <div style={{ width: '100%', display: sb }}>
                <Button >Add</Button>
            </div>
        </form> )

    render(){

        const box = this.box(this.state.first, 'first', 'block')
        const box2 = this.box(this.state.second, 'second', 'block')
        const box3 = this.box(this.state.client, 'client', 'inline-block', 'none')
        const tableRow = this.props.selMat.map((list, index) => {
            return <tr style={{cursor: 'pointer'}} key ={index } onClick={() => this.props.deleteMat(list.name)}>
                        <td>{index + 1}</td>
                        <td>{list.name}</td>
                        <td>{list.unit}</td>
                        <td>{list.unitPrice}</td>
                        <td>{list.price}</td>
                    </tr>
        })

        let table = (
            <table className="table table-hover" style={{overflow: 'scroll'}}>
                <thead>
                    <tr className="bg-blue text-white">
                        <th>S/N</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Unit_Price</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRow}
                </tbody>
                <tfoot className="bg-blue"><tr>
                <td colSpan="5" className="text-white text-right pr-3">Total: #{this.props.totalPrice}</td>
                </tr></tfoot>
        
            </table> 
        )

        let load = ''

        if(this.state.loading){
            load = <span>Loading...</span>
        }
           
        return(
            <div className="mb-5">
                <div className="row  my-5">
                    <div className="col-lg-5 border bg-white p-3">
                        {load}
                        {box}
                    </div>
                    <div className="col-lg-2 "> </div>
                    <div className="col-lg-5 bg-white p-3">
                        {box2}
                    </div>
                </div>
                {table}    
                
                <div className="mt-5">
                    {box3}
                </div>
                
                <Button clicked={this.resetHandler} >Reset </Button>
                <Button clicked={this.continueHandler}>Continue</Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        hw: state.reduc.materials,
        selMat: state.reduc.list,
        totalPrice: state.reduc.totalPrice
    }
}
const mapDispatchToProps = dispatch => {
    return {
        addDrop: (formdata) => dispatch({ type: 'AddDrop', material: formdata }),
        addText: (formdata2) => dispatch({ type: 'AddText', material: formdata2 }),
        hydrateState: (data) => dispatch({ type: 'HydrateState', material: data }),
        hydrateMaterial: (data) => dispatch({ type: 'HydrateMaterial', material: data }),
        deleteMat: (name) => dispatch({ type: 'deleteMat', name: name }),
        reset: () => dispatch({ type: 'reset' }),
        addClient: (formdata) => dispatch({ type: 'AddClient', clientDetail: formdata }),
        onSetAuthRedirectPath: (path) => dispatch( setAuthRedirectPath( path) )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quota);
