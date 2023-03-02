import './App.css';
import PopUpForm  from './component/PopUpForm';
import Button from '@mui/material/Button';
import React, {Component, useState, useEffect } from 'react';
//import OverviewFlow from './component/Flow';
import json from './GameDev.json'
import { ReactFlow } from 'reactflow';
import Flow from './component/Flow2'


class App extends Component{
  // const [onPopUp, setOnPopUp] = useState(false); 
  constructor(props){
    super(props);
    this.state={
      graphObj: {},
      interviewerDialogs: []
    }

    this.onAddSubmit = this.onAddSubmit.bind(this);
    this.onEditSubmit = this.onEditSubmit.bind(this);
    this.init = this.init.bind(this);
    //this.init()
    //this.setJsonArray = this.setJsonArray.bind(this);
    //const [jsonArray, setJsonArray] = useState({});

  }

  init(){

    let init_node = {
      "id": "000",
      "DialogText": "",
      "NextDialogID": "",
      "requireResponse": false,
      "section": ""
    }

    //this.setState({pencil:!this.state.pencil}, myFunction)
    //^^invoking a second function as callback to setstate

    //console.log("Init Node", init_node)
    fetch('http://localhost:5000/init', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': true,
          'Access-Control-Allow-Methods': 'GET, POST, PUT'},
        body: JSON.stringify({"init_node": init_node}),
      })
      .then((response) => response.json())
      .then((data) => {
        //this.setState({jsonArray: data});
        //this.setJsonArray(data);
        this.setState({graphObj:data})
      })
      .catch(error => console.log(error));
    
      //console.log("IN START", JSON.stringify(this.state.graphObj))

  }
 

 

  onAddSubmit(nodeID, newNode) {

    // call the API to InsertNode(nodeID, newNode)
    // setJsonArray(InsertNode(nodeID, newNode));

    // call the API to RelabelNode("new_question", newNode.id)
    // setJsonArray(RelabelNode("new_question", newNode.id)); ?

  }

  onEditSubmit(newNode) {
    // call the API to UpdateNode(newNode)
    // setJsonArray(UpdateNode(newNode)); ?
  }

  componentDidMount(){
    this.init()

  }
  render(){

    //const [interviewerDialogs, setInterviewerDialogs] = useState(this.state.graphObj['nodes']);
    //console.log("graph", JSON.stringify(this.state.graphObj))
    //this.init();


    return (
      <div className="App">
        <main style={{ height: 800 }}>

        {/*<OverviewFlow
          onAddSubmit={this.onAddSubmit}
          onEditSubmit={this.onEditSubmit}
          init={this.init}
          //jsonArray={this.state.graphObj!={}? this.state.graphObj: {}} 
          jsonArray={this.state.graphObj}
          //questions={interviewerDialogs}
          //setInterviewerDialogs={setInterviewerDialogs}
    />*/}

        <Flow
        ></Flow>
        
        </main>
      </div>
    );
  }
  
}
export default App;