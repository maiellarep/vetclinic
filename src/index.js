
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/App';
import firebase from 'firebase';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducersList from './reducers/index.js';
import {setEmpInfo} from './actions/index.js';

let store = createStore(reducersList,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


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
firebase.initializeApp(firebaseConfig);


const db = firebase.database();
let guestArray = {isLogged: false, isAdmin: false, uid: null}
firebase.auth().onAuthStateChanged((user) => {
  let uArray = {isLogged: false, isAdmin: false, uid: null}
  if(user) {
      db.ref('employees/' + firebase.auth().currentUser.uid).once('value').then(snapshot => {
          uArray = {
              isLogged: true,
              empName: snapshot.val().empName,
              position: snapshot.val().position,
              isAdmin: snapshot.val().isAdmin,
              schedule: snapshot.val().schedule,
              email: snapshot.val().email,
              uid: user.uid
          };
          store.dispatch(setEmpInfo(uArray))
      }); 
  }
  else {
    store.dispatch(setEmpInfo(guestArray))

  }
});


ReactDOM.render(
  <Provider store = {store}>
  <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
