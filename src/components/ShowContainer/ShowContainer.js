import React, { useState, useEffect } from 'react';
import './ShowContainer.css';

function ShowContainer() {

  const [isShowing, setIsShowing] = useState(true);

  function startButtonOnClick() {
    setIsShowing(false);
  }

  // const titleWrapperClasses = "title-wrapper " +
  //   ((location.pathname === "/") ? "title-init-enter" :
  //     "title-init-exit");

  const showHelpClasses = "show-help" +
    ((isShowing) ? "" :
      " display-none");

  return (
    <div className="show-container">

      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="RadialGradient1">
            <stop offset="0%" stopColor="red"/>
            <stop offset="100%" stopColor="blue"/>
          </radialGradient>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#000" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className={showHelpClasses}>
        <div>
          사람은 이 만물은 것은 때에, 방황하여도,
          웅대한 용기가 사막이다.
          있으며, 그와 않는 커다란 크고 칼이다. 군영과 대고,
          이것을 없으면 긴지라 우리는 그리하였는가?
          열락의 긴지라 피고 것이다. 자신과 우리 커다란 보라.
          무엇을 방지하는 피어나기 못할 천고에
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
