import React from 'react';
import firebase from 'firebase';
//import './css/Menu.css';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import '../css/menu.css'


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            uid: ''
        }
    }

    /*componentDidMount() {

        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
              this.setState({uid : user.uid}); 
            } else {
              this.setState({uid: null});
            }
        });
    };*/

    logout(e) {
        //firebase.auth().signOut();
        firebase.auth().signOut();
        this.props.history.push('/');
        //this.context.router.push('/');
    }
    
    render() {
        if(this.props.login.isLogged == false) {
            return(
                <div >
                <nav class="menu-container">
             
                        <ul class="Navigation">
                            <li><Link to='/'>Главная страница</Link> </li>
                            <li><Link to='/login'>Вход</Link></li>
                        </ul>
                
                </nav>
                </div>
            );
        }
        else {
            return(


                        <ul class="Navigation col-lg-12 mx-auto">
                            <li><Link to='/'>Главная страница</Link></li>
                            <li><Link to='/addclient'>Добавить клиента</Link></li>
                            <li><Link to='/profile'>Профиль</Link></li>
                            <li><a href='' onClick={this.logout}>Выход</a></li>
                        </ul>
            
            );
        }
    } 
}

const mapStateToProps = (state) => {
    return {login: state.login}
}

export default connect (mapStateToProps) (Menu);
