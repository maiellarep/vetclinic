import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';

class EditPet extends React.Component {
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
            newImg: null
        }
    }

    componentDidMount() {
        var storageRef = firebase.storage().ref();
        storageRef.child('images/' + this.props.match.params.petId).getDownloadURL().then((url) => {
            this.setState({img: url});
        });

        const db = firebase.database();
        const userData = db.ref('pets/' + this.props.match.params.ownerId + "/" + this.props.match.params.petId).once('value').then(snapshot => {
            this.setState ({
                petName: snapshot.val().petName,
                species: snapshot.val().species,
                breed: snapshot.val().breed,
                color: snapshot.val().color,
                sex: snapshot.val().sex,
                birthDate: snapshot.val().birthDate
            });
        });
    }

    uploadImage(e) {
        const value = e.target.value;
        if(e.target.files[0].type != 'image/png' && e.target.files[0].type != 'image/jpg' && e.target.files[0].type != 'image/jpeg') {
        alert("Неправильный тип файла!");
        this.setState({newImg: null});
        }

        else {
           // let reader = new FileReader();
            //reader.readAsBinaryString(e.target.files[0]);
            //reader.onload = function(e) {

           // }
            this.setState({newImg: e.target.files[0],
                img: URL.createObjectURL(e.target.files[0])});//reader.readAsBinaryString(e.target.files[0])});

        }
    }
    pushdb() {
        const newReference = firebase.database()
        .ref('pets/'+this.props.match.params.ownerId + "/" + this.props.match.params.petId)
  

        newReference
        .set({
            petName: this.state.petName,
            species: this.state.species,
            breed: this.state.breed,
            color: this.state.color,
            sex: this.state.sex,
            birthDate: this.state.birthDate.split("-").reverse().join("."),
        });

        if(this.state.newImg != null) {
            var storageRef = firebase.storage().ref();
            var file = this.state.newImg;
    
        var metadata = {
        contentType: this.state.newImg.type,
      };
    
      var uploadTask = storageRef.child('images/' + this.props.match.params.petId).put(file, metadata);
    
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
        }
      });
        }
    }

    handleClick() {

    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
      
    }

    render() {
        if(this.props.login.isLogged === true) {
            return(
                <div>
                    <img src={this.state.img}/>
                    <div>
                        Фото животного (jpeg/png)
                        <input type="file" name="image" id="articleimg" class="" accept=".png,.jpg" onChange = {this.uploadImage}/>
                    </div>
                    <label>Кличка</label><br/>
                    <input id="petName" class="input_1" name="petName" type="text" value={this.state.petName} onChange={this.handleChange} required/><br/>
                    <label>Вид</label><br/>
                    <input id="species" class="input_1" name="species" type="text" value={this.state.species} onChange={this.handleChange} required/><br/>
                    <label>Порода</label><br/>
                    <input id="breed" class="input_1" name="breed" type="text" value={this.state.breed} onChange={this.handleChange} required/><br/>
                    <label>Окрас</label><br/>
                    <input id="color" class="input_1" name="color" type="text" value={this.state.color} onChange={this.handleChange} required/><br/>
                    <label>Пол</label><br/>
                    <select class = "selecttag" name = "sex" onChange = {this.handleChange}>
                        <option value = "Самец">Самец</option>
                        <option value = "Самка">Самка</option>
                    </select><br/>
                    <label>Дата рождения</label><br/>
                    <input id="birthDate" class="input_1" name="birthDate" type="date" value={this.state.birthDate} onChange={this.handleChange} required pattern="[0-9]{2}.[0-9]{2}.[0-9]{4}"/><br/>
                    <button class="btn green" type="button" onClick={this.pushdb}>Добавить</button>
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

export default connect (mapStateToProps) (EditPet);