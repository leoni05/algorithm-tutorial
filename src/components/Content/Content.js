import React from 'react';
import './Content.css';
import Description from '../Description';
import ShowContainer from '../ShowContainer';

function Content() {
  return (
    <div className="content-wrapper">
      <div className="content">
        <Description/>
        <ShowContainer/>
      </div>
    </div>
  );
}

export default Content;
