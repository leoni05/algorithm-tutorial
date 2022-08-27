import React from 'react';
import { BrowserRouter as Router, Route, Routes, useRoutes, } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import './App.css';
import Title from './Title';
import SocialLine from './SocialLine';
import Slider from './Slider';
import Content from './Content';

const routes = [
  { path: '/*', key: "Title", Component: Title },
  { path: '/*', key: "SocialLine", Component: SocialLine },
  { path: '/*', key: "Slider", Component: Slider },
  { path: '/*', key: "Content", Component: Content },
  // { path: '/algorithms/*', key: "Slider", Component: NavSlider },
];

function App() {
  return (
    <div className="App">
      <Router>
        {routes.map(({ path, key, Component }) => (
          <Routes key={key}>
            <Route path={path} element={<Component/>}></Route>
          </Routes>
        ))}
      </Router>
    </div>
  );
}

export default App;
