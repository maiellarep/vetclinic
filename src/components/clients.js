import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import {deleteClient} from '../actions/index.js';
import '../css/table.css'
import '../css/clients.css'


class Clients extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.delClient = this.delClient.bind(this)
        this.state = {
            searchQ: '',
            clientsInfo: []
        }
    }

    componentDidMount() {
        //let allCl = [];
        
      /*  } else {
            console.log("else")
            cInfo.orderByChild("clientName").equalTo(this.state.searchQ).on("child_added", function(snapshot) {
                console.log(snapshot)
                allCl.push({
                    id: snapshot.key,
                    clientName: snapshot.val().clientName,
                    address: snapshot.val().address,
                    phoneNumber: snapshot.val().phoneNumber,
                    email: snapshot.val().email
                });
               
              });
              this.setState({
                clientsInfo: allCl
            });
              
        }*/
    }

    delClient(id) {
        firebase.database().ref('clients/' + id).remove();
        firebase.database().ref('pets/' + id).once('value', snapshot => {
            let data = snapshot.val();
                for(let pet in data)
                {
                    firebase.database().ref('appointments/' + pet).remove();
                    firebase.database().ref('vaccination/' + pet).remove();
                }
        });
        firebase.database().ref('pets/' + id).remove();
        this.deleteRedux(id)
        this.props.history.push('/')
    }

    deleteRedux = (id) => {
        this.props.deleteClient(id);
        
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    search() {
        let allCl = [];
        const db = firebase.database();
        const cInfo = db.ref('clients/');
            
            if(this.state.searchQ === '') {
                this.componentDidMount()
            } else {
                cInfo.orderByChild("clientName").equalTo(this.state.searchQ).on("child_added", function(snapshot) {
                    console.log(snapshot)
                    allCl.push({
                        id: snapshot.key,
                        clientName: snapshot.val().clientName,
                        address: snapshot.val().address,
                        phoneNumber: snapshot.val().phoneNumber,
                        email: snapshot.val().email
                    });
                   
                  });
                  this.setState({
                    clientsInfo: allCl
                });
            }
        
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div>
                    <h1>Happy Pets</h1>
                    <div class="search">
                        <input id="searchQ" name="searchQ" type="text" value={this.state.searchQ} onChange={this.handleChange} placeholder="Иванов Иван Иванович" required/>
                        <button type="button" class="searchbtn fa fa-search" onClick={this.search}></button>
                    </div>
                    
                    <table class="tablelst">
                        <thead>
                            <td>ФИО</td>
                            <td>Адрес</td>
                            <td>Действие</td>
                        </thead>
                        <tbody>
                            {this.props.clients.map((cInfo) => {
                                return (
                                    <tr>
                                            <td>
                                                <Link to={/client/+ cInfo.id}>
                                                    {cInfo.clientName}
                                                </Link>
                                            </td>
                                            <td>
                                                {cInfo.address}
                                            </td>
                                            <td>
                                                <Link to={/editclient/+ cInfo.id} class="link material-icons">
                                                edit
                                                </Link>
                                                <i onClick={() => this.delClient(cInfo.id)} class="link material-icons">delete</i>
                                            </td> 
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
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