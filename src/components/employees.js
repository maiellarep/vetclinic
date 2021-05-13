import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';


class Employees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            empInfo: []
        }
    }

    componentDidMount() {
        let allCl = [];
        const db = firebase.database();
        const cInfo = db.ref('employees/');

        cInfo.on('value', (snapshot) =>
        {
            let clients = snapshot.val();
            for(let client in clients)
            {
                allCl.push({
                    id: client,
                    empName: clients[client].empName,
                    position: clients[client].position
                });
            }
            this.setState({
                empInfo: allCl
            });
        });
    }

    render() {
        if(this.props.login.isLogged === true) {
            if(this.props.login.isAdmin === true) {
                return(
                    <div>
                        <h1>Сотрудники</h1>
                        <table>
                            {this.state.empInfo.map((cInfo) => {
                                return (
                                    <tr class="post">
                                            <td>
                                                <Link to={/employee/+ cInfo.id} class="link">
                                                    {cInfo.empName}
                                                </Link>
                                            </td>
                                            <td>
                                                {cInfo.position}
                                            </td>
                                            <td>
                                                <Link to={/editprofile/+ cInfo.id} class="link">
                                                    Редактировать
                                                </Link>
                                            </td>
                                                
                                        <div class="line"></div>
                                    </tr>
                                )
                            })}
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