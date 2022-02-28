import React, { useState } from 'react';
import './App.css';

function App() {

  const [mouseX, setMouseX] = useState(-1);
  const [mouseY, setMouseY] = useState(-1);

  const svgMaskSize = (mouseX !== -1) ? 900 : 0;
  const svgStyle = {
    maskImage: 'radial-gradient(closest-side, rgba(0,0,0,0.7), rgba(0,0,0,0))',
    maskSize: `${svgMaskSize}px ${svgMaskSize}px`,
    maskRepeat: 'no-repeat',
    maskPosition: `${mouseX - svgMaskSize/2}px ${mouseY - svgMaskSize/2}px`,

    WebkitMaskImage: 'radial-gradient(closest-side, rgba(0,0,0,0.7), rgba(0,0,0,0))',
    WebkitMaskSize: `${svgMaskSize}px ${svgMaskSize}px`,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: `${mouseX - svgMaskSize/2}px ${mouseY - svgMaskSize/2}px`,
  };

  function handleMouseMove(e) {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  }

  function handleMouseOut(e) {
    setMouseX(-1);
    setMouseY(-1);
  }

  return (
    <div className="App">

      <div className="social-line">
        <span>Github</span>
        <span>Contact</span>
      </div>

      <div className="title" onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}>
        <span>ALGORITHM</span>

        <svg style={svgStyle} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="RadialGradient1">
              <stop offset="0%" stopColor="red"/>
              <stop offset="100%" stopColor="blue"/>
            </radialGradient>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#D2DCE5" strokeWidth="1.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

      </div>

    </div>
  );
}

export default App;
