import React from "react";
import { Table } from 'semantic-ui-react'

class RushingTableRow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Table.Row>
                <Table.Cell>{this.props.data.player}</Table.Cell>
                <Table.Cell>{this.props.data.team}</Table.Cell>
                <Table.Cell>{this.props.data.position}</Table.Cell>
                <Table.Cell>{this.props.data.att}</Table.Cell>
                <Table.Cell>{this.props.data.att_by_g}</Table.Cell>
                <Table.Cell>{this.props.data.yds}</Table.Cell>
                <Table.Cell>{this.props.data.avg}</Table.Cell>
                <Table.Cell>{this.props.data.yds_by_g}</Table.Cell>
                <Table.Cell>{this.props.data.td}</Table.Cell>
                <Table.Cell>{this.props.data.lng}</Table.Cell>
                <Table.Cell>{this.props.data.first}</Table.Cell>
                <Table.Cell>{this.props.data.first_prc}</Table.Cell>
                <Table.Cell>{this.props.data["20_plus"]}</Table.Cell>
                <Table.Cell>{this.props.data["40_plus"]}</Table.Cell>
                <Table.Cell>{this.props.data.fum}</Table.Cell>
            </Table.Row>
        );

    }
}

export default RushingTableRow;