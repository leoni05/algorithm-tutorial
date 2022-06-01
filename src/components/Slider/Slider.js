import React from 'react';
import { Link, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import './Slider.css';

function Slider() {
  const nodeRef = React.useRef(null);

  let location = useLocation();

  let sliderWrapperClasses = "slider-wrapper ";
  if(location.pathname != "/")
    sliderWrapperClasses += "slider-opacity-init-enter";
  else sliderWrapperClasses += "slider-opacity-init-exit";

  return (
    <CSSTransition in={location.pathname != "/"} timeout={500}
      classNames="slider-opacity" nodeRef={nodeRef} unmountOnExit>
      
      <div className={sliderWrapperClasses} ref={nodeRef}>
        <div className="slider">
          <span className="slide-item">Stack</span>
          <Link to="/algorithms/contents/seg" className="text-link">
            <span className="slide-item">Segment Tree</span>
          </Link>
          <span className="slide-item">Stack</span>
        </div>
      </div>
    </CSSTransition>
  );
}

export default Slider;
