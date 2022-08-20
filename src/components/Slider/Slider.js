import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import './Slider.css';

function Slider() {
  const nodeRef = React.useRef(null);

  let location = useLocation();

  const [sliderWrapperClasses, setSliderWrapperClasses] = useState();

  useEffect(()=>{
    let classesString = "slider-wrapper ";

    if(location.pathname !== "/")
      classesString += "slider-opacity-init-enter ";
    else classesString += "slider-opacity-init-exit ";

    if(location.pathname.indexOf('/algorithms/contents/') !== 0)
      classesString += "slider-size-init-enter";
    else classesString += "slider-size-init-exit"

    setSliderWrapperClasses(classesString);
  }, []);

  const [sizeInProps, setSizeInProps] = useState();

  useEffect(()=>{
    if(location.pathname.indexOf('/algorithms/contents/') === 0){
      setSizeInProps(false);
    }
    else{
      setSizeInProps(true);
    }
  }, [location.pathname]);

  return (
      <CSSTransition in={location.pathname !== "/"} timeout={300}
        classNames="slider-opacity" nodeRef={nodeRef}>
        <CSSTransition in={sizeInProps} timeout={300}
          classNames="slider-size" nodeRef={nodeRef}>

        <div className={sliderWrapperClasses} ref={nodeRef}>
          <div className="slider-container">
            <div className="slider">
              <span className="slide-item">Aho-Corasick</span>
              <span className="slide-item">DFS</span>
              <span className="slide-item">BFS</span>
              <span className="slide-item">Queue</span>
              <span className="slide-item">Stack</span>
              <Link to="/algorithms/contents/seg" className="text-link">
                <span className="slide-item">Segment Tree</span>
              </Link>
              <span className="slide-item">Aho-Corasick</span>
              <span className="slide-item">DFS</span>
              <span className="slide-item">BFS</span>
              <span className="slide-item">Queue</span>
              <span className="slide-item">Stack</span>
            </div>
          </div>
        </div>

      </CSSTransition>
    </CSSTransition>
  );
}

export default Slider;
