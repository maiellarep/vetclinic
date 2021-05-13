import React from 'react';
import firebase from 'firebase';
import {connect} from 'react-redux';

class NewVaccine extends React.Component {

    render() {
            return(
                <div>
                    <table>
                        {this.props.vaccineList.map((cInfo) => {
                            return (
                                <tr class="post">
                                        <td>
                            
                                                {cInfo.date}
                                        
                                        </td>
                                        <td>
                                            {cInfo.vacName}
                                        </td>
                
                                    <div class="line"></div>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            );
    }
}


export default NewVaccine;