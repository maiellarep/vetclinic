import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './table.css';
import './appointList.css'
class AppointList extends React.Component {
    constructor(props) {
        super(props);
        this.delAppoint = this.delAppoint.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            appoints: []
        }
    }

    componentDidMount() {
        const db = firebase.database();
        const appointsRef = db.ref('appointments/' + this.props.match.params.petId);
        let appointsArr = []
        appointsRef.once('value', snapshot => {
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
                appoints: appointsArr.reverse()
            });
        });
    }

    delAppoint(id) {
        firebase.database().ref('appointments/' + this.props.match.params.petId + '/' + id).remove();
        this.setState((prevState) => {
            return {
                ...prevState,
                appoints: prevState.appoints.filter(el => el.id !== id)
            }
            
        });
    }

    handleClick() {
        this.props.history.goBack();
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="container">
                    <h1>Приемы</h1>
                    <div className="appoint-link-container">
                        <Link to={/newappointment/+ this.props.match.params.petId} className="link btn appoint-link">
                            Добавить новую запись
                        </Link> 
                        <button type="button" className="btn" onClick={this.handleClick}>Вернуться назад</button>
                    </div>
                    
                    <table className="tablelst">
                        <thead>
                            <tr>
                                <th>Дата приема</th>
                                <th>Анамнез</th>
                                <th>Диагноз</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.appoints.map((cInfo) => {
                                return (
                                    <tr key={cInfo.id}>
                                            <td>
                                                <Link to={/appointinfo/+ this.props.match.params.petId + "/" + cInfo.id} className="link">
                                                    {cInfo.date}
                                                </Link>
                                            </td>
                                            <td>
                                                {cInfo.anamnesis}
                                            </td>
                                            <td>
                                                {cInfo.diagnosis}
                                            </td> 
                                            <td>
                                                <i onClick={() => this.delAppoint(cInfo.id)} className="link material-icons">delete</i>
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
    return {login: state.login}
}

export default connect (mapStateToProps) (AppointList);