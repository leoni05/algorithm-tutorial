import React from 'react';
import './Description.css';
import { Link } from 'react-router-dom'
import back2 from '../../img/back2.svg';

function Description(props) {
  return (
    <div className="description">
      <div className="description-title">{props.title}</div>
      {props.description.map((elem, index) => {
        return (<p>{elem}</p>);
      })}
      <div style={{ flex: 1 }}></div>
      <Link to="/algorithms" className="text-link">
        <img src={back2} className="back-button"></img>
      </Link>
    </div>
  );
}

export default Description;
