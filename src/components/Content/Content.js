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
  let nowAlgObj = algorithms.getAlgorithm(location.pathname);

  const nodeRef = React.useRef(null);
  const [inProps, setInProps] = useState(
    algorithms.isShowingAlgorithm(location.pathname)
  );
  const [pvPathname, setPvPathname] = useState(location.pathname);
  const [firstExecuted, setFirstExecuted] = useState(true);
  const [algorithmTitle, setAlgorithmTitle] = useState(nowAlgObj.title);
  const [algorithmDesc, setAlgorithmDesc] = useState(nowAlgObj.description);

  const contentWrapperClasses = "content-wrapper " +
    ((algorithms.isShowingAlgorithm(location.pathname)) ?
      "content-init-enter" : "content-init-exit");

  function showNewAlgorithm(){
    nowAlgObj = algorithms.getAlgorithm(location.pathname);
    setAlgorithmTitle(nowAlgObj.title);
    setAlgorithmDesc(nowAlgObj.description);
    setInProps(true);
  }

  useEffect(() => {
    if (firstExecuted){
      setFirstExecuted(false);
      return;
    }
    let delay = 0;

    setInProps(false);
    if(algorithms.isShowingAlgorithm(location.pathname)){
      if (algorithms.isShowingAlgorithm(pvPathname)) {
        setTimeout(()=>{ showNewAlgorithm() }, 400);
      }
      else{
        showNewAlgorithm();
      }
    }

    setPvPathname(location.pathname)
  }, [location.pathname]);

  return (

    <CSSTransition in={inProps}
      timeout={400} classNames="content" nodeRef={nodeRef}>

    <div className={contentWrapperClasses} ref={nodeRef}>
      <div className="content">
        <Description className="description" title={algorithmTitle}
          description={algorithmDesc}/>
        <ShowContainer className="show-container"/>
      </div>
    </div>

    </CSSTransition>
  );
}

export default Content;
