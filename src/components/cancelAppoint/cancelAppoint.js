import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
//import './newPet.css';
import moment from 'moment';
//import './registry.css'
import {Link} from 'react-router-dom';

class CancelAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.dateSelection = this.dateSelection.bind(this);
        this.chooseVet = this.chooseVet.bind(this);
        this.state = {
            employees: [],
            suggestedTime: [], 
            selectedVet: '',
            selectedDate: '',
            selectedTime: '',
            appointsList: []
        }
    }

    pushdb(e) {
        e.preventDefault();
        const db = firebase.database();
        db.ref('employees/' + this.state.selectedVet + '/appointments/' + this.state.registryDate + '/' + this.state.selectedTime).remove()
    }

    dateSelection(e) {
        let date = e.target.value
        let vetList = []
        let day = moment(date).format('dddd');
        const db = firebase.database();
        const employees = db.ref('employees/');
        employees.on('value', (snapshot)=> {
            let empList = snapshot.val()
            for(let emp in empList) {
                if(empList[emp].schedule.includes(day) && empList[emp].position === 'Ветеринар' && empList[emp].status === 'active') {
                    vetList.push({
                        id: emp,
                        empName: empList[emp].empName
                    })
                }

                this.setState({
                    selectedDate: date,
                    employees: vetList
                })
            }
        })
    }

    chooseVet(e) {
        const db = firebase.database();
        const ref = db.ref('employees/'+e.target.value+'/appointments/'+this.state.selectedDate);
        let appointments = []
        ref.once('value', (snapshot) => {
            let arr = snapshot.val();
            for(let appoint in arr) {
                let petName;
                let clientName;
                const ref2 = firebase.database().ref('pets/' + arr[appoint].clientId + '/' + arr[appoint].petId + '/petName');
                const ref3 = firebase.database().ref('clients/' + arr[appoint].clientId + '/clientName');
                ref2.on('value', (snapshot3)=> {
                    petName = snapshot3.val()   
                })
                ref3.on('value', (snapshot2) => {
                    clientName = snapshot2.val(); 
                })

                setTimeout(() => {
                    appointments.push({
                        time: appoint,
                        clientId: arr[appoint].clientId,
                        petId: arr[appoint].petId,
                        clientName: clientName,
                        petName: petName
                    });
                }, 250)
            }
            setTimeout(() => {
                this.setState({
                    selectedVet: e.target.value,
                    appointsList: appointments
                })
            }, 250)
        })   
    }

    delAppoint(time) {
        const db = firebase.database();
        db.ref('employees/' + this.state.selectedVet + '/appointments/' + this.state.selectedDate + '/' + time).remove()
        this.setState((prevState) => {
            return {
                ...prevState,
            appointsList: prevState.appointsList.filter(el => el.time !== time)
            }
            
        });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="container">
                    <h1>Регистратура</h1>
                    <div className="form-container pet-container">
                        <form onSubmit={this.pushdb} className="form">
                            <label>Дата приема</label>
                            <input id="registryDate" name="registryDate" type="date" className="pet-input" value={this.state.selectedDate} onChange={this.dateSelection} required pattern="[0-9]{2}.[0-9]{2}.[0-9]{4}"/>
                            <label>Ветеринар</label>
                            <select name = "selectedVet" className="pet-input" onChange = {this.chooseVet}>
                                <option key="default">Выберите ветеринара</option>
                                {this.state.employees.map((employee) =>{
                                    return(
                                        <option value={employee.id} key={employee.id}>{employee.empName}</option>
                                    ) 
                                })}
                            </select>
                        </form>
                    </div>

                    {this.state.appointsList.length === 0 ? (
                            <div>На этот день ещё никто не записался</div>
                        ) : (
                            <div>
                                <table className="tablelst">
                                    <thead>
                                        <tr>
                                            <th>Время</th>
                                            <th>Клиент</th>
                                            <th>Питомец</th>
                                            <th>Действие</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.appointsList.map((info) => {
                                            return (
                                                <tr key={info.time}>
                                                    <td>
                                                        {info.time}
                                                    </td> 
                                                    <td>
                                                        <Link to={/client/+ info.clientId} className="link">
                                                            {info.clientName}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <Link to={/petinfo/+ info.clientId + '/' + info.petId} className="link">
                                                            {info.petName}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <i onClick={() => this.delAppoint(info.time)} className="link material-icons">delete</i>
                                                    </td>   
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>)}
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

export default connect (mapStateToProps) (CancelAppointment);
