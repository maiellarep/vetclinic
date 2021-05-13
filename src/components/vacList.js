import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import NewVaccine from './newVac'

class VacList extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.state = {
            vaccineList: [],
            vacName: ''
        }
    }

    componentDidMount() {


        const db = firebase.database();

        let appointsArr = []
        const vaccineRef = db.ref('vaccination/' + this.props.match.params.petId).once('value', snapshot => {
            let appointments = snapshot.val();
                for(let a in appointments)
                {
                    appointsArr.push({
                        id: a,
                        date: appointments[a].date,
                        vacName: appointments[a].vacName
                    });
                }
                this.setState({
                    vaccineList: appointsArr
                });
        });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleClick() {

    }
    
    pushdb() {
        const newReference = firebase.database()
        .ref('vaccination/'+this.props.match.params.petId)
        .push()

        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();

        const newItem = {
            id: newReference.key,
            date: day + "." + month + "." + year,
            vacName: this.state.vacName
        };

        newReference
        .set({
            date: day + "." + month + "." + year,
            vacName: this.state.vacName
        });
 
        this.setState(state => ({
            vaccineList: state.vaccineList.concat(newItem),
            vacName: ''
          }));
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div>
                    <div>Информация о вакинации</div>
                    <NewVaccine vaccineList={this.state.vaccineList}/>
                    <label>Название вакцины</label><br/>
                    <input id="vacName" class="input_1" name="vacName" type="text" value={this.state.vacName} onChange={this.handleChange} required/><br/>
                
                    
                    <button class="btn green" type="button" onClick={this.pushdb}>Добавить</button>
                    

                   { /*<Link to={/newvac/+ this.props.match.params.petId} class="link">
                        Добавить прививку
                    </Link>*/}
                    
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

export default connect (mapStateToProps) (VacList);