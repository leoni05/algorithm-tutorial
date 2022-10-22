import React, { useState, useEffect } from 'react';
import './Content.css';
import Description from '../Description';
import ShowContainer from '../ShowContainer';
import { CSSTransition } from 'react-transition-group'
import { Link, useLocation } from 'react-router-dom'
import { useAlgorithms } from '../Algorithms';

function Content() {
  let location = useLocation();
  let algorithms = useAlgorithms();
  const nodeRef = React.useRef(null);
  const [inProps, setInProps] = useState(
    algorithms.isShowingAlgorithm(location.pathname)
  );
  const [pvPathname, setPvPathname] = useState(location.pathname);
  const [firstExecuted, setFirstExecuted] = useState(true);

  const contentWrapperClasses = "content-wrapper " +
    ((algorithms.isShowingAlgorithm(location.pathname)) ?
      "content-init-enter" : "content-init-exit");

  useEffect(() => {
    if (firstExecuted){
      setFirstExecuted(false);
      return;
    }
    let delay = 0;

    setInProps(false);
    if(algorithms.isShowingAlgorithm(location.pathname)){
      if (algorithms.isShowingAlgorithm(pvPathname)) {
        setTimeout(()=>{ setInProps(true);}, 400);
      }
      else{
        setInProps(true);
      }
    }

    setPvPathname(location.pathname)
  }, [location.pathname]);

  return (

    <CSSTransition in={inProps}
      timeout={400} classNames="content" nodeRef={nodeRef}>

    <div className={contentWrapperClasses} ref={nodeRef}>
      <div className="content">
        <Description className="description" title={algorithms.seg.title}
          description={algorithms.seg.description}/>
        <ShowContainer className="show-container"/>
      </div>
    </div>

    </CSSTransition>
  );
}

export default Content;
