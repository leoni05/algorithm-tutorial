import React, { useState, useEffect } from 'react';

function SegCanvas() {
  let ref = useRef();

  return (
    <canvas ref={ref} className="show-canvas"/>
  );
}

export default SegCanvas;
