import React, { useState } from 'react';
import './App.css';
import Title from './Title';
import SocialLine from './SocialLine';

function App() {
  return (
    <div className="App">
      <div className="social-line">
        <span>Github</span>
        <span>Contact</span>
      </div>
      <Title />
    </div>
  );
}

export default App;
