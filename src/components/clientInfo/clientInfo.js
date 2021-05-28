import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './clientInfo.css';


class ClientInfo extends React.Component {
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this)
        this.state = {
            clientName: '',
            phoneNumber: '',
            address: '',
            email: '',
            pets: []
        }
    }

    componentDidMount() {
        const db = firebase.database();
        let clientName, phoneNumber, address, email
        let pets = []
        db.ref('clients/' + this.props.match.params.id).once('value', (snapshot) => {
            clientName = snapshot.val().clientName
            phoneNumber = snapshot.val().phoneNumber
            address = snapshot.val().address
            email = snapshot.val().email

            db.ref('pets/'+this.props.match.params.id).once('value', (snapshot) =>
            {
                let data = snapshot.val();
                for(let pet in data)
                {
                    pets.push({
                        id: pet,
                        petName: data[pet].petName
                    });
                }

                this.setState ({
                    clientName: clientName,
                    phoneNumber: phoneNumber,
                    address: address,
                    email: email,
                    pets: pets
                });
            });
        }); 
    }

    delete(id) {
        firebase.database().ref('pets/' + this.props.match.params.id + '/' + id).remove();
        firebase.storage().ref().child('images/'+ id).delete();
        firebase.database().ref('appointments/' + id).remove();
        firebase.database().ref('vaccination/' + id).remove();
        this.setState((prevState) => {
            return {
                ...prevState,
            pets: prevState.pets.filter(el => el.id !== id)
            }
            
        });
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div>
                    <h1>Страница клиента</h1>
                    <div className="container uinfo-container form-container">
                        <div className="client-info info-box ">
                            <div className="box-title">Информация о клиенте</div>
                            <div className="data">
                            <div><b>ФИО:</b> {this.state.clientName}</div>
                            <div><b>Адрес:</b> {this.state.address}</div>
                            <div><b>Номер телефона:</b> {this.state.phoneNumber}</div>
                            <div><b>E-mail:</b> {this.state.email}</div>
                            </div>
                        </div>
                        <div className="client-pets info-box">
                            <div className="box-title">Питомцы клиента</div> 
                            <div className="data">
                                <table className="pets-table">
                                    {this.state.pets.map((pet) => {
                                        return (
                                            <tr key={pet.id}>
                                                <td>
                                                    <Link to={/petinfo/+ this.props.match.params.id+"/"+pet.id} className="link pet-name">
                                                        {pet.petName}
                                                    </Link> 
                                                </td>        
                                                <td>
                                                    <Link to={/editpet/+ this.props.match.params.id+"/"+pet.id} className="link material-icons">
                                                        edit
                                                    </Link>
                                                </td> 
                                                <td>
                                                    <i className="link material-icons" onClick={() => this.delete(pet.id)}>delete</i>    
                                                </td> 
                                            </tr>
                                        )
                                    })}
                                </table>
                                <Link to={/addpet/+ this.props.match.params.id} className="btn newpet">
                                    Новый питомец
                                </Link>
                            </div> 
                        </div>
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

export default connect (mapStateToProps) (ClientInfo);