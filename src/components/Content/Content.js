import React from 'react';
import './Content.css';
import Description from '../Description';
import ShowContainer from '../ShowContainer';
import { CSSTransition } from 'react-transition-group'
import { Link, useLocation } from 'react-router-dom'

function Content() {
  let location = useLocation();

  const contentWrapperClasses = "content-wrapper " +
    ((location.pathname === "/algorithms/contents/seg") ?
      "content-init-enter" : "content-init-exit");

  return (

    <CSSTransition in={location.pathname === "/algorithms/contents/seg"}
      timeout={400} classNames="content">

    <div className={contentWrapperClasses}>
      <div className="content">
        <Description className="description"/>
        <ShowContainer className="show-container"/>
      </div>
    </div>

    </CSSTransition>
  );
}

export default Content;
