const initialState = {
    materials:[],
    list: [],
    totalPrice: 0,
    client: {}

}

const calcTotal = (state) => {
    if(state !== null){
        return state.map(tot => { return tot.price }).reduce((prev, nxt) => { return prev + nxt }, 0)
    }
    
}

const inputHandler = (state, value, mat) => {
        let isValid = true
        const matList = [...state.list]
        let result = matList.map( val => val.name.toLowerCase() === value.toLowerCase() ?
            { ...val, unit: +mat.unit + +val.unit, price: (+mat.unit + +val.unit) * val.unitPrice  } : val  )

        for( let i=0; i<matList.length; i++){
            if(value.toLowerCase() === matList[i].name.toLowerCase()){
                isValid = false
                break
            }
        }
        return isValid ? { ...state, list: state.list.concat(mat)} : { ...state, list: result}
}

const Reducer = (state=initialState, action) => {
    const act = action.material
    let newState = null
    let mat = {}
    switch(action.type){
        case 'AddDrop':
            state.materials.map(value => {
                if(value.value === action.material.name){
                    mat = {name: act.name, unit: act.unit, unitPrice: value.price, price: value.price * act.unit}
                }
                return ''
            })
            newState =  inputHandler(state, act.name, mat)
            newState['totalPrice'] = calcTotal(newState.list) //set the total price
            return newState

        case 'AddText':
            mat = {name: act.name, unit: act.unit, unitPrice: act.price, price: act.price * act.unit}
            newState = inputHandler(state, act.name, mat)
            newState['totalPrice'] = calcTotal(newState.list) //set the total price
            return newState

        case 'deleteMat':
            const newArray = state.list.filter( result => result.name !== action.name)
            newState = { ...state, list: newArray }
            newState['totalPrice'] = calcTotal(newState.list)
            return newState

        case 'AddClient':
            return { ...state, client: action.clientDetail }

        case 'reset':
            return {...state, list: []}

        case 'HydrateState':
            newState = { ...state, list: act}
            newState['totalPrice'] = calcTotal(newState.list) //set the total price
            return newState
        
        case 'HydrateClient':
            return { ...state, client: act }
    
        case 'HydrateMaterial':
            newState = { ...state, materials: act }
            return newState

        default:
            return state
    }
}

export default Reducer;

// {value: 'Anchor Fastener', displayValue: 'Anchor fastener', price: 100},