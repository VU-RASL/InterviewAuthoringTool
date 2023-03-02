//import './App.css';
import PopUpForm  from './component/PopUpForm';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
//import OverviewFlow from './component/Flow3'; - this is the final one
import OverviewFlow from './component/Flow';
import useUndoable from "use-undoable"


import {IconButton, Snackbar, Alert, Grid} from '@mui/material';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';
import data from "./DataStorage/graph.json"
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


//import {InitGraph, InsertNode, RelabelNode, UpdateNode, UpdateGraph, DeleteNode} from './APIService';


const  AuthoringTool=(props)=> {

    const location = useLocation();


    
  // const [onPopUp, setOnPopUp] = useState(false); 
  const [jsonArray, setJsonArray, { undo, redo }] = useUndoable(location.state=='from-template'?data: {'nodes': [], 'links': []})

  //const [jsonArray, setJsonArray] = useState({'nodes': [], 'links': []})
  const [interviewerDialogs, setInterviewerDialogs] = useState('');
  const [errorMessage, setErrorMessage] = useState('')


  useEffect(() => {

    if(location.state!="from-template"){

        let init_node = {
        id: "000",
        DialogText: "Hello, nice to meet you?",
        alternates: ['Hi there', "Hello, my name is..."],
        data: {label: "000 Hello, nice to meet you?"},
        NextDialogID: [""],
        position: {x: 200, y: -100},
        type: 'input',
        section: "Greetings"
        }
    
    // console.log("init_node", init_node)
        fetch('http://localhost:5000/init', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': true,
        'Access-Control-Allow-Methods': 'GET, POST, PUT'},
        body: JSON.stringify({"init_node": init_node}),
        })
        .then((response) => response.json())
        .then((data) => {
    
        setJsonArray(data)
        setInterviewerDialogs(data['nodes'])
        })
        .catch(error => console.log(error));
    }
    else{
        fetch('http://localhost:5000/init_graph', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': true,
            'Access-Control-Allow-Methods': 'GET, POST, PUT'},
            body: JSON.stringify({"init_graph": jsonArray}),
            })
            .then((response) => response.json())
            .then((data) => {
        
            setJsonArray(data)
            setInterviewerDialogs(data['nodes'])
            })
            .catch(error => console.log(error));

    }

  

    
  }, [])

  useEffect(()=>{
    localStorage.setItem

  }, [jsonArray]
  )
  

  function onAddSubmit(currNode, newNode) {

    console.log("Current Selected Node", currNode)

    fetch('http://localhost:5000/insert_node', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT'},
      body: JSON.stringify({"current_node": currNode, "node_to_add": newNode}),
    })
    .then((response) => response.json())
    .then((data) => {
      //console.log("On add data", JSON.stringify(data))
      setJsonArray(data)
      setInterviewerDialogs(data['nodes'])

    })
    .catch(error => console.log(error));

  }

  function onEditSubmit(newNode) {
    // call the API to UpdateNode(newNode)
    //setJsonArray(UpdateNode(newNode));
   // console.log("OnEditSubmit", JSON.stringify(newNode))
    fetch('http://localhost:5000/update_node_attrs', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({"node_to_update": newNode})
    })
    .then((response) => response.json())
    .then((data) => {
      //this.setState({graph: data});
      setJsonArray(data)
      setInterviewerDialogs(data['nodes'])

    })
    .catch(error => console.log(error));
  }

  function onDelete(nodeID){
    fetch('http://localhost:5000/delete_node', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"node_to_delete": nodeID})
      })
      .then((response) => response.json())
      .then((data) => {
        //this.setState({graph: data});
        // removes nodeID (DialogueID) from the running list of nodes
        //this.nodeList.splice(this.nodeList.indexOf(nodeID),1);
        setJsonArray(data)
        //@todo: get rid of the next dialog id on the previous node
        setInterviewerDialogs(data['nodes'])
      });

  }
  
  function onEdgeDelete(source, target){
    fetch('http://localhost:5000/remove_edge', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"source_node": source, "target_node": target})
      })
      .then((response) => response.json())
      .then((data) => {
        setJsonArray(data);
      });
    }

  function onCreateEdge(id, source, target, label){
    //console.log("id", id)

    fetch('http://localhost:5000/create_edge', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"source_node": source, "target_node": target, "type": label, "id": id})
      })
      .then((response) => response.json())
      .then((data) => {

        if (data==true){
          setErrorMessage("Error! Connection already exists!")
          setOpenSnackBar(true)

        }
        else{
          setJsonArray(data);

        }
      });
  }
  
  function onEdgeUpdate(edge){
    console.log("Edge to Update", edge)
    fetch('http://localhost:5000/update_edge', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({"edge_to_update": edge})
      })
      .then((response) => response.json())
      .then((data) => {
        setJsonArray(data);
      });
  }

  const [openSnackBar, setOpenSnackBar] = React.useState(false);



  const handleClose = (event, reason) => {
    console.log("Snackbar event", event)
    console.log("Snackbar reason", reason)
    
  
    if (reason == 'clickaway') {
      setOpenSnackBar(false);
      setErrorMessage('')
      
      return;
    }
    
    setOpenSnackBar(false);
    setErrorMessage('')

  };



  return (
    <div className="App">
      <Snackbar
        open={openSnackBar}
        anchorOrigin={{ vertical: 'top', horizontal: "center" }}
        style={{width: '100%'}}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        //action={action}
      >
      <Alert style={{width: "80%", border: 'red solid 2px', padding:'5px'}} severity="error"  
       action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="medium"
          onClick={() => {
            setOpenSnackBar(false);
            setErrorMessage('');
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
      >
        {errorMessage}</Alert>
      </Snackbar>


      {/*JSON.stringify(jsonArray['nodes'])*/}
      {/*JSON.stringify(jsonArray['links'])*/}
      {console.log(jsonArray['nodes'])}
      <main style={{ height: window.innerHeight-50}}>
      

      {jsonArray!=''?

       <OverviewFlow
        onAddSubmit={onAddSubmit}
        onEditSubmit={onEditSubmit}
        onDelete = {onDelete}
        onEdgeDelete = {onEdgeDelete}
        onCreateEdge = {onCreateEdge}
        onEdgeUpdate = {onEdgeUpdate}
        jsonArray={jsonArray} 
        undo={undo}
        redo={redo}
        setJsonArray={setJsonArray}
        questions={interviewerDialogs}
        setInterviewerDialogs={setInterviewerDialogs}
        setErrorMessage ={setErrorMessage}
        setOpenSnackBar= {setOpenSnackBar}
      />: "BACKEND NOT CONNECTED"}
     </main>
    </div>
  );
}
export default AuthoringTool;