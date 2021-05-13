
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase';
import * as serviceWorker from './serviceWorker';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import reducersList from './reducers/index.js';
import {setEmpInfo, getClients} from './actions/index.js';


//STORE - global state
let store = createStore(reducersList,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//ACTION

var firebaseConfig = {
  apiKey: "AIzaSyBVNBj6SGaDA2xkiyakCbCS43KZ-Dm_VnU",
  authDomain: "vetclinic-karetnikova.firebaseapp.com",
  databaseURL: "https://vetclinic-karetnikova-default-rtdb.firebaseio.com",
  projectId: "vetclinic-karetnikova",
  storageBucket: "vetclinic-karetnikova.appspot.com",
  messagingSenderId: "1086853074177",
  appId: "1:1086853074177:web:e279da81421c5647ff9f00",
  measurementId: "G-JW6XGQVZYD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const db = firebase.database();
let uArray = {isLogged: false, isAdmin: false, uid: "no id"}
firebase.auth().onAuthStateChanged((user) => {
  if(user) {
      const userData = db.ref('employees/' + firebase.auth().currentUser.uid).once('value').then(snapshot => {
          uArray = {
              isLogged: true,
              empName: snapshot.val().empName,
              position: snapshot.val().position,
              isAdmin: snapshot.val().isAdmin,
              uid: firebase.auth().currentUser.uid
          };
          store.dispatch(setEmpInfo(uArray))
      }); 
  }
  else {
    store.dispatch(setEmpInfo(uArray))
  }
});


function clientsToStore () {
  let allCl = [];
        const db = firebase.database();
        const cInfo = db.ref('clients/').once("value").then((snapshot) =>
            {
                let clients = snapshot.val();
                for(let client in clients)
                {
                    allCl.push({
                        id: client,
                        clientName: clients[client].clientName,
                        address: clients[client].address,
                        phoneNumber: clients[client].phoneNumber,
                        email: clients[client].email
                    });
                }
                store.dispatch(getClients(allCl))
            });
}

clientsToStore()






ReactDOM.render(
  <Provider store = {store}>
  <App />
  </Provider>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();
