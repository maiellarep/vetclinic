import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class PetInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img: null,
            petName: '',
            species: '',
            breed: '',
            color: '',
            sex: '',
            birthDate: '',
            appoints: []
        }
    }

    componentDidMount() {
        var storageRef = firebase.storage().ref();
        storageRef.child('images/' + this.props.match.params.petId).getDownloadURL().then((url) => {
            this.setState({img: url});
        });

        const db = firebase.database();
        const userData = db.ref('pets/' + this.props.match.params.ownerId + "/" + this.props.match.params.petId).once('value').then(snapshot => {
            this.setState ({
                petName: snapshot.val().petName,
                species: snapshot.val().species,
                breed: snapshot.val().breed,
                color: snapshot.val().color,
                sex: snapshot.val().sex,
                birthDate: snapshot.val().birthDate
            });
        });

        const appointsRef = db.ref('appointments/' + this.props.match.params.petId);
        let appointsArr = []
        appointsRef.on('value', snapshot => {
            let appointments = snapshot.val();
                for(let a in appointments)
                {
                    appointsArr.push({
                        id: a,
                        date: appointments[a].date,
                        anamnesis: appointments[a].anamnesis,
                        diagnosis: appointments[a].diagnosis
                    });
                }
                this.setState({
                    appoints: appointsArr
                });
        });
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div>
                    <div>
                        Фото животного (jpeg/png)
                        <img src={this.state.img}></img>
                    </div>
                    <div>Кличка: {this.state.petName}</div><br/>
                    
                    <div>Вид: {this.state.species}</div><br/>
                    
                    <div>Порода: {this.state.breed}</div><br/>
                
                    <div>Окрас: {this.state.color}</div><br/>
                
                    <div>Пол: {this.state.sex}</div><br/>
                
                    <div>Дата рождения: {this.state.birthDate}</div><br/>
                    <Link to={/newappointment/+ this.props.match.params.petId} class="link">
                                                Новая запись в приемах
                    </Link> 
                    
                    <div>Приемы</div>
                    <table>
                        {this.state.appoints.map((cInfo) => {
                            return (
                                <tr class="post">
                                        <td>
                                            <Link to={/appointinfo/+ this.props.match.params.petId + "/" + cInfo.id} class="link">
                                                {cInfo.date}
                                            </Link>
                                        </td>
                                        <td>
                                            {cInfo.anamnesis}
                                        </td>
                                        <td>
                                            {cInfo.diagnosis}
                                        </td> 
                                    <div class="line"></div>
                                </tr>
                            )
                        })}
                    </table>

                    <Link to={/vacList/+ this.props.match.params.petId} class="link">
                        Карта прививок
                    </Link>
                    
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

export default connect (mapStateToProps) (PetInfo);