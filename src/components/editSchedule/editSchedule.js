import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
//import './newEmployee.css';
import moment from 'moment';
import {momentToDay, deleteItemFromArray} from '../../functions/index.js'
import './editSchedule.css'

class EditSchedule extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.scheduleChange = this.scheduleChange.bind(this)
        this.state = {
            days: [],
            schedule: []
        }
    }

    componentDidMount() {
        const db = firebase.database();
        db.ref('employees/' + this.props.match.params.empId).once('value').then(snapshot => {
            this.setState({
                days: moment.weekdays(),
                schedule: snapshot.val().schedule
            })  
        });
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

    pushdb(e) {
        e.preventDefault();
        firebase.database()
        .ref('employees/' + this.props.match.params.empId).update({
            schedule: this.state.schedule
        });
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="container">
                    <h1>График работы</h1>
                    <div className="form-container">
                        <form  onSubmit={this.pushdb} className="form">
                            <fieldset className='checkboxgroup'>
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
                            </fieldset>   
                            <p className="btns" >
                                <button className="btn" type="button" onClick={this.handleClick}>Отмена</button>
                                <button type="submit" className="btn">Изменить</button>
                            </p>
                        </form>
                    </div>
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

export default connect (mapStateToProps) (EditSchedule);