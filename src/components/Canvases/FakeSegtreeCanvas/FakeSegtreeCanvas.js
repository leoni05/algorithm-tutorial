import React from 'react';
import './FakeSegtreeCanvas.css';
import seg_tree from '../../../img/segment-tree.svg';

function FakeSegtreeCanvas() {
  return (
    <img src={seg_tree} className="show-canvas"></img>
  );
}
export default FakeSegtreeCanvas;
