import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
import {boolToWord} from '../functions/index.js';
import ChangePass from './changePass'



class UserInfo extends React.Component {
   /* constructor(props) {
        super(props);
        this.state = {
            empName: '',
            position: '',
            isAdmin: ''
        }
    }*/

   /* componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                const db = firebase.database();
                const userData = db.ref('employees/' + firebase.auth().currentUser.uid).once('value').then(snapshot => {
                    let admin;
                    if(snapshot.val().isAdmin === true) {
                        admin = "Да"
                    } else {
                        admin = "Нет"
                    }
                    this.setState ({
                        empName: snapshot.val().empName,
                        position: snapshot.val().position,
                        isAdmin: admin
                    });
                }); 
            }
        });
       
        /*const db = firebase.database();
        const userData = db.ref('employees/' + firebase.auth().currentUser.uid).once('value').then(snapshot => {
            this.setState ({
                empName: snapshot.val().empName,
                position: snapshot.val().position,
                isAdmin: snapshot.val().isAdmin
            });
        });
    }*/

    render() {
        if(this.props.login.isLogged === true) {
            let admin = boolToWord(this.props.login.isAdmin);
            return(
                
                <div>
                    <div>ФИО: {this.props.login.empName}</div>
                    <div>Должность: {this.props.login.position}</div>
                    <div>Права администратора: {admin}</div>

                    <ChangePass />
                </div>
            );
        } else {
            return(
                <div>
                    <h1>Для просмотра этой страницы Вы должны войти в систему</h1>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {login: state.login}
}

export default connect (mapStateToProps) (UserInfo);