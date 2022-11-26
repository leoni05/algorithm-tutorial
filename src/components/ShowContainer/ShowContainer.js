import React, { useState, useEffect } from 'react';
import './ShowContainer.css';

function ShowContainer(props) {

  const [isShowing, setIsShowing] = useState(true);

  function startButtonOnClick() {
    setIsShowing(false);
  }

  const showHelpClasses = "show-help" +
    ((isShowing) ? "" :
      " display-none");

  return (
    <div className="show-container">

      { props.algorithmCanvas }

      <div className={showHelpClasses}>
        <div>
          {props.algorithmCanvasDesc.map((elem, index) => {
            return (<p>{elem}</p>);
          })}
        </div>
        <div className="start-button-wrapper">
          <div className="start-button" onClick={startButtonOnClick}>
            Start
          </div>
        </div>
      </div>

    </div>
  );
}

export default ShowContainer;
