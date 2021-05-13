const clientsReducer = (state = {isLogged: false, isAdmin: false, empName: "no name", position: "no position", uid: 'no id'}, action) => {
    
    switch(action.type) {
        case 'getClients':
            state = action.payload;
            return state;
        case 'updateClients':
            let index = state.findIndex(function(r) {
                return r.id === action.payload.id
            });
            state.splice(index, 1, action.payload)
            return state;
        case 'deleteClient':
            let index2 = state.findIndex(function(r) {
                return r.id === action.payload
            });
            state.splice(index2, 1)
            return state;
        case 'addClient':
            console.log(action.payload)
            state.push(action.payload)
            return state;
        default:
            return state;
    }
  }
  
export default clientsReducer;