import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import './Title.css';


function Title() {
  const nodeRef = React.useRef(null);

  let location = useLocation();

  const [mouseX, setMouseX] = useState(-1);
  const [mouseY, setMouseY] = useState(-1);

  const svgMaskSize = (mouseX !== -1) ? 900 : 0;
  const svgStyle = {
    maskSize: `${svgMaskSize}px ${svgMaskSize}px`,
    maskPosition: `${mouseX - svgMaskSize/2}px ${mouseY - svgMaskSize/2}px`,

    WebkitMaskSize: `${svgMaskSize}px ${svgMaskSize}px`,
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

  const [titleWrapperClasses, setTitleWrapperClasses] = useState();

  useEffect(()=>{
    let classesString = "title-wrapper ";

    if(location.pathname === "/")
      classesString += "title-init-enter";
    else classesString += "title-init-exit";

    setTitleWrapperClasses(classesString);
  }, []);

  return (
    <CSSTransition in={location.pathname === "/"} timeout={400} classNames="title" nodeRef={nodeRef}>
      <div className={titleWrapperClasses} ref={nodeRef}>
        <div className="title-container" onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}>

          <Link to={location.pathname === "/" ? "/algorithms" : "/"} className="text-link">
            <span className="title">ALGORITHM</span>
          </Link>

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
    </CSSTransition>
  );
}

export default Title;
