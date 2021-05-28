import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';
import './newPet.css';
import logo from '../../images/preview.png';
import {today} from '../../functions/index.js'

class NewPet extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.pushdb = this.pushdb.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.state = {
      img: null,
      petName: '',
      species: '',
      breed: '',
      color: '',
      sex: 'Самец',
      birthDate: '',
      preview: logo,
      maxDate: ''
    }
  }

  componentDidMount() {
    this.setState({maxDate: today()})
  }

  uploadImage(e) {
    if(e.target.files[0].type !== 'image/png' && e.target.files[0].type !== 'image/jpg' && e.target.files[0].type !== 'image/jpeg') {
      alert("Неправильный тип файла!");
      this.setState({img: null});
    }    
    else {
      this.setState({img: e.target.files[0],
      preview: URL.createObjectURL(e.target.files[0])});
    }
  }

  pushdb(e) {
    e.preventDefault();
    if(this.state.img !== null) {
      const newReference = firebase.database()
      .ref('pets/'+this.props.match.params.ownerId)
      .push()

      newReference
      .set({
            petName: this.state.petName,
            species: this.state.species,
            breed: this.state.breed,
            color: this.state.color,
            sex: this.state.sex,
            birthDate: this.state.birthDate.split("-").reverse().join("."),
      }).then(() => {
          alert("Данные о питомце были добавлены успешно");
          this.props.history.goBack();
      });
      var storageRef = firebase.storage().ref();
      var file = this.state.img;

      var metadata = {
      contentType: this.state.img.type,
      };

      var uploadTask = storageRef.child('images/' + newReference.key).put(file, metadata);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
              default:
                console.log('default');
                break;
          }
        }, function(error) {

        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
              alert("storage/unknown");
            break;
          default:
            console.log('unknown');
            break;
        }
      });
    }
    else {
      alert("Загрузите фото животного!")
    }
  }

  handleClick() {
    this.props.history.goBack()
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    if(this.props.login.isLogged === true) {
      return(
        <div className="container">
          <h1>Добавление животного</h1>
          <div className="form-container pet-container">
            <form onSubmit={this.pushdb} className="form">
              <div className="pet-file">
                  <img src={this.state.preview} alt="Фото животного" className="preview"/>
                  <input type="file" name="image" id="articleimg" className="" accept=".png,.jpg,.jpeg" onChange = {this.uploadImage}/>
              </div>
              <div className="main-pet-form">
              <label className="pet-label">Кличка</label>
              <input id="petName" className="pet-input" name="petName" type="text" value={this.state.petName} onChange={this.handleChange} required/>
              <label className="pet-label">Вид</label>
              <input id="species" className="pet-input" name="species" type="text" value={this.state.species} onChange={this.handleChange} required/>
              <label className="pet-label">Порода</label>
              <input id="breed" className="pet-input" name="breed" type="text" value={this.state.breed} onChange={this.handleChange} required/>
              <label className="pet-label">Окрас</label>
              <input id="color" className="pet-input" name="color" type="text" value={this.state.color} onChange={this.handleChange} required/>
              <label>Пол</label>
              <select name = "sex" className="pet-input" value={this.state.sex} onChange = {this.handleChange} required>
                  <option value = "Самец" key="Самец">Самец</option>
                  <option value = "Самка" key="Самка">Самка</option>
              </select>
              <label>Дата рождения</label>
              <input id="birthDate" name="birthDate" type="date" max="maxDate" className="pet-input" value={this.state.birthDate} onChange={this.handleChange} required pattern="[0-9]{2}.[0-9]{2}.[0-9]{4}"/>
              </div>          
              <p className="btns" >
                <button className="btn" type="button" onClick={this.handleClick}>Отмена</button>
                <button type="submit" className="btn">Добавить</button>
              </p>
            </form>
          </div>
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

export default connect (mapStateToProps) (NewPet);