import React, { useState, useEffect, useRef } from 'react';
import './SegCanvas.css';

function SegCanvas() {
  const canvasRef = useRef(null); // 캔버스 접근을 위한 useRef
  const valuesRef = useRef({ x: 10, y: 10 }); // 캔버스에 그릴 object의 속성값을 저장
  const requestIdRef = useRef(null); // 애니메이션 request id를 저장

  // canvas의 너비, 높이 저장을 위한 state
  // canvas 요소 실제 크기의 2배로 설정
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  // 1 frame을 위한 렌더링
  function renderFrame() {
    const ctx = canvasRef.current.getContext("2d");
    const values = valuesRef.current;
    if (values.x == 100) {
      values.x = 10;
      values.y = 10;
    }
    values.x += 1;
    values.y += 1;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.beginPath();
    ctx.arc(values.x, values.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#444";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
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
