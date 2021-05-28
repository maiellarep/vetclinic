import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.state = {
            empName: '',
            position: '',
            isAdmin: null
        }
    }

    componentDidMount() {

                const db = firebase.database();
                console.log(this.props.match.params.uid)
                db.ref('employees/' + this.props.match.params.uid).once('value').then(snapshot => {
                    this.setState ({
                        empName: snapshot.val().empName,
                        position: snapshot.val().position,
                        isAdmin: snapshot.val().isAdmin
                    });
                }); 
  
    }


    pushdb(e) {
        e.preventDefault();
        let data = {empName: this.state.empName,
            position: this.state.position,
            isAdmin: this.state.isAdmin}

            const newReference = firebase.database()
            .ref('employees/'+ this.props.match.params.uid)

            newReference
            .set(data).then(() => {
                alert("Данные профиля обновлены успешно");
                this.props.history.push('/employees');
            });
    }

    handleChange(e) {

        if(e.target.name === "isAdmin") {
            const {checked} = e.target
            console.log(e.target)
            this.setState({
                isAdmin: checked
              })
        }
        else {
            this.setState({[e.target.name]: e.target.value});
        }
       
    }

    handleClick() {
        this.props.history.goBack();
    }

    render() {
        if(this.props.login.isLogged === true) {
            if(this.props.login.isAdmin === true) {
                return(
                    <div className="container">
                        <h1>Редактирование профиля сотрудника</h1>
                        <div className="form-container">
                            <form onSubmit={this.pushdb} className="form">
                                <input id="empName" className="input" name="empName" type="text" placeholder="ФИО" value={this.state.empName} onChange={this.handleChange} required/>
                                <input id="position" className="input" name="position" type="text" placeholder="Должность" value={this.state.position} onChange={this.handleChange} required/>
                                <div className="checkbox-container"> 
                                    <p>Права администратора</p>
                                    <div>
                                        <input type="checkbox" className="checkbx" name="isAdmin" id="chkbtn1" defaultChecked={this.state.isAdmin} onChange={this.handleChange}/>
                                        <label htmlFor="chkbtn1" className="checkbox-label"></label>
                                    </div>  
                                </div>
                                <p className="btns">
                                    <button className="btn" type="button" onClick={this.handleClick}>Отмена</button>
                                    <button type="submit" className="btn">Изменить</button>
                                </p>
                            </form>
                        </div>
                    </div>
                );
            } else {
                return(
                    <div>
                        <h1>Данную страницу могут просматривать только администраторы</h1>
                    </div>
                )
            }
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

export default connect (mapStateToProps) (EditProfile);