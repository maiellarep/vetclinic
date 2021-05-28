import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './menu.css'


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            uid: ''
        }
    }

    logout(e) {
        firebase.auth().signOut();
        this.props.history.push('/login');
    }
    
    render() {
        if(this.props.login.isLogged === false) {
            return(
                <div>
                    <nav className="menu-container">
                        <ul className="Navigation">
                            <li><Link to='/'>Главная страница</Link> </li>
                            <li><Link to='/login'>Вход</Link></li>
                        </ul>
                    
                    </nav>
                </div>
            );
        }
        else {
            if(this.props.login.isAdmin === true) { 
                return(
                    <ul className="Navigation">
                        <li><Link to='/'>Главная страница</Link></li>
                        <li><Link to=''>Добавление</Link>
                            <ul>
                                <li><Link to='/addclient'>Добавить клиента</Link></li>
                                <li><Link to='/addemployee'>Добавить пользователя</Link></li>
                            </ul>
                        </li>
                        <li><Link to='/employees'>Сотрудники</Link></li>
                        <li><Link to='/cancelappoint'>Регистратура</Link></li>
                        <li><Link to='/profile'>Профиль</Link></li>
                        <li><a href='/login' onClick={this.logout}>Выход</a></li>
                    </ul>
                );
            } 
            else if(this.props.login.position !== "Администратор") {
                return(
                    <ul className="Navigation">
                        <li><Link to='/'>Главная страница</Link></li>
                        <li><Link to='/addclient'>Добавить клиента</Link></li>
                        <li><Link to='/profile'>Профиль</Link></li>
                        <li><Link to='/registedappoints'>Мои приемы</Link></li>
                        <li><a href='/login' onClick={this.logout}>Выход</a></li>
                    </ul>
                );
            }else {
                return(
                    <ul className="Navigation">
                        <li><Link to='/'>Главная страница</Link></li>
                        <li><Link to='/addclient'>Добавить клиента</Link></li>
                        <li><Link to='/profile'>Профиль</Link></li>
                        <li><a href='/login' onClick={this.logout}>Выход</a></li>
                    </ul>
                );
            }   
        }
    } 
}

const mapStateToProps = (state) => {
    return {login: state.login}
}

export default connect (mapStateToProps) (Menu);
