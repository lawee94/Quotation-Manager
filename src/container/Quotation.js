import React, { Component } from 'react';
import Button from '../component/UI/Button';
import Modal from '../component/UI/Modal';
import Input from '../component/UI/Input';
import Spinner from '../component/UI/Spinner';
import Aux from '../hoc/Auxs/Auxs'
import * as func from '../store/func';
import { connect } from 'react-redux';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import Firebase from '../firebase/Firebase'

class Quotation extends Component {

    _isMounted = false

    state = {
        show: false,
        name: func.Input('input', 'text', 'Name', { required: true }),
        modalType: '',
        loading: false,
        quotaID: null
    }

    componentDidMount(){
        this._isMounted = true
        this.hydrateStateToLocalstorage()
        this.getQuotationID()
    }

    componentWillUnmount(){
        this._isMounted = false
    }
    
    hydrateStateToLocalstorage = () => {
            let mat = JSON.parse(localStorage.getItem('material'));
            let client = JSON.parse(localStorage.getItem('client'));
            this.props.hydrateState(mat)
            this.props.hydrateClient(client)
    }

    getQuotationID = () => {
        let counter = 1
        let query = Firebase.database().ref('/savedQuotation')
        query.once('value', snapshot => {
            snapshot.forEach( val => {
                counter++
            })
            this.setState({ quotaID: counter})
        }) 
    }

    saveHandler = () => {
        this.setState({ edit: true, modalType: 'save', loading: true})
        const quoteData = {
            quotationID: this.state.quotaID,
            quotationName: this.state.name.value,
            quotationType: localStorage.getItem('choice'),
            created: new Date(Date.now()).toLocaleString().split(',')[0],
            expired: this.props.client.date,
            clientName: this.props.client.name,
            clientAddress: this.props.client.address,
            companyName: this.props.client.compName,
            material: this.props.selMat,
            total: this.props.totalPrice
        }
        Firebase.database().ref('savedQuotation').push(quoteData)
            .then( () => {
                this.setState({ loading: false})
                this.props.history.push('/quotalist') 
            })
            .catch( () => this.setState({ loading: true}))
     }

    backHandler = () => {
        this.props.history.goBack();
    }

    modalHandler = (name) => {
        this.setState({ show: true, modalType: name})
    }

    modalCancelHandler = () => {
        this.setState( { show: false } );
    }

    inputHandler = (event) => {
        const inpElement = {...this.state.name}
        inpElement.value = event.target.value 
        inpElement.valid = func.checkValidity(event.target.value, this.state.name.validation)
        inpElement.touched = true
        this.setState({ name: inpElement})
    }

    renderPDF = () => {
        return <Document>
        <Page style={styles.Page}>
            <View style={styles.Container}>
                <View style={ styles.Toolbar}>
                    <View style={styles.Logo}><Text>A</Text></View>
                    <View style={{width: '70%', fontSize: 16}}><Text>Al-Qahhar & Co. Royal Services</Text></View>
                    <View style={{width: '20%', fontSize: 12}}><Text>Quotation</Text></View>
                </View>
                <View style={styles.DetailCover}>
                    <View style={styles.BoxLayout}>
                        <View style={{width: '70%'}}>
                            <Text>To:</Text>
                            <Text>{this.props.client.name}</Text>
                            <Text>{this.props.client.compName}</Text>
                            <Text>{this.props.client.address}</Text>
                        </View>
                    </View>
                    <View style={styles.BoxLayout}>
                        <View style={{width: '30%'}}>
                            <Text>Quotation Details:</Text>
                            <Text>Quotation ID:  {this.state.quotaID}</Text>
                            <Text>Date: 15-04-2020</Text>
                            <Text>Expired On: 25-06-2020</Text>
                        </View>
                    </View>
                </View>
                <Text style={{ fontSize: '12', margin: '15px 20px'}}>This quotation is prepared by Engr. A. O. Aliyu </Text>
                
                <View style={styles.table}> 

                {/* TableHeader */} 
                    <View style={styles.tableHead}> 
                        <View style={styles.th}> 
                            <Text style={styles.tableCell}>S/N</Text> 
                        </View> 
                        <View style={styles.th2}> 
                            <Text style={styles.tableCell}>Name</Text> 
                        </View> 
                        <View style={styles.th}> 
                            <Text style={styles.tableCell}>Quantity</Text> 
                        </View> 
                        <View style={styles.th}> 
                            <Text style={styles.tableCell}>Unit Price</Text> 
                        </View> 
                        <View style={styles.th}> 
                            <Text style={styles.tableCell}>Price</Text> 
                        </View> 
                    </View> 

                {/* TableContent */} 
            { this.props.selMat.map((list, index) => {
                    return <View key={index} style={styles.tableRow}> 
                                <View style={styles.tableCol}> 
                                    <Text style={styles.tableCell}>{index + 1}</Text> 
                                </View> 
                                <View style={styles.tableCol2}> 
                                    <Text style={styles.tableCell}>{list.name}</Text> 
                                </View> 
                                <View style={styles.tableCol}> 
                                    <Text style={styles.tableCell}>{list.unit}</Text> 
                                </View> 
                                <View style={styles.tableCol}> 
                                    <Text style={styles.tableCell}>{list.unitPrice}</Text> 
                                </View>
                                <View style={styles.tableCol}> 
                                    <Text style={styles.tableCell}>{list.price}</Text> 
                                </View>
                            </View> 
                        })}
                </View>
                <View style={styles.Total}>
                    <Text>Total: #{this.props.totalPrice}</Text>
                </View>
                <View style={styles.Box}>
                    <Text style={{ marginTop: '40px'}}>_____________________</Text>
                    <Text style={{marginLeft: '40px'}}>Signature</Text>
                </View >
                <View style={styles.hr}>
                    <Text>Thanks for your patronage</Text>
                </View>
                
                <View style={styles.Box} >
                    <Text>Tel: 07039378119, 08057359360</Text>
                    <Text>E-mail: al-qahhar@gmail.com</Text>
                </View>
            </View>
        </Page>
    </Document> 
    }

    render(){

        const table = func.table(this.props.selMat, this.props.totalPrice)
        const saveQuota = (
            <div>
                <Input 
                    elementType={this.state.name.elementType}  
                    elementConfig={this.state.name.elementConfig}
                    invalid={!this.state.name.valid}
                    shouldValidate={this.state.name.validation}
                    touched={this.state.name.touched}
                    value={this.state.name.value}
                    changed={(event) => this.inputHandler(event)} /> 
                <Button clicked={this.modalCancelHandler}>Cancel</Button>
                <Button clicked={this.saveHandler}>Save</Button>
            </div>
        )
        const printQuota =(
            <div>
                <p>Confirm Printing...</p>
                <Button clicked={this.modalCancelHandler}>Cancel </Button>
                {this.state.show && <PDFDownloadLink document={this.renderPDF()} fileName="Quotation.pdf">
                    <Button clicked={this.modalCancelHandler}>Print </Button>
                </PDFDownloadLink>}
            </div>
        )
        let modal = this.state.modalType === 'save' ? saveQuota : printQuota

        if(this.state.loading){
            modal = <Spinner />
        }

        return(
            <Aux>
                <Modal show={this.state.show} modalClosed={this.modalCancelHandler}>
                    {modal}
                </Modal>
                <div id='quotation' className="row">
                    <div className="col-lg-6 text-left px-5 py-3">
                        <p>To:</p>
                        <p>{this.props.client.name}</p>
                        <p>{this.props.client.compName}</p>
                        <p>{this.props.client.address}</p>
                    </div>
                    <div className="col-lg-6 text-right px-5 py-3">
                        <p>Quotation Details:</p>
                        <p>Quotation No: {this.state.quotaID}</p>
                        <p>Date: {new Date(Date.now()).toLocaleString().split(',')[0]}</p>
                        <p>Expired On: {this.props.client.date}</p>
                    </div>
                    <div className="row pl-5">
                        <p>This quotation is prepared by <strong>Engr. A. O. Aliyu</strong></p>
                    </div>
                    {table}
                    <div className="row w-100 px-5 my-3 text-left">
                        <p className="w-100">___________________</p>
                        <p style={{marginLeft: '60px'}}>Signature</p>
                    </div>
                    <div className="row w-100 px-5 text-left ">
                        <p className="w-100 ">Tel: 07039378119, 08057359360 </p>
                        <p>E-mail: al-qahhar@gmail.com</p>
                    </div>
                    
                </div>
                <Button clicked={this.backHandler} >Back </Button>
                <Button clicked={() => this.modalHandler('save')}>Save </Button>
                <Button clicked={() => this.modalHandler('print')}>Print </Button>            
            </Aux>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        selMat: state.reduc.list,
        totalPrice: state.reduc.totalPrice,
        client: state.reduc.client,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        addDrop: (formdata) => dispatch({ type: 'AddDrop', material: formdata }),
        hydrateState: (data) => dispatch({ type: 'HydrateState', material: data }),
        hydrateClient: (data) => dispatch({ type: 'HydrateClient', material: data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quotation);

const styles = StyleSheet.create({
    Page: {
        backgroundColor: '#ffffff',
    },
    Container: {
        width: '80%',
        margin: '20px 10%'
    },
    Toolbar: {
        backgroundColor: '#1A5264',
        width: '100%',
        height: '40px',
        flexDirection: "row",
        color: '#ffffff',
        padding: '10px'
    },

    BoxLayout: {
       padding: '0 0 0 10px',
       height: 'auto',
       textAlign: 'left',
       display: 'inline-block',
       verticalAlign : 'top',
       flexDirection: "row",
       fontSize: 12
    },

    DetailCover: {
        width: '90%',  
        flexDirection: "row",
        margin: '20px auto',
        fontSize: 12
    },
    table: { 
        display: "table", 
        width: "auto", 
    }, 
    tableHead: {
        backgroundColor: '#1A5264',
        width: '100%',
        flexDirection: "row",
        color: '#ffffff',
        textAlign: 'center'
    },

    tableRow: { 
        margin: "auto", 
        flexDirection: "row" ,
        width: '100%',
        borderStyle: "solid", 
        borderWidth: 1, 
        borderTopWidth: 0, 
        borderBottomWidth: 0 ,
        borderRightWidth: 0 
    }, 

    th: {
        height: 'auto',
        display: 'inline-block',
        verticalAlign : 'middle',
        textAlign: 'center',
        flexDirection: "row",
        width: '12%',
        padding: '5px',
    },

    th2: {
        height: 'auto',
        display: 'inline-block',
        verticalAlign : 'middle',
        textAlign: 'center',
        flexDirection: "row",
        width: '52%',
        padding: '5px',
    },
 
    tableCol2: { 
        display: 'inline-block',
        borderStyle: "solid",
        flexDirection: "row", 
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0,
        padding: '5px',
        width: '52%'
    },
    tableCol: { 
        display: 'inline-block',
        borderStyle: "solid", 
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0,
        padding: '5px',
        width: '12%',
        textAlign: 'center'
    }, 

    tableCell: { 
        // margin: "auto", 
        // marginTop: 5, 
        fontSize: 10 
    },

    P: {
       margin: 0,
    },

    Total: {
        width: '100%',
        backgroundColor: '#1A5264',
        padding: '5px',
        textAlign: 'right',
        color: 'white',
        fontSize: 12
    },

    hr: {
        width: '100%',
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderColor: '#000',
        padding: '10px',
        textAlign: 'center',
        fontSize: 12
    },

    Box: {
        width: '100%',
        margin: '20px',
        textAlign:  'left',
        marginTop: '20px',
        fontSize: 12
    },
    
    Logo: {
        fontWeight:' bold',
        borderWidth: 1, 
        borderStyle: 'solid',
        borderColor: 'white',
        width: '20px',
        height: 'auto',
        color: 'white',
        verticalAlign: 'top',
        marginRight: '10px'
    }
})