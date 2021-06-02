import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
import {saveClientInfo} from '../../functions/index'

class EditClient extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.state = {
            clientName: '',
            phoneNumber: '',
            address: '',
            email: ''
        }
    }

    componentDidMount() {
        const db = firebase.database();
        db.ref('clients/' + this.props.match.params.clientId).once('value').then(snapshot => {
            this.setState ({
                clientName: snapshot.val().clientName,
                phoneNumber: snapshot.val().phoneNumber,
                address: snapshot.val().address,
                email: snapshot.val().email,
            });
        }); 
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleClick() {
        this.props.history.goBack();
    }

    pushdb(e) {
        e.preventDefault();
        saveClientInfo(this.props.match.params.clientId, this.state)
        .then(
            result => {
                alert("Данные клиента обновлены успешно");
                this.props.history.goBack();
            },
            error => alert(error)
        )
       /* firebase.database()
        .ref('clients/' + this.props.match.params.clientId).update({
            clientName: this.state.clientName,
            phoneNumber: this.state.phoneNumber,
            address: this.state.address,
            email: this.state.email
        }).then(() => {
            alert("Данные клиента обновлены успешно");
            this.props.history.goBack();
        });*/
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="container">
                    <h1>Редактирование информации о клиенте</h1>
                    <div className="form-container">
                        <form onSubmit={this.pushdb} className="form">
                        <input id="clientName" name="clientName" type="text" className="input" value={this.state.clientName} onChange={this.handleChange} required/>
                        <input id="address" name="address" type="text" className="input" value={this.state.address} onChange={this.handleChange} required/>
                        <input id="phoneNumber" name="phoneNumber" type="tel" pattern="[+]{1}[0-9]{12}" className="input" value={this.state.phoneNumber} onChange={this.handleChange} required/>
                        <input id="email" name="email" type="e-mail" className="input" value={this.state.email} onChange={this.handleChange} required/><br/>
                        <p className="btns">
                            <button className="btn green" type="button" onClick={this.handleClick}>Отмена</button>
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
    return {login: state.login, clients: state.clients}
}

export default connect (mapStateToProps) (EditClient);