import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';

class ChangePass extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.change = this.change.bind(this);
  
        this.state = {
            old: '',
            new1: '',
            new2: ''
        }
    }

    change() {
        if(this.state.new1 === this.state.new2) {
            const currentPass = this.state.old
            const emailCred  = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser.email, currentPass)
  
            firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
            .then(() => {
            // User successfully reauthenticated.
            const newPass = this.state.new1
            firebase.auth().currentUser.updatePassword(newPass).then(() => {
                window.location.href = '/'
            })
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            alert("Новые пароли не совпадают")
        }
        
    }

    handleClick() {

    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
       
            return(
                <div>
                    <label>Введите старый пароль</label><br/>
                    <input id="old" class="input_1" name="old" type="password" value={this.state.old} onChange={this.handleChange} required/><br/>
                    <label>Введите новый пароль</label><br/>
                    <input id="new1" class="input_1" name="new1" type="password" value={this.state.new1} onChange={this.handleChange} required/><br/>
                    <label>Повторите пароль</label><br/>
                    <input id="new2" class="input_1" name="new2" type="password" value={this.state.new2} onChange={this.handleChange} required/><br/>
                    
                    <button class="btn green" type="button" onClick={this.change}>Изменить пароль</button>
                </div>
            );
    }
}


export default ChangePass;