import React from 'react';
import './Description.css';

function Description(props) {
  return (
    <div className="description">
      <div className="description-title">{props.title}</div>
      {props.description.map((elem, index) => {
        return (<p>{elem}</p>);
      })}
    </div>
  );
}

export default Description;
