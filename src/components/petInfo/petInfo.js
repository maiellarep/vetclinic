import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
//import './table.css';
import './petInfo.css';

class PetInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
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
        db.ref('pets/' + this.props.match.params.ownerId + "/" + this.props.match.params.petId).once('value').then(snapshot => {
            this.setState ({
                petName: snapshot.val().petName,
                species: snapshot.val().species,
                breed: snapshot.val().breed,
                color: snapshot.val().color,
                sex: snapshot.val().sex,
                birthDate: snapshot.val().birthDate
            });
        });
    }

    handleClick() {
        this.props.history.goBack();
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="">
                    <h1>Информация о животном</h1>
                    <div className="container form-container">
                        <div className="">
                            <div className="">
                                <img src={this.state.img} alt="Фото животного" className="pet-photo"></img>
                            </div>
                            <div className="pet-info-div">
                                <div><b>Кличка:</b> {this.state.petName}</div>  
                                <div><b>Вид:</b> {this.state.species}</div>  
                                <div><b>Порода:</b> {this.state.breed}</div>
                                <div><b>Окрас:</b> {this.state.color}</div>
                                <div><b>Пол:</b> {this.state.sex}</div>
                                <div><b>Дата рождения:</b> {this.state.birthDate}</div>
                                <p className="btns pet-info-btns">
                                    <button type="button" className="btn" onClick={this.handleClick}>Назад</button>
                                    <Link to={/appointslist/+ this.props.match.params.petId} className="btn button-link petinfo-btn">
                                        Медицинская карта
                                    </Link>
                                    <Link to={/vacList/+ this.props.match.params.petId} className="btn button-link petinfo-btn">
                                        Карта прививок
                                    </Link>
                                </p>
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

export default connect (mapStateToProps) (PetInfo);