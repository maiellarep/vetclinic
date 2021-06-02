import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
//import './newPet.css';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {Link} from 'react-router-dom';

class RegistedAppointments extends React.Component {
    constructor(props) {
        super(props);
  
        this.handleChange = this.handleChange.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.state = {
            selectedDate: new Date(),
            calendarDate: new Date(),
            appointsList: [],
            clientName: '',
            petName: ''
        }
    }

    changeDate(date) {
        let appointments = []
        const db = firebase.database();
        const ref = db.ref('employees/' + this.props.login.uid + '/appointments/' + moment(date).format('YYYY-MM-DD'));

        ref.once('value', (snapshot) => {
            let arr = snapshot.val();

            for(let appoint in arr) {
                let clientName;
                let petName;
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
                }, 150)
            }
      
            setTimeout(() => {
                this.setState({
                    selectedDate: moment(date).format('YYYY-MM-DD'),
                    calendarDate: date,
                    appointsList: appointments
                })
            }, 150)
            
        })
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        if(this.props.login.isLogged === true) {
          return(
              <div className="container">
                    <h1>Расписание моих приемов</h1>
                    <div className="">
                        <Calendar className="calendar" value={this.state.calendarDate} onChange={this.changeDate}/>
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
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
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

export default connect (mapStateToProps) (RegistedAppointments);