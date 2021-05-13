import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
import {updateClients} from '../actions/index.js';

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
        console.log(this.props.match.params.clientId)
        const userData = db.ref('clients/' + this.props.match.params.clientId).once('value').then(snapshot => {
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
        this.props.history.push('/')
    }

    pushdb() {

       let obj = {
            id: this.props.match.params.clientId,
            clientName: this.state.clientName,
            phoneNumber: this.state.phoneNumber,
            address: this.state.address,
            email: this.state.email
        }
        
        this.updateRedux(obj);

        let newReference = firebase.database()
        .ref('clients/' + this.props.match.params.clientId).update({
            clientName: this.state.clientName,
            phoneNumber: this.state.phoneNumber,
            address: this.state.address,
            email: this.state.email
        });

        

        
        console.log(this.props.clients)
        this.props.history.push("/")
        
        
    }

    updateRedux = (client) => {
        console.log(this.props.clients)
        this.props.updateClients(client);
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div>
                    <label>ФИО</label><br/>
                    <input id="clientName" name="clientName" type="text" value={this.state.clientName} onChange={this.handleChange} required/><br/>
                    <label>Адрес</label><br/>
                    <input id="address" name="address" type="text" value={this.state.address} onChange={this.handleChange} required/><br/>
                    <label>Телефон</label><br/>
                    <input id="phoneNumber" name="phoneNumber" type="tel" pattern="[+]{1}[0-9]{12}" value={this.state.phoneNumber} onChange={this.handleChange} required/><br/>
                    <label>E-mail</label><br/>
                    <input id="email" name="email" type="e-mail" value={this.state.email} onChange={this.handleChange} required/><br/>
                    <p><button class="btn green" type="button" onClick={this.handleClick}>Отмена</button>
                    <button type="button" class="btn green" onClick={this.pushdb}>Изменить</button></p>
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

const mapDispatchToProps =
{
  updateClients
}

export default connect (mapStateToProps, mapDispatchToProps) (EditClient);