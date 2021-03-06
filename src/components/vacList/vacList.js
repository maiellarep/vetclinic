import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
import './vacList.css'
import moment from 'moment';
import {today} from '../../functions/index'

class VacList extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.pushdb = this.pushdb.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {
            vaccineList: [],
            vacName: '',
            vacDate: '',
            today: '',
            nextVacDate: ''
        }
    }

    componentDidMount() {
        const db = firebase.database();
        let vacArr = []
        db.ref('vaccination/' + this.props.match.params.petId).once('value', snapshot => {
            let appointments = snapshot.val();
            for(let a in appointments)
            {
                vacArr.push({
                    id: a,
                    date: appointments[a].date,
                    vacName: appointments[a].vacName
                });
            }

            let sortedArray  = vacArr.sort((a,b) => new moment(a.date).format('YYYYMMDD') - new moment(b.date).format('YYYYMMDD'))
            const nextVacDate = moment(sortedArray[sortedArray.length-1].date.split('.').reverse().join('-')).add(1, 'years').format('DD.MM.YYYY')

            this.setState({
                vaccineList: vacArr,
                vacDate: today(),
                today: today(),
                nextVacDate: nextVacDate
            });
        });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleClick() {
        this.props.history.goBack();
    }
    
    pushdb(e) {
        e.preventDefault();
        const newReference = firebase.database()
        .ref('vaccination/'+this.props.match.params.petId)
        .push()

        const newItem = {
            id: newReference.key,
            date: this.state.vacDate.split('-').reverse().join('.'),
            vacName: this.state.vacName
        };

        newReference
        .set({
            date: this.state.vacDate.split('-').reverse().join('.'),
            vacName: this.state.vacName
        });
 
        this.setState(state => ({
            vaccineList: state.vaccineList.concat(newItem),
            vacName: ''
          }));
    }

    handleDelete(id) {
        firebase.database().ref('vaccination/' + this.props.match.params.petId + '/' + id).remove();
        this.setState((prevState) => {
            return {
                ...prevState,
            vaccineList: prevState.vaccineList.filter(el => el.id !== id)
            }
            
        });
    }



    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div className="container">
                    <h1>???????????????????? ?? ??????????????????</h1>
                    <div>
                        <h4 className="next-vaccine">???????? ?????????????????? ????????????????????: {this.state.nextVacDate}</h4>
                    </div>
                    <form onSubmit={this.pushdb} className="form-container vac-form">
                        <div className="vac-title">?????????? ????????????????????</div>
                        <label className="pet-label">???????????????? ??????????????</label>
                        <input id="vacName" className="input input-vac" name="vacName" type="text" value={this.state.vacName} onChange={this.handleChange} required/>
                        <label className="pet-label">???????? ??????????????????</label>
                        <input className="input input-vac" name="vacDate" type="date" max={this.state.today} value={this.state.vacDate} onChange={this.handleChange} required/>
                        <p className="btns">
                            <button type="button" className="btn" onClick={this.handleClick}>??????????</button>
                            <button className="btn" type="submit">????????????????</button>
                        </p>
                    </form>
                    <div className="vac-table">
                    <h3>?????????????? ????????????????????</h3>
                    <table className="tablelst">
                        <thead>
                            <tr>
                                <th>???????? ????????????????????</th>
                                <th>???????????????? ??????????????</th>
                                <th>????????????????</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.vaccineList.map((cInfo) => {
                                return (
                                    <tr className="post" key={cInfo.id}>
                                        <td>
                                            {cInfo.date}
                                        </td>
                                        <td>
                                            {cInfo.vacName}
                                        </td>
                                        <td>
                                            <i onClick={() => this.handleDelete(cInfo.id)} className="link material-icons">delete</i>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                    

                </div>
            );
        } else {
            return(
                <div>
                    <h1>?????? ?????????????????? ???????? ???????????????? ???? ???????????? ?????????? ?? ??????????????</h1>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {login: state.login}
}

export default connect (mapStateToProps) (VacList);