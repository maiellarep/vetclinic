import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
import './appointInfo.css';

class AppointInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            date: null,
            anamnesis: '',
            diagnosis: '',
            recommendations: '',
            appointInfo: '',
            doctor: ''
        }
    }

    componentDidMount() {
        const db = firebase.database();
        db.ref('appointments/' + this.props.match.params.petId + "/" + this.props.match.params.appointId).once('value').then(snapshot => {
            this.setState({
                date: snapshot.val().date,
                anamnesis: snapshot.val().anamnesis,
                diagnosis: snapshot.val().diagnosis,
                recommendations: snapshot.val().recommendations,
                appointInfo: snapshot.val().appointInfo,
                doctor: snapshot.val().doctor
            })   
        });
    }

    handleClick() {
        this.props.history.goBack();
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="container">
                    <h1>Детали приема</h1>
                    <div className="form-container">
                        <div className="data-row">
                            <div className="data-title">Дата:</div>
                            <div>{this.state.date}</div>
                        </div>
                        <div className="data-row">
                            <div className="data-title">Доктор:</div>
                            <div>{this.state.doctor}</div>
                        </div>
                        <div className="data-row">
                            <div className="data-title">Анамнез:</div>
                            <div>{this.state.anamnesis}</div>
                        </div>
                        <div className="data-row">
                            <div className="data-title">Диагноз:</div>
                            <div>{this.state.diagnosis}</div>
                        </div>
                        <div className="data-row">
                            <div className="data-title">Рекоммендации:</div>
                            <div>{this.state.recommendations}</div>
                        </div>
                        <div className="data-row">
                            <div className="data-title">Информация о приеме:</div>
                            <div>{this.state.appointInfo}</div>
                        </div>
                        <button type="button" className="btn single-button" onClick={this.handleClick}>Вернуться назад</button>
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

export default connect (mapStateToProps) (AppointInfo);