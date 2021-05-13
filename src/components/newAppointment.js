import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';

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

    pushdb() {
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
        });

 
    }

    handleClick() {

    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div>
                    <label>Анамнез</label><br/>
                    <input id="anamnesis" class="input_1" name="anamnesis" type="text" value={this.state.anamnesis} onChange={this.handleChange} required/><br/>
                    <label>Диагноз</label><br/>
                    <input id="diagnosis" class="input_1" name="diagnosis" type="text" value={this.state.diagnosis} onChange={this.handleChange} required/><br/>
                    <label>Рекоммендации</label><br/>
                    <input id="recommendations" class="input_1" name="recommendations" type="text" value={this.state.recommendations} onChange={this.handleChange} required/><br/>
                    <label>Информация о приеме</label><br/>
                    <textarea id="appointInfo" class="input_1" name="appointInfo" type="text" value={this.state.appointInfo} onChange={this.handleChange} required></textarea><br/>
                    
                    <button class="btn green" type="button" onClick={this.pushdb}>Добавить</button>
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