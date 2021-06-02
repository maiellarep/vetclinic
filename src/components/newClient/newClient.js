import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
import './newClient.css';
import {saveClientInfo} from '../../functions/index';

class NewClient extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.state = {
            clientName: '',
            phoneNumber: '',
            address: '',
            email: '',
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleClick() {
        this.props.history.goBack();
    }


    pushdb(e) {
        e.preventDefault();
        firebase.database()
        .ref('clients/')
        .push()
        .then((ref) => {
            console.log(ref.key)
            saveClientInfo(ref.key, this.state)
            .then(
            result => {
                alert('Клиент добавлен успешно')
                this.props.history.push('/')
            },
            error => alert(error)
        )
        })  
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="container">
                    <h1>Создание нового клиента</h1>
                    <div className="form-container">
                        <form onSubmit={this.pushdb} className="form">
                            <input id="clientName" name="clientName" type="text" className="input" placeholder="ФИО" value={this.state.clientName} onChange={this.handleChange} required/><br/>
                            <input id="address" name="address" type="text" className="input" placeholder="Адрес" value={this.state.address} onChange={this.handleChange} required/><br/>
                            <input id="phoneNumber" name="phoneNumber" type="tel" pattern="[+]{1}[0-9]{12}" className="input" placeholder="Телефон" value={this.state.phoneNumber} onChange={this.handleChange} required/><br/>
                            <input id="email" name="email" type="e-mail" className="input" placeholder="E-mail" value={this.state.email} onChange={this.handleChange} required/><br/>
                            <p className="btns">
                                <button className="btn" type="button" onClick={this.handleClick}>Отмена</button>
                                <button type="submit" className="btn">Добавить</button>
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
    return {login: state.login, clients: state.clients}
}

export default connect (mapStateToProps) (NewClient);