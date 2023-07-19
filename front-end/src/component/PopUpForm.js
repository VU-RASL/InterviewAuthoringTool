import './PopUp.css';
import { MenuItem, Menu, Stack, TextField, Divider, Button, Checkbox, FormControlLabel, MenuList } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect } from "react";
import Box from '@mui/material/Box';
import {Alert, AlertTitle} from '@mui/material';
//import Alternate  from './Alternate';
import RemoveIcon from '@mui/icons-material/Remove';


function PopUpForm(props) { 
// Options for sections
 const sections = [
    {
      value: 'Greetings',
    },
    {
      value: 'Previous Work Experience',
    },
    {
      value: 'Technical',
    },
    {
      value: 'Education',
    },
    {
      value: 'Personal',
    },
    {
      value: 'Question',
    },
  ];

  const [errorMessage, setErrorMessage] = React.useState("");
  const [node_exists, setNodeExists] = React.useState(false);
  const [saveDisabled, setSaveDisabled]  = React.useState(true);
  

  function onSaveBtnClicked() {
    props.setIsModalOpen(!props.isModalOpen);
    props.onSubmit();

  }

  let handleAlternateChange = (i, e) => {
    let newAlternateValues = props.alternateValues;
    newAlternateValues[i] = e.target.value;
    props.setAlternateValues(newAlternateValues);
  }

  let addAlternateFields = () => {
    props.setAlternateValues([...props.alternateValues, ""])
  }

  let removeAlternateFields = (i) => {
      let newAlternateValues = [...props.alternateValues];
      newAlternateValues.splice(i, 1);
      console.log("Alternates", newAlternateValues)
      props.setAlternateValues(newAlternateValues)
      
    
  }
  useEffect(()=>{

    if(node_exists || props.dialogID==''){
      setSaveDisabled(true)
    }
    else{setSaveDisabled(false)}

  }, [saveDisabled, props.dialogID, node_exists]);
  

  return (
    <div className='popup' style={{"padding": "30px"}}>
      <Stack spacing={2} className='popup-inner'>
        
        <Stack direction='row'spacing={5}>
          <TextField
            required
            id="outlined-required"
            label="Dialogue ID"
            value={props.dialogID}
            disabled={props.onEdit}
            autoComplete="off"
            onChange={(e) => {
              e.preventDefault()
              console.log(e.target.value)
              
              
              fetch('http://localhost:5000/exists_node', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify({"node_to_check": e.target.value})
              })
              .then((response) => response.json())
              .then((data) => {
                console.log("data", Boolean(data))
                setNodeExists(Boolean(data))
              });
              
              if(node_exists!=true){
                props.onDialogIDChange(e);
                setErrorMessage('')

              }
              else{
                setErrorMessage("ID already exists!")
                setSaveDisabled(true)
                
              }
            }}
            placeholder=""
            
          /> 

          {node_exists? <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
            <strong>{"ID already exists!"}</strong>
          </Alert>: null}

          <TextField
          id="outlined-select-currency"
          select
          label="Section"
          value={props.section}
          onChange={(e) => props.onSectionChange(e)}
          helperText="Please select the interview section"
          >
             {sections.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <p>{option.value}</p>
            </MenuItem>
          ))}
          
      
          </TextField>
              
         
        </Stack>
        <TextField
          id="filled-multiline-static"
          label="Dialogue Text"
          value ={props.dialogText}
          multiline
          rows={2}
          onChange={(e) =>props.onDialogTextChange(e)}
          fullWidth
          placeholder="What challenges did you face?"
        />
   
        
        {(props.alternateValues).map((element,index) => (
             <Stack direction='row' >
                <TextField
                  key={index}
                  id="filled-multiline-static"
                  label="Alternate Dialogue"
                  name="alternate"
                  defaultValue={element === null ? '' : element} 
                  onChange={(e) => handleAlternateChange(index, e)}
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="What do you think was challenging about the job?"
                />
                <Button color='primary' startIcon={<RemoveIcon/>} onClick={() => removeAlternateFields(index)}></Button>
              </Stack>
        ))}

        <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
        <Button variant="outlined" onClick={() => addAlternateFields()} startIcon={<AddIcon/>}>Add Alternate</Button>
        </Box>  


      <Box display="flex" justifyContent="flex-start" alignItems="flex-start">
        {(props.nextID).map((element,index) => (
          
        <Stack direction='column'
        divider={<Divider orientation="vertical" flexItem />}

        spacing={3}>
          <TextField //this one should have multiple children
            id="outlined-required"
            key={index}
            label={"Child "+ (parseInt(index)+1).toString()}
            size='small'
            //onChange={(e) =>props.onNextDialogIDChange(e)}
            //value={props.nextID}
            defaultValue={element} 
            //required = {props.responseType === 'Statements'}
           // disabled = {!props.requiredResponse || props.responseType === 'Positive/Negative'}
           disabled={true} 
           //placeholder="Enter next ID or connect this node to a new node"
          />

          </Stack>
        ))}
      </Box>

     
        <br></br>
        <Stack direction='row'
              spacing={12}
              alignItems={'center'}
              justifyContent={"space-between"}>
          <Button variant="contained" className='save-btn' disabled={saveDisabled} onClick={onSaveBtnClicked} >Save</Button>
          <Button variant="contained" className='cancel-btn' color='error' onClick={() => props.setIsModalOpen(!props.isModalOpen)} >Cancel</Button>       
        </Stack>
        
      </Stack>
    </div>
  )
}

export default PopUpForm;