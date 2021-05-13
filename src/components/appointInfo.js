import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';

class AppointInfo extends React.Component {
    constructor(props) {
        super(props);
   
  
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

        const appointData = db.ref('appointments/' + this.props.match.params.petId + "/" + this.props.match.params.appointId).once('value').then(snapshot => {
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

    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div>
                    <label>Дата</label><br/>
                    <div>{this.state.date}</div>
                    <label>Доктор</label><br/>
                    <div>{this.state.doctor}</div>
                    <label>Анамнез</label><br/>
                    <div>{this.state.anamnesis}</div>
                    <label>Диагноз</label><br/>
                    <div>{this.state.diagnosis}</div>
                    <label>Рекоммендации</label><br/>
                    <div>{this.state.recommendations}</div>
                    <label>Информация о приеме</label><br/>
                    <div>{this.state.appointInfo}</div>
                
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