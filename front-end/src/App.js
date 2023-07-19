import './App.css';
import React, { useEffect, useState } from 'react';
import AuthoringTool from "./AuthoringTool"
import AuthoringHome from "./AuthoringHome"

import { BrowserRouter, Routes, Route } from 'react-router-dom';




const  App=()=> {


  //We are going to create an interview list here and then navigate to <Authoring tool page?
  //We will pass the original 
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthoringHome />}>
            </Route>
            <Route path='/tool' element={<AuthoringTool/>}></Route>

          </Routes>
  </BrowserRouter>   
    </div>
  );
}
export default App;