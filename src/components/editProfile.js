import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        //this.handleClick = this.handleClick.bind(this);
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
                const userData = db.ref('employees/' + this.props.match.params.uid).once('value').then(snapshot => {
                    this.setState ({
                        empName: snapshot.val().empName,
                        position: snapshot.val().position,
                        isAdmin: snapshot.val().isAdmin
                    });
                }); 
  
    }


    pushdb() {

        let data = {empName: this.state.empName,
            position: this.state.position,
            isAdmin: this.state.isAdmin}


            const newReference = firebase.database()
            .ref('employees/'+ this.props.match.params.uid)

            newReference
            .set(data);
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

    render() {
        if(this.props.login.isLogged === true) {
            if(this.props.login.isAdmin === true) {
                return(
                    <div>
                        <div>
                            <form>
                                <label>ФИО</label><br/>
                                <input id="empName" class="input_1" name="empName" type="text" value={this.state.empName} onChange={this.handleChange} required/><br/>
                                <label>Должность</label><br/>
                                <input id="position" class="input_1" name="position" type="text" value={this.state.position} onChange={this.handleChange} required/><br/>
                                <p><input type="checkbox" name="isAdmin" defaultChecked={this.state.isAdmin} onChange={this.handleChange}/>Права администратора</p>
                                <p><button class="btn green" type="button" onClick={this.handleClick}>Отмена</button>
                                <button type="button" class="btn green" onClick={this.pushdb}>Добавить</button></p>
                            
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