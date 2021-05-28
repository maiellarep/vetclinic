import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
import './newAppointment.css'

class NewAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
  
        this.state = {
            date: null,
            anamnesis: '',
            diagnosis: '',
            recommendations: '',
            appointInfo: '',
            doctor: ''
        }
    }

    pushdb(e) {
        e.preventDefault();
        const newReference = firebase.database()
        .ref('appointments/'+this.props.match.params.petId)
        .push()

        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();

        newReference
        .set({
            date: day + "." + month + "." + year,
            anamnesis: this.state.anamnesis,
            diagnosis: this.state.diagnosis,
            recommendations: this.state.recommendations,
            appointInfo: this.state.appointInfo,
            doctor: this.props.login.empName
        }).then(() => {
            alert("Данные о приеме были добавлены успешно")
            this.props.history.goBack();
        });
    }

    handleClick() {
        this.props.history.goBack();
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="container">
                    <h1>Новый прием</h1>
                    <div className="form-container pet-container">
                        <form onSubmit={this.pushdb} className="form">
                            <input id="anamnesis" className="input" name="anamnesis" type="text" placeholder="Анамнез" value={this.state.anamnesis} onChange={this.handleChange} required/>
                            <input id="diagnosis" clclassNameass="input" name="diagnosis" type="text" placeholder="Диагноз" value={this.state.diagnosis} onChange={this.handleChange} required/>
                            <input id="recommendations" className="input" name="recommendations" type="text" placeholder="Рекоммендации" value={this.state.recommendations} onChange={this.handleChange} required/>
                            <textarea id="appointInfo" className="input inpt-textarea" name="appointInfo" type="text" placeholder="Информация о приеме" value={this.state.appointInfo} onChange={this.handleChange} required></textarea>
                            <p className="btns"><button className="btn" type="button" onClick={this.handleClick}>Отмена</button>
                            <button type="submit" className="btn">Добавить</button></p>
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

export default connect (mapStateToProps) (NewAppointment);