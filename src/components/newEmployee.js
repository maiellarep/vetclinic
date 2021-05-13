import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';


class NewEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.state = {
            empName: '',
            position: '',
            isAdmin: false,
            email: '',
            pass: ''
        }
    }

    handleChange(e) {

        if(e.target.name === "isAdmin") {
            const {checked} = e.target
            console.log(e.target)
            this.setState({
                isAdmin: checked
              })
        }
        else {
            this.setState({[e.target.name]: e.target.value});
        }
        
    }
    
    handleClick() {

    }

    pushdb() {
        var config = {apiKey: "AIzaSyBVNBj6SGaDA2xkiyakCbCS43KZ-Dm_VnU",
        authDomain: "vetclinic-karetnikova.firebaseapp.com",
        databaseURL: "https://vetclinic-karetnikova-default-rtdb.firebaseio.com"};
        var secondApp = firebase.initializeApp(config, "Secondapp"); 

        let data = {empName: this.state.empName,
            position: this.state.position,
            isAdmin: this.state.isAdmin}

        secondApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass).then(function() {
            var u = secondApp.auth().currentUser;
            console.log(u)
            const newReference = firebase.database()
            .ref('employees/'+ u.uid)

            newReference
            .set(data);
            
        }, function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
        });
        
        secondApp.auth().signOut();
    }

    render() {
        if(this.props.login.isLogged === true) {
            if(this.props.login.isAdmin === true) {
                return(
                    <div>
                        <div>
                            <form>
                                <label>ФИО</label><br/>
                                <input id="empName" class="input_1" name="empName" type="text" value={this.state.empName} onChange={this.handleChange} required/><br/>
                                <label>Должность</label><br/>
                                <input id="position" class="input_1" name="position" type="text" value={this.state.position} onChange={this.handleChange} required/><br/>
                                <p><input type="checkbox" name="isAdmin" defaultChecked={this.state.isAdmin} onChange={this.handleChange}/>Права администратора</p>
                                <label>E-mail</label><br/>
                                <input type="e-mail" name="email" value={this.state.email} onChange={this.handleChange}></input><br/>
                                <label>Password</label><br/>
                                <input type="password" name="pass" value={this.state.pass} onChange={this.handleChange}></input>
                                <p><button class="btn green" type="button" onClick={this.handleClick}>Отмена</button>
                                <button type="button" class="btn green" onClick={this.pushdb}>Добавить</button></p>
                            </form>
                        </div>
                    </div>
                );
            } else {
                return(
                    <div>
                        <h1>Данную страницу могут просматривать только администраторы</h1>
                    </div>
                )
            }
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

export default connect (mapStateToProps) (NewEmployee);