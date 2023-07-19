import './App.css';
import React, { useEffect, useState } from 'react';
//import AuthoringTool from "./AuthoringTool"
import { DataGrid } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button, IconButton} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { Grid, Item, TextField} from "@mui/material";
import AuthoringTool from './AuthoringTool';
import { useNavigate } from 'react-router-dom';




const  AuthoringHome= ()=> {

    const navigate = useNavigate();

    function navigateToPage(){
        navigate('/tool', {state: "from-template"})
    }
    function navigateNew(){
      navigate('/tool', {state: ''})
    }


  //We are going to create an interview list here and then navigate to <Authoring tool page?
  //We will pass the original 
  return (
    <div style={{ height: 400, width: '100%' , alignItems: "center"}} >
        <h1 style={{fontFamily: "Arial, Helvetica, sans-serif"}}> Interview Authoring Tool</h1>
        <Button 
        color={"primary"}
        variant="constrained"
          onClick={navigateToPage}>
            Edit Current Script
        </Button>

        <Button 
        color={"primary"}
        variant="constrained"
          onClick={navigateNew}>
            Create New Script
        </Button>
        
    </div>
  );
}
export default AuthoringHome;