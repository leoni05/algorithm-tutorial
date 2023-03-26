import React, { useState, useEffect, useRef } from 'react';
import './SegCanvas.css';

function SegCanvas() {
  const canvasRef = useRef(null); // 캔버스 접근을 위한 useRef
  const valuesRef = useRef([-1,
    0,
    0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0]); // 각 노드에 저장된 값 저장
  const requestIdRef = useRef(null); // 애니메이션 request id를 저장
  const MAXV = 99; // 저장할 수 있는 최대값

  // canvas의 너비, 높이 저장을 위한 state
  // canvas 요소 실제 크기의 2배로 설정
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const squares = [{},
    {x: 0, y: 0, width: 1.0, height: 0.25},

    {x: 0, y: 0.25, width: 0.5, height: 0.25},
    {x: 0.5, y: 0.25, width: 0.5, height: 0.25},

    {x: 0, y: 0.5, width: 0.25, height: 0.25},
    {x: 0.25, y: 0.5, width: 0.25, height: 0.25},
    {x: 0.5, y: 0.5, width: 0.25, height: 0.25},
    {x: 0.75, y: 0.5, width: 0.25, height: 0.25},

    {x: 0, y: 0.75, width: 0.125, height: 0.125},
    {x: 0.125, y: 0.75, width: 0.125, height: 0.125},
    {x: 0.25, y: 0.75, width: 0.125, height: 0.125},
    {x: 0.375, y: 0.75, width: 0.125, height: 0.125},
    {x: 0.5, y: 0.75, width: 0.125, height: 0.125},
    {x: 0.625, y: 0.75, width: 0.125, height: 0.125},
    {x: 0.75, y: 0.75, width: 0.125, height: 0.125},
    {x: 0.875, y: 0.75, width: 0.125, height: 0.125},

    {x: 0, y: 0.875, width: 0.125, height: 0.125},
    {x: 0.125, y: 0.875, width: 0.125, height: 0.125},
    {x: 0.25, y: 0.875, width: 0.125, height: 0.125},
    {x: 0.375, y: 0.875, width: 0.125, height: 0.125},
    {x: 0.5, y: 0.875, width: 0.125, height: 0.125},
    {x: 0.625, y: 0.875, width: 0.125, height: 0.125},
    {x: 0.75, y: 0.875, width: 0.125, height: 0.125},
    {x: 0.875, y: 0.875, width: 0.125, height: 0.125}
  ];
  const fontSize = 0.07;
  // orbitron 폰트가 살짝 올라가 있어, y좌표 조금 내리기 위함
  const adjustFontY = 0.004;

  // 1 frame을 위한 렌더링
  function renderFrame() {
    const ctx = canvasRef.current.getContext("2d");
    const values = valuesRef.current;
    const canvasW = canvasRef.current.offsetWidth * 2;
    const canvasH = canvasRef.current.offsetHeight * 2;

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvasW, canvasH);

    // 사각형 23개 그리기
    ctx.lineWidth = 2;
    for(var i=1; i<=23; i++){
        ctx.strokeRect(squares[i].x * canvasW, squares[i].y * canvasH,
            squares[i].width * canvasW, squares[i].height * canvasH);
    }

    // 사각형 내부에 숫자 그리기
    ctx.font = (canvasW * fontSize) + "px Orbitron";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for(var i=1; i<=23; i++){
        if(i<=15) ctx.fillStyle = "#000";
        else ctx.fillStyle = "#446787";
        ctx.fillText(values[i], squares[i].x * canvasW + squares[i].width * canvasW / 2,
            squares[i].y * canvasH + squares[i].height * canvasH / 2 + (adjustFontY * canvasH));
    }
  }

  // animation 1 frame을 그릴 때 호출
  function tick() {
    // unmount 된 경우 tick 중지
    if (!canvasRef.current) return;
    // 1 frame 그리기
    renderFrame();
    // rendering이 다시 준비됐을 때 tick 함수 호출
    requestIdRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(tick);

    // unmount 됐을 때 애니메이션 정지
    // 그런데 tick 함수에서 return;만 해준다면 굳이 필요할까? log찍어서 확인하기
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  // canvas의 크기가 변했을 때, canvas의 width, height 값을 그의 2배로 설정.
  function setCanvasSize() {
    setCanvasWidth(canvasRef.current.offsetWidth * 2);
    setCanvasHeight(canvasRef.current.offsetHeight * 2);
  }

  // 초기 canvas 사이즈 세팅, resize 이벤트 리스너 추가
  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  // idx에 해당하는 위치에 +val
  function segUpdate(idx, val) {
    var values = valuesRef.current;

    values[idx] = Math.min(values[idx] + 1, MAXV);
    values[idx-8] = values[idx];
    idx -= 8;
    
    while(idx > 1) {
      values[idx >> 1] = values[idx] + values[idx ^ 1];
      idx >>= 1;
    }
  }

  // x,y 좌표가 square에 포함되는가
    function inSquare(square, x, y) {
      return square.x <= x && x <= square.x + square.width
        && square.y <= y && y <= square.y + square.height;
    }

  // canvas 기준 click 된 좌표를 0~1 사이 값으로 계산
  function handleCanvasClick(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    x /= canvasRef.current.offsetWidth;
    y /= canvasRef.current.offsetHeight;

    // x, y 좌표에 해당하는 사각형을 찾고 +1
    for(var i=16; i<=23; i++){
      if(inSquare(squares[i], x, y)){
        segUpdate(i, 1);
        return;
      }
    }
  }

  return (
    <canvas className="show-canvas" ref={canvasRef}
      width={canvasWidth} height={canvasHeight} onClick={handleCanvasClick}/>
  );
}

export default SegCanvas;
