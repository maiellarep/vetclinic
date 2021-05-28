import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
//import './newPet.css';
import moment from 'moment';
import {timeOptions, today} from '../../functions/index.js'
import './registry.css';

class Registry extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.dateSelection = this.dateSelection.bind(this);
        this.chooseVet = this.chooseVet.bind(this);
        this.state = {
            registryDate: '', 
            employees: [],
            suggestedTime: [], 
            selectedVet: '',
            selectedDate: '',
            selectedTime: '',
            minDate: '',
            pets: [],
            selectedPet: ''
        }
    }

    componentDidMount() {  
        let pets = []
        const db = firebase.database();
        const ref = db.ref('pets/' + this.props.match.params.clientId)

        ref.once('value').then((snapshot) => {
            let arr = snapshot.val()
            for(let pet in arr) {
                pets.push({
                    id: pet,
                    petName: arr[pet].petName
                })
            }

            this.setState({
                minDate: today(),
                pets: pets
            })
        })
        
    }

    pushdb(e) {
        e.preventDefault();
        if(this.state.selectedTime !== '') {
            const db = firebase.database();
            const ref = db.ref('employees/' + this.state.selectedVet + '/appointments/' + this.state.registryDate + '/' + this.state.selectedTime)
            ref.set({
                clientId: this.props.match.params.clientId,
                petId: this.state.selectedPet
            }).then(() => {
                alert('Запись на прием добавлена успешно');
            })
        } else {
            alert('Выберите время приема')
        }
    }

    dateSelection(e) {
        let date = e.target.value;
        let day = moment(date).format('dddd');
        let vetList = []
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
                    registryDate: date,
                    employees: vetList
                })
            }
        })
    }

    chooseVet(e) {
        let suggestedTime = timeOptions();
        const db = firebase.database();
        const appointsTime = db.ref('employees/'+e.target.value+'/appointments/'+this.state.registryDate);
        appointsTime.on('value', (snapshot) => {
            let val = snapshot.val();
            for(let item in val) {
                suggestedTime[item] = true;
            }

            this.setState({
                suggestedTime: suggestedTime,
                selectedVet: e.target.value
            })
        })
    }

    handleClick() {

    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        if(this.props.login.isLogged === true ) {
            if(this.props.login.isAdmin) {
                return(
                    <div className="container">
                        <h1>Запись на прием</h1>
                        <div className="form-container pet-container">
                            <form onSubmit={this.pushdb} className="form">
                                <label>Питомец</label>
                                <select name = "selectedPet" className="pet-input" onChange = {this.handleChange} required>
                                    <option>Выберите питомца</option>
                                    {this.state.pets.map((pet) =>{
                                        return(
                                            <option value={pet.id} key={pet.id}>{pet.petName}</option>
                                        ) 
                                    })}
                                </select>
                                <label>Дата приема</label>
                                <input id="registryDate" name="registryDate" type="date" min={this.state.minDate} className="pet-input" value={this.state.registryDate} onChange={this.dateSelection} required pattern="[0-9]{2}.[0-9]{2}.[0-9]{4}"/>
                                <label>Ветеринар</label>
                                <select name = "selectedVet" className="pet-input" onChange = {this.chooseVet} required>
                                    <option>Выберите ветеринара</option>
                                    {this.state.employees.map((employee) =>{
                                        return(
                                            <option value={employee.id} key={employee.id}>{employee.empName}</option>
                                        )
                                        
                                    })}
                                </select>
                                <div className="suggested-time">
                                    {Object.keys(this.state.suggestedTime).map((t) =>{
                                        return(
                                            <input type="button" name="selectedTime" className={this.state.selectedTime === t ? ("btn-input active") : ("btn-input")} disabled={this.state.suggestedTime[t]} onClick={this.handleChange} value={t} />
                                        )      
                                    })}
                                </div>
                                <button class="btn reg-btn" type="submit">Добавить</button>
                            </form>
                        </div>
                    </div>
                );
            }
            else {
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

export default connect (mapStateToProps) (Registry);