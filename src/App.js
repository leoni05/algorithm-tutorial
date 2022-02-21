import './App.css';

function App() {

  function handleMouseMove(e) {
    console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  return (
    <div className="App">

      <div className="social-line">
        <span>Github</span>
        <span>Contact</span>
      </div>

      <div className="title">
        <span onMouseMove={handleMouseMove}>ALGORITHM
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="RadialGradient1">
                <stop offset="0%" stopColor="red"/>
                <stop offset="100%" stopColor="blue"/>
              </radialGradient>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#D2DCE5" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </span>
      </div>

    </div>
  );
}

export default App;
