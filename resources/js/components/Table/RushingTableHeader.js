import React from "react";
import { Table } from 'semantic-ui-react'

const options = {
    "player": "Player",
    "team": "Team",
    "position": "Position",
    "att": "Att",
    "att_by_g": "Att/G",
    "yds": "Yds",
    "avg": "Avg",
    "yds_by_g": "Yds/G",
    "td": "TD",
    "lng": "Lng",
    "first": "1st",
    "first_prc": "1st%",
    "20_plus": "20+",
    "40_plus": "40+",
    "fum": "FUM"
};


class RushingTableHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    

    render() {
        return (
            <Table.Header>  
                <Table.Row>
                    {Object.keys(options).map((key) => {
                       return (<Table.HeaderCell sorted={this.props.currentSortColumn === key ? (this.props.currentSortOrder == "asc" ? "ascending" : "descending") : null} onClick={() => this.props.dataSortHandler(key, (this.props.currentSortOrder == null ? "asc" : (this.props.currentSortOrder == "asc"? "desc" : "asc")))}>{options[key]}</Table.HeaderCell>);
                    })} 
                </Table.Row>
            </Table.Header>
        );

    }
}

export default RushingTableHeader;