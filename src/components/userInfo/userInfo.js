import React from 'react';
import {connect} from 'react-redux';
import {boolToWord} from '../../functions/index.js';
import ChangePass from '../changePass/changePass';
import './userInfo.css';
import {momentToDay} from '../../functions/index'



class UserInfo extends React.Component {
    render() {
        if(this.props.login.isLogged === true) {
            let admin = boolToWord(this.props.login.isAdmin);
            return(
                <div className="container">
                    <h1>Мой профиль</h1>
                    <div className="info-container">
                        <div className="info-text">ФИО: {this.props.login.empName}</div>
                        <div className="info-text">E-mail: {this.props.login.email}</div>
                        <div className="info-text">Должность: {this.props.login.position}</div>
                        <div className="info-text">Права администратора: {admin}</div>
                        <div className="info-text">Рабочие дни: {this.props.login.schedule.map(momentToDay).join(', ')}</div>
                    </div>
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