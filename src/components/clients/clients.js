import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {deleteClient} from '../../actions/index.js';
//import './table.css'
import './clients.css'


class Clients extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.delClient = this.delClient.bind(this);
        this.state = {
            searchQ: '',
            clientsInfo: []
        }
    }

    componentDidMount() {
        let allCl = [];
        const db = firebase.database();
        const cInfo = db.ref('clients/');

        cInfo.once('value', (snapshot) =>{
            let clients = snapshot.val();
            for(let client in clients)
            {
                allCl.push({
                    id: client,
                    clientName: clients[client].clientName,
                    address: clients[client].address,
                    phoneNumber: clients[client].phoneNumber,
                    email: clients[client].email
                });
            }

            this.setState({
                clientsInfo: allCl
            });
        });
    }

    delClient(id) {
        firebase.database().ref('clients/' + id).remove();
        firebase.database().ref('pets/' + id).once('value', snapshot => {
            let data = snapshot.val();
                for(let pet in data)
                {
                    firebase.storage().ref().child('images/'+ id).delete();
                    firebase.database().ref('appointments/' + pet).remove();
                    firebase.database().ref('vaccination/' + pet).remove();
                }
        });
        firebase.database().ref('pets/' + id).remove();
        this.setState((prevState) => {
            return {
                ...prevState,
            clientsInfo: prevState.clientsInfo.filter(el => el.id !== id)
            }  
        });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    tableContent() {
        let content = [];
        let tableContentValues = []
        if(this.state.searchQ === '') {
            content = this.state.clientsInfo
        }
        else {
            content = this.state.clientsInfo.filter(el => el.clientName.includes(this.state.searchQ) || el.address.includes(this.state.searchQ))
        }

        content.map((cInfo) => {
            return(
                tableContentValues.push (
                    <tr key={cInfo.id}>
                            <td>
                                <Link to={/client/+ cInfo.id} className="link">
                                    {cInfo.clientName}
                                </Link>
                            </td>
                            <td>
                                {cInfo.address}
                            </td>
                            <td>
                                <Link to={/editclient/+ cInfo.id} className="link material-icons">
                                edit
                                </Link>
                                <i onClick={() => this.delClient(cInfo.id)} className="link material-icons">delete</i>
                                {this.props.login.isAdmin ? (
                                    <Link to={/registry/+ cInfo.id} title="Запись на прием" className="link material-icons">
                                    event
                                    </Link>
                                ) : (<i></i>)}
                            </td> 
                    </tr>
                )
            )
            
        })

        return tableContentValues;
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="container">
                    <div className="row"> 
                        <h1>Happy Pets</h1>
                        <div className="search">
                            <input id="searchQ" name="searchQ" type="text" value={this.state.searchQ} onChange={this.handleChange} placeholder="Поиск по ФИО/адресу" required/>
                        </div>
                        <table className="tablelst">
                            <thead>
                                <tr>
                                    <th>ФИО</th>
                                    <th>Адрес</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.tableContent()}
                            </tbody>
                        </table>
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

const mapDispatchToProps =
{
    deleteClient
}

export default connect (mapStateToProps, mapDispatchToProps) (Clients);