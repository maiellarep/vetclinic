const logReducer = (state = {isLogged: false, isAdmin: false, empName: "no name", position: "no position", uid: 'no id'}, action) => {
    switch(action.type) {
        case 'setEmpInfo':
            state = action.payload;
            return state;
        case 'logout':
            state = {isLogged: false, isAdmin: false}
            return state;
        default:
            return state;
    }
  }
  
export default logReducer;