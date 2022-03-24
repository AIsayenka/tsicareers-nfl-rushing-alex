import React from "react";
import ReactDOM  from 'react-dom';
import { Dimmer, Loader, Icon, Table, Pagination, Input, Button } from 'semantic-ui-react';
import RushingTableHeader from "./Table/RushingTableHeader";
import RushingTableRow from "./Table/RushingTableRow";

const defaultURL = "/api/data";
const sortingURLPrefix = "/sort";
const filterPlayerURLPrefix = "/filter/player";
const downloadURLPrefix = "/download";
const defaultDataPage = 1;
const defaulPageSize = 20;

class RushingApp extends React.Component {
    // initializing state
    constructor(props) {
        super(props);
        console.log("props",props);

        // binding
        this.changePage = this.changePage.bind(this);
        this.sortData = this.sortData.bind(this);
        this.emptySortInfo = this.emptySortInfo.bind(this);
        this.filterData = this.filterData.bind(this);
        this.resetStateInfo = this.resetStateInfo.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.downloadData = this.downloadData.bind(this);
    }

    state = this.state = this.resetStateInfo;
    
    emptySortInfo() {
        return {
            currentSortColumn: null,
            currentSortOrder: null
        }
    }

    resetStateInfo() {
        return {
            isLoaded: false,
            data: null,
            errorMessage: null,
            lastURL: null,
            currentPage: null,
            pageSize: defaulPageSize,
            totalPages: null,
            currentSortColumn: null,
            currentSortOrder: null,
            showResetButton: false, 
            playerNameInput: null
        };
    
    }

    resetAll() {
        console.log("resetAll");
        let tempNewStateValues = this.resetStateInfo();
        this.fetchData(defaultURL, defaultDataPage, tempNewStateValues);
    }

    downloadData() {
        // prep the payload
        let tempData = {};
        let tempRequestConfig = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            }
        };
        if(this.state.currentSortColumn !== null) {
            tempData.processing = "sort";
            tempData.byColumn = this.state.currentSortColumn;
            tempData.order = this.state.currentSortOrder;
        }

        if(this.state.playerNameInput !== null) {
            tempData.processing = "filter";
            tempData.byColumn = "player";
            tempData.byValue = this.state.playerNameInput;
        }

        tempRequestConfig.body  = JSON.stringify(tempData);
        //tempRequestConfig.body = tempData;

        console.log("tempRequestConfig",tempRequestConfig);
        
        fetch(defaultURL+downloadURLPrefix,tempRequestConfig).then( res => res.blob() )
        .then( blob => {
          var file = window.URL.createObjectURL(blob);
          window.location.assign(file);
        });
    }

    filterData(input) {
        console.log("filterData", input);
        let tempNewStateValues = this.emptySortInfo();
        tempNewStateValues.showResetButton = true;
        tempNewStateValues.playerNameInput = input;
        if(input == "") {
            this.fetchData(defaultURL, defaultDataPage, tempNewStateValues);
        } else {
            this.fetchData(defaultURL+filterPlayerURLPrefix+"/"+input, defaultDataPage, tempNewStateValues);
        }
        
    }

    sortData(byColumn, order) {
        console.log("sortData byColumn",byColumn);
        console.log("sortData order",order);
        // setting up values for the sorting
        let tempNewStateValues =  {
            currentSortColumn: byColumn,
            currentSortOrder: order,
            showResetButton: true,
            playerNameInput: null
        };
        this.fetchData(defaultURL+sortingURLPrefix+"/"+byColumn+"/"+order, defaultDataPage, tempNewStateValues);
        console.log("state after the sortData", this.state);
    }
    
    changePage(page) {
        this.fetchData(this.state.lastURL, page );
    }

    fetchData(url, page, tempNewStateValues) {
        console.log("page", page);
        page = page || defaultDataPage;
        tempNewStateValues = tempNewStateValues || {};
        if(page < defaultDataPage) page = defaultDataPage;
        let tempFullUrl = url+"/"+page;
        console.log("tempFullUrl",tempFullUrl);
        tempNewStateValues.lastURL = url;
        tempNewStateValues.currentPage = page;

        let payloadData = {
            pageSize: this.state.pageSize|| defaulPageSize
            
        };

        let payload = "?"+(new URLSearchParams(payloadData).toString());

        fetch(tempFullUrl+payload)
        .then(res => res.json())
        .then(
          (result) => {
              console.log("data loading successful");
              tempNewStateValues.isLoaded = true;
              tempNewStateValues.data = result.data;
              tempNewStateValues.totalPages = (result.totalPages == 1 ? 1 : result.totalPages);
            this.setState(tempNewStateValues);
          },
          (error) => {
            tempNewStateValues.isLoaded = true;
            tempNewStateValues.errorMessage = errorMessage;
          this.setState(tempNewStateValues);
          }
        )
    }

    //loading initial data
    componentDidMount() {
        this.fetchData(defaultURL);
    }

    render() {
        console.log("Rushing table data:", this.state.data);
        if(!this.state.isLoaded) {
            return (
                  <Dimmer active>
                    <Loader content='Loading' />
                  </Dimmer>
            
                  
                );
        } 

        return (
            <div>

                <Input icon={<Icon name='search' inverted circular link />} value={this.state.playerNameInput} placeholder='Search Player By Name...' onChange={(e,data) => this.filterData(data.value)}/>
                <Button onClick={this.downloadData}>Download</Button>
                {((this.state.showResetButton) ? <Button onClick={this.resetAll}>Reset</Button> : "")}
                
                
                <Table celled sortable>
                    <RushingTableHeader currentSortColumn={this.state.currentSortColumn} currentSortOrder={this.state.currentSortOrder} dataSortHandler={this.sortData} />

                    <Table.Body>
                        {this.state.data.map((record, index) => {
                            return (<RushingTableRow data={record} />);
                        })}

                    </Table.Body>

                    <Pagination defaultActivePage={this.state.currentPage} totalPages={this.state.totalPages} onPageChange={(e, pageInfo) => this.changePage(pageInfo.activePage)} />
                </Table>
            </div>
        );

    }

}

ReactDOM.render(<RushingApp />, document.querySelector("#root"));