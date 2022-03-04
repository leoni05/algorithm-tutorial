import React from 'react';
import './App.css';
import Title from './Title';
import SocialLine from './SocialLine';
import TitleBar from './TitleBar';
import Slider from './Slider';
import Content from './Content';
import NavSlider from './NavSlider';

function App() {
  return (
    <div className="App">
      <SocialLine/>
      <TitleBar/>
      <Content/>
      <NavSlider/>
    </div>
  );
}

export default App;
