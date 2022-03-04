import React from 'react';
import './Content.css';
import Description from '../Description';
import ShowContainer from '../ShowContainer';

function Content() {
  return (
    <div className="content">
      <Description/>
      <ShowContainer/>
    </div>
  );
}

export default Content;
