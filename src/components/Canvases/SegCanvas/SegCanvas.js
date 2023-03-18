import React, { useState, useEffect, useRef } from 'react';
import './SegCanvas.css';

function SegCanvas() {
  const canvasRef = useRef(null); // 캔버스 접근을 위한 useRef
  const valuesRef = useRef([-1,
    1,
    2, 3,
    0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0]); // 각 노드에 저장된 값 저장
  const requestIdRef = useRef(null); // 애니메이션 request id를 저장

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

  // 1 frame을 위한 렌더링
  function renderFrame() {
    const ctx = canvasRef.current.getContext("2d");
    const values = valuesRef.current;
    const canvasW = canvasRef.current.offsetWidth * 2;
    const canvasH = canvasRef.current.offsetHeight * 2;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.save();
    ctx.beginPath();
    ctx.arc(values.x, values.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#444";
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // 사각형 23개 그리기
    ctx.lineWidth = 2;
    for(var i=1; i<=23; i++){
        ctx.strokeRect(squares[i].x * canvasW, squares[i].y * canvasH,
            squares[i].width * canvasW, squares[i].height * canvasH);
    }

    // 사각형 내부에 숫자 그리기
    ctx.font = "96px Orbitron";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for(var i=1; i<=23; i++){
        if(i<=15) ctx.fillStyle = "#444";
        else ctx.fillStyle = "#446787";
        ctx.fillText(values[i], squares[i].x * canvasW + squares[i].width * canvasW / 2,
            squares[i].y * canvasH + squares[i].height * canvasH / 2);
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

  return (
    <canvas className="show-canvas" ref={canvasRef}
      width={canvasWidth} height={canvasHeight}/>
  );
}

export default SegCanvas;
