import React from 'react';
//import './css/Login.css';
//import './App.css';
/*import withStyles from '@material-ui/core/styles/withStyles';*/
/*import Grid from 'react-router-dom';*/
/*import axios from 'axios'*/
//import auth from 'firebase/firebase-auth'
import firebase from 'firebase';
//import { Redirect } from 'react-router-dom';
//import Menu from './Menu';
//import $ from 'jquery';
import './login.css';
import {logout} from '../../actions/index';
import {connect} from 'react-redux';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hiddenValue = this.hiddenValue.bind(this);
    this.state = {
      email:'',
      password:'',
      uid: '',
      hidden: true,
      errorMessage: ''
    }

  }
 

  login(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) =>{ 
      const db = firebase.database();
      db.ref('employees/' + u.user.uid + '/status').once('value').then((snapshot) => {
        console.log(snapshot.val())
        if(snapshot.val() === 'blocked') {
          firebase.auth().signOut()
          alert("Ваш аккаунт был заблокирован");
        } else {
          this.props.history.push('/');
        }
      })
    }).catch((error) => {
      this.setState({errorMessage: error.message})
    });
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  hiddenValue(e) {
    this.setState({hidden: !this.state.hidden});
  }
  
  render() {
    if(this.props.login.uid == null)
    {
      return(
        <div className="container">
          <h1 className="login-title">Вход</h1>
          <form className="container" onSubmit={this.login}>
            <input id="email" type="email" name="email" className="lginput" value={this.state.email} onChange={this.handleChange} placeholder="E-mail" required />
            <div className='pswd'><input type= {this.state.hidden ? "password" : "text"} id="password" name="password" className="lginput" value={this.state.password} onChange={this.handleChange} placeholder="Пароль" reqiured/>
            <span className= {this.state.hidden ? "fa fa-eye" : "fa fa-eye-slash"} onClick={this.hiddenValue}></span></div>
            <div className="error-div">
              <span className="error-message">{this.state.errorMessage}</span>
            </div>
            <button className="lgbutton">Войти</button>
          </form>
        </div>
      );
    }
    else if (this.props.login.uid != null){
      return(
        <div>
          <h1>Вы уже в сети</h1>
        </div>
      );
    }
    
  }
} 

const mapStateToProps = (state) => {
  return {login: state.login}
} 

const mapDispatchToProps = {
  logout
}

export default connect (mapStateToProps, mapDispatchToProps) (Login);