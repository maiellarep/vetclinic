import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
import './newEmployee.css';
import {momentToDay, deleteItemFromArray} from '../../functions/index.js';
import moment from 'moment';

class NewEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.scheduleChange = this.scheduleChange.bind(this);
        this.state = {
            days: moment.weekdays(),
            empName: '',
            position: '',
            isAdmin: false,
            email: '',
            pass: '',
            schedule: [],
            appointments: []
        }
    }

    componentDidMount() {

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

    scheduleChange(e) {
        let schedule = this.state.schedule;
        const {checked} = e.target;
        console.log(e.target.name)
        if(checked) {
            schedule.push(e.target.name)
        }
        else {
            deleteItemFromArray(schedule, e.target.name)
        }

        this.setState({schedule: schedule});
    }
    
    handleClick() {
        this.props.history.push('/');
    }

    randomFunction() {
        let min = 10;
        let max = 20000;
        let rand = Math.floor(Math.random() * (max - min + 1)) + min
        return rand.toString();
    }

    pushdb(e) {
        e.preventDefault();
        var config = {apiKey: "AIzaSyBVNBj6SGaDA2xkiyakCbCS43KZ-Dm_VnU",
        authDomain: "vetclinic-karetnikova.firebaseapp.com",
        databaseURL: "https://vetclinic-karetnikova-default-rtdb.firebaseio.com"};
        var secondApp = firebase.initializeApp(config, this.randomFunction()); 

        let data = {empName: this.state.empName,
            position: this.state.position,
            isAdmin: this.state.isAdmin,
            schedule: this.state.schedule,
            appointments: this.state.appointments,
            email: this.state.email,
            status: "active"}

        secondApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass).then(function() {
            var u = secondApp.auth().currentUser;
            console.log(u)
            const newReference = firebase.database()
            .ref('employees/'+ u.uid)

            newReference
            .set(data).then(() => {
                alert("Новый пользователь добавлен успешно")
            });
            
        }, function(error) {
            alert(error.message);
        });
        
        secondApp.auth().signOut().then(() => {
            this.props.history.push('/employees');
        });
        
    }

    render() {
        if(this.props.login.isLogged === true) {
            if(this.props.login.isAdmin === true) {
                return(
                    <div className="container">
                        <h1>Создание нового сотрудника</h1>
                        <div className="form-container">
                            <form  onSubmit={this.pushdb} className="form">
                                <input id="empName" className="input" name="empName" type="text" placeholder="ФИО" value={this.state.empName} onChange={this.handleChange} required/>
                                <input id="position" className="input" name="position" type="text" placeholder="Должность" value={this.state.position} onChange={this.handleChange} required/>
                                <input type="e-mail" name="email" className="input" placeholder="E-mail" value={this.state.email} onChange={this.handleChange} required></input>
                                <input type="password" name="pass" className="input" placeholder="Password" value={this.state.pass} onChange={this.handleChange} required></input>

                                <div className="checkbox-container rights"> 
                                    <p>Права администратора</p>
                                    <div>
                                    <input type="checkbox" className="checkbx" name="isAdmin" id="chkbtn1" defaultChecked={this.state.isAdmin} onChange={this.handleChange}/>
                                    <label htmlFor="chkbtn1" className="checkbox-label"></label>
                                    </div>
                                </div>

                                <h3>График работы</h3>
                                {this.state.days.map((day) => {
                                    return (
                                        <div className="checkbox-container schedule" key={day}> 
                                            <p className="left-col">{momentToDay(day)}</p>
                                            <div className="right-col">
                                                <input type="checkbox" className="checkbx" name={day} id={day} defaultChecked={this.state.schedule.includes(day)} onChange={this.scheduleChange}/>
                                                <label htmlFor={day} className="checkbox-label"></label>
                                            </div>
                                        </div>
                                    )
                                })}
                                <p className="btns" ><button className="btn" type="button" onClick={this.handleClick}>Отмена</button>
                                <button type="submit" className="btn">Добавить</button></p>
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