import React from 'react';
import firebase from 'firebase';
import NewPet from './newPet';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';



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
        const userData = db.ref('clients/' + this.props.match.params.id).once('value', (snapshot) => {
            clientName = snapshot.val().clientName
            phoneNumber = snapshot.val().phoneNumber
            address = snapshot.val().address
            email = snapshot.val().email

            const p = db.ref('pets/'+this.props.match.params.id).once('value', (snapshot) =>
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
        firebase.database().ref('appointments/' + id).remove();
        firebase.database().ref('vaccination/' + id).remove();
        this.componentDidMount()
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div>
                    <div>ФИО: {this.state.clientName}</div>
                    <div>Адрес: {this.state.address}</div>
                    <div>Номер телефона: {this.state.phoneNumber}</div>
                    <div>E-mail: {this.state.email}</div>

                    <Link to={/addpet/+ this.props.match.params.id} class="link">
                        Новый питомец
                    </Link>

                    <div>Питомцы</div>
                    <form>
                    {this.state.pets.map((pet) => {
                            return (
                                <tr>
                                    <td>
                                    <Link to={/petinfo/+ this.props.match.params.id+"/"+pet.id} class="link">
                                                {pet.petName}
                                            </Link> 
                                    </td>
                                            
                                            <td>
                                            <Link to={/editpet/+ this.props.match.params.id+"/"+pet.id} class="link">
                                                Редактировать
                                            </Link>
                                            </td> 

                                            <td>
                                            <button type="button" onClick={() => this.delete(pet.id)}>Удалить</button>
                                            
                                        </td> 
                                    <div class="line"></div>
                                </tr>
                            )
                        })}
                        </form>
                    
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