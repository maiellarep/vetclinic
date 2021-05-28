import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
//import './appointInfo.css';
import {boolToWord, momentToDay} from '../../functions/index.js';

class EmpInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            empName: '',
            isAdmin: false,
            position: '',
            schedule: []
        }
    }

    componentDidMount() {
        const db = firebase.database();

        db.ref('employees/' + this.props.match.params.empId).once('value').then(snapshot => {
            this.setState({
                empName: snapshot.val().empName,
                email: snapshot.val().email,
                isAdmin: snapshot.val().isAdmin,
                position: snapshot.val().position,
                schedule: snapshot.val().schedule.map(momentToDay).join(', ')
            })  
        });
 
    }

    handleClick() {
        this.props.history.goBack();
    }

    render() {
        if(this.props.login.isLogged === true) {
            let admin = boolToWord(this.state.isAdmin);
            return(
                <div className="container">
                    <h1>Информация о сотруднике</h1>
                    <div className="form-container">
                        <div className="data-row">
                            <div className="data-title">ФИО:</div>
                            <div>{this.state.empName}</div>
                        </div>

                        <div className="data-row">
                            <div className="data-title">Должность:</div>
                            <div>{this.state.position}</div>
                        </div>
                        <div className="data-row">
                            <div className="data-title">E-mail:</div>
                            <div>{this.state.email}</div>
                        </div>
                        <div className="data-row">
                            <div className="data-title">Права администратора:</div>
                            <div>{admin}</div>
                        </div>
                        <div className="data-row">
                            <div className="data-title">Рабочие дни:</div>
                            <div>{this.state.schedule}</div>
                        </div>
                        {<Link to={/editschedule/+ this.props.match.params.empId} className="btn button-link">
                                Редактирование графика
                        </Link>}
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

export default connect (mapStateToProps) (EmpInfo);