import React from 'react';
import './FakeAhoCanvas.css';
import aho_corasick from '../../../img/aho-corasick.svg';

function FakeAhoCanvas() {
  return (
    <img src={aho_corasick} className="show-canvas"></img>
  );
}
export default FakeAhoCanvas;
