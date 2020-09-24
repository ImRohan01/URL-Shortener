import React from 'react'
import Routes from './Routes.js'
import {BrowserRouter as Router} from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div>
      <Router>
        <Routes />
      </Router>
    </div>
  );
}

export default App
