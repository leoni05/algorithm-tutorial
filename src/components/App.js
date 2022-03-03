import React from 'react';
import './App.css';
import Title from './Title';
import SocialLine from './SocialLine';
import TitleBar from './TitleBar';
import Slider from './Slider';

function App() {
  return (
    <div className="App">
      <SocialLine/>
      <TitleBar/>
      <Slider/>
    </div>
  );
}

export default App;
