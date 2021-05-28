import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
//import './table.css';
import './employees.css';


class Employees extends React.Component {
    constructor(props) {
        super(props);
        this.changeStatus = this.changeStatus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            empInfo: [],
            render: false,
            pass: null,
            email: null
        }
    }

    componentDidMount() {
        let allCl = [];
        const db = firebase.database();
        const cInfo = db.ref('employees/');
        cInfo.once('value', (snapshot) =>
        {  
            let clients = snapshot.val();
            for(let client in clients)
            {
                allCl.push({
                    id: client,
                    empName: clients[client].empName,
                    position: clients[client].position,
                    status: clients[client].status
                });
            }
            this.setState({
                empInfo: allCl
            });
        });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    changeStatus(uid, index) {
        let newStatus;
        if(this.state.empInfo[index].status === "active") {
            newStatus = "blocked"
        } else {
            newStatus = "active"
        }
        let newState = this.state.empInfo
        newState[index].status = newStatus

        this.setState({
            empInfo: [...newState]
          });
        const db = firebase.database();
        db.ref('employees/' + uid).update(
            {status: newStatus}   
        ); 
    }


    render() {
        if(this.props.login.isLogged === true) {
            if(this.props.login.isAdmin === true) {
                return(
                    <div className="container">
                        <h1>Сотрудники</h1>
                        <table className="tablelst">
                            <thead>
                                <tr>
                                    <th>ФИО</th>
                                    <th>Должность</th>
                                    <th>Статус</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.empInfo.map((cInfo, index) => {
                                    return (
                                        <tr className="post" key={cInfo.id}>
                                            <td>
                                                {<Link to={/employee/+ cInfo.id} className="link">
                                                    {cInfo.empName}
                                                </Link>}
                                            </td>
                                            <td>
                                                {cInfo.position}
                                            </td>
                                            <td>
                                                {cInfo.status === 'active' ? ("Активный") : ("Заблокированный")}
                                            </td>
                                            <td>
                                                <Link to={/editprofile/+ cInfo.id} className="link material-icons">
                                                    edit
                                                </Link>
                                                {<i onClick={() => this.changeStatus(cInfo.id, index)} className="link material-icons">
                                                    {cInfo.status === 'active' ? ("lock") : ("lock_open")}
                                                </i>}
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

export default connect (mapStateToProps) (Employees);