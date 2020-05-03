import React from 'react';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const getArrayFromState = (myState) => {
    const selArray = []
    for(let key in myState){
        selArray.push({
            id: key, config:myState[key]
        })
    }
    return selArray
}

export const inputHandler = (event, inputIdentifier, myState, ntEventValue) => {
    const updatedInput = {...myState}
    const inpElement = updatedInput[inputIdentifier]
    try {
        const val = ntEventValue ? ntEventValue.toString() : event.target.value
        inpElement.value = val
        const isvalid = ntEventValue === ' ' && event === '' ? true : checkValidity(val, myState[inputIdentifier].validation)
        inpElement.valid = isvalid
        inpElement.touched = true
        updatedInput[inputIdentifier] = inpElement
    } catch (error) {   }
    return updatedInput
}

export const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}

export const tableRow = (row) => {
    if(row !== null){
        const lists = row.map((list, index) => {
            return <tr key ={index } >
                        <td>{index + 1}</td>
                        <td>{list.name}</td>
                        <td>{list.unit}</td>
                        <td>{list.unitPrice}</td>
                        <td>{list.price}</td>
                    </tr>
                })
        return lists
    }
}

export const table = (arrayTable, totalPrice) => {
    let table = (
        
            <table className="table table-hover table-striped mx-4">
                <thead className="bg-blue text-white">
                    <tr>
                        <th>S/N</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Unit_Price</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRow(arrayTable)}
                </tbody>
                <tfoot className="bg-blue"><tr>
                <td colSpan="5" className="text-white text-right pr-3">Total: #{totalPrice}</td>
                </tr></tfoot>
            </table> 
    )
    return table
}

export const Input = (elemType, type, placeholder, validation, options) => {
    const element = {
        elementType: elemType,
        elementConfig:{ placeholder: placeholder, type: type },
        options: options,
        value: '',
        validation: validation,
        valid: false,
        touched: false
    }
return element  
}