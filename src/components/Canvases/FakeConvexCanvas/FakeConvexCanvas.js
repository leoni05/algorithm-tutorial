import React from 'react';
import './FakeConvexCanvas.css';
import convex_hull from '../../../img/convex-hull.svg';

function FakeConvexCanvas() {
  return (
    <img src={convex_hull} className="show-canvas"></img>
  );
}
export default FakeConvexCanvas;
