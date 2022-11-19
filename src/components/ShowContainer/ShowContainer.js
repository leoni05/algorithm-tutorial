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
