import React from 'react';
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '../login/login';
import Clients from '../clients/clients';
import NewEmployee from '../newEmployee/newEmployee';
import UserInfo from '../userInfo/userInfo';
import NewClient from '../newClient/newClient';
import ClientInfo from '../clientInfo/clientInfo';
import EditProfile from '../editProfile/editProfile';
import NewPet from '../newPet/newPet';
import PetInfo from '../petInfo/petInfo';
import Employees from '../employees/employees';
import NewAppointment from '../newAppointment/newAppointment';
import VacList from '../vacList/vacList';
import AppointInfo from '../appointInfo/appointInfo';
import EditClient from '../editClient/editClient';
import EditPet from '../editPet/editPet';
import Menu from '../menu/menu.js';
import AppointList from '../appointList/appointList.js';
import EmpInfo from '../empInfo/empInfo.js';
import EditSchedule from '../editSchedule/editSchedule.js'
import Registry from '../registry/registry.js';
import RegistedAppointments from '../registedAppointments/registedAppointments.js'
import CancelAppointment from '../cancelAppoint/cancelAppoint.js'
import Footer from '../footer/footer.js'


function App() {  
    return (
      <Router>
        <div className="App">
          <div className="main-content">
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
              <Route path="/vaclist/:petId" component={VacList}/>
              <Route path="/appointinfo/:petId/:appointId" component={AppointInfo}/>
              <Route path="/employees" component={Employees}/>
              <Route path="/editprofile/:uid" component={EditProfile}/>
              <Route path="/editclient/:clientId" component={EditClient}/>
              <Route path="/editpet/:ownerId/:petId" component={EditPet}/>
              <Route path="/appointslist/:petId" component={AppointList}/>
              <Route path="/employee/:empId" component={EmpInfo}/>
              <Route path="/editschedule/:empId" component={EditSchedule}/>
              <Route path="/registry/:clientId" component={Registry}/>
              <Route path="/registedappoints" component={RegistedAppointments}/>
              <Route path="/cancelappoint" component={CancelAppointment}/>
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    );
}

export default App;


