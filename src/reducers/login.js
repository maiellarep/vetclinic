const logReducer = (state = {isLogged: false, isAdmin: false, empName: null, position: null, uid: null}, action) => {
    switch(action.type) {
        case 'setEmpInfo':
            state = action.payload;
            return state;
        case 'logout':
            state = {isLogged: false, isAdmin: false, empName: null, position: null, uid: null}
            return state;
        default:
            return state;
    }
  }
  
export default logReducer;