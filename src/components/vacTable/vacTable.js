import React from 'react';
import './table.css';
import './vacTable.css'

class VacTable extends React.Component {

    render() {
        return(
            <div className="vac-table">
                <h3>История вакцинаций</h3>
                <table className="tablelst">
                    <thead>
                        <tr>
                            <th>Дата вакцинации</th>
                            <th>Название вакцины</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.vaccineList.map((cInfo) => {
                            return (
                                <tr className="post" key={cInfo}>
                                    <td>
                                        {cInfo.date}
                                    </td>
                                    <td>
                                        {cInfo.vacName}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}


export default VacTable;