import React from 'react';
import firebase from 'firebase';
import './changePass.css';
//import './newClient.css';

class ChangePass extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.change = this.change.bind(this);
  
        this.state = {
            old: '',
            new1: '',
            new2: ''
        }
    }

    change(e) {
        e.preventDefault(); 
        if(this.state.new1 === this.state.new2) {
            const currentPass = this.state.old
            const emailCred  = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser.email, currentPass)
            firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
            .then(() => {
                const newPass = this.state.new1
                firebase.auth().currentUser.updatePassword(newPass).then(() => {
                    alert("Пароль изменен успешно");
                    window.location.href = '/'
                })
            }).catch((error) => {
                alert(error);
            });
        } else {
            alert("Новые пароли не совпадают")
        }
        
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return(
            <div className="change-password form-container">
                <form onSubmit={this.change} className="pass-form form">
                    <h4>Изменить пароль от аккаунта</h4>
                    <input id="old" className="input" name="old" type="password" placeholder="Введите старый пароль" value={this.state.old} onChange={this.handleChange} required/>
                    <input id="new1" className="input" name="new1" type="password" placeholder="Введите новый пароль" value={this.state.new1} onChange={this.handleChange} required/>
                    <input id="new2" className="input" name="new2" type="password" placeholder="Повторите новый пароль" value={this.state.new2} onChange={this.handleChange} required/>
                    <button className="btn chPass" type="submit">Изменить пароль</button>
                </form> 
            </div>
        );
    }
}


export default ChangePass;