import React, {Component} from 'react';
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import firebase from 'firebase';
import Login from './components/login';
import Clients from './components/clients';
import NewEmployee from './components/newEmployee';
import UserInfo from './components/userInfo';
import NewClient from './components/newClient';
import ClientInfo from './components/clientInfo';
import EditProfile from './components/editProfile';
import NewPet from './components/newPet';
import PetInfo from './components/petInfo';
import Employees from './components/employees';
import NewAppointment from './components/newAppointment';
import VacList from './components/vacList';
import NewVac from './components/newVac';
import changePass from './components/changePass';
import AppointInfo from './components/appointInfo';
import EditClient from './components/editClient';
import EditPet from './components/editPet';
import Menu from './components/menu.js'


class App extends Component {
  constructor(props){
    super(props);
    this.authListener = this.authListener.bind(this)
    this.state = {
      user: '',
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
    // console.log(user);
      if(user) {
        this.setState({user: user.uid}); 
    //    localStorage.setItem('user', user.uid);
      } else {
        this.setState({user: null});
    //    localStorage.removeItem('user');
      }
      console.log(this.state.user)
      });
      
  }
  
  render() {
    return (
      <Router>
      <div className="App col-md-10 mx-auto">
        <Menu />
      <Switch>
        <Route path="/" exact component={Clients}/>
        <Route path="/login" component={Login}/>
        <Route path="/addemployee" component={NewEmployee}/>
        <Route path="/profile" component={UserInfo}/>
        <Route path="/addclient" component={NewClient}/>
        <Route path="/client/:id" component={ClientInfo}/>
    
        <Route path="/addpet/:ownerId" component={NewPet}/>
        <Route path="/petinfo/:ownerId/:petId" component={PetInfo}/>
        <Route path="/newappointment/:petId" component={NewAppointment}/>
        {/*<Route path="/newvac/:petId" component={NewVac}/>*/}
        <Route path="/vaclist/:petId" component={VacList}/>
        <Route path="/appointinfo/:petId/:appointId" component={AppointInfo}/>
        <Route path="/changepass" component={changePass}/>
        <Route path="/employees" component={Employees}/>
        <Route path="/editprofile/:uid" component={EditProfile}/>
        <Route path="/editclient/:clientId" component={EditClient}/>
        <Route path="/editpet/:ownerId/:petId" component={EditPet}/>
      </Switch>
            </div>

  </Router>
      
      
    );
  }
}
/*function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Mainpage}/>
          <Route path="/login" component={Login}/>
          <Route path="/articles" component={Articles}/>
          <Route path="/settings" component={Settings}/>
        </Switch>
      </div>
    </Router>
  );
}*/
    //<Route path="/editprofile" component={EditProfile}/>}
export default App;


