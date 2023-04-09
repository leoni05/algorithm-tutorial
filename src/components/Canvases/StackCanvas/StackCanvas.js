import React, { useState, useEffect, useRef } from 'react';
import './StackCanvas.css';

function StackCanvas() {
  const canvasRef = useRef(null); // 캔버스 접근을 위한 useRef
  const requestIdRef = useRef(null); // 애니메이션 request id를 저장

  // canvas의 너비, 높이 저장을 위한 state
  // canvas 요소 실제 크기의 2배로 설정
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const animTime = 300; // 애니메이션 효과 지속시간 (ms 단위)
  const fontSize = 0.07;
  // orbitron 폰트가 살짝 올라가 있어, y좌표 조금 내리기 위함
  const adjustFontY = 0.004;

  const popBox = { x: 3/8, y: 13/16, width: 5/8, height: 3/16 };

  // 1 frame을 위한 렌더링
  function renderFrame() {
    const ctx = canvasRef.current.getContext("2d");
    const canvasW = canvasRef.current.offsetWidth * 2;
    const canvasH = canvasRef.current.offsetHeight * 2;
    const nowTime = new Date().getTime();

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvasW, canvasH);

    ctx.lineWidth = 2;
    ctx.fillStyle = "#000";

    // 칸 그리기
    ctx.beginPath();
    ctx.moveTo(canvasW * 3/8, 0);
    ctx.lineTo(canvasW * 3/8, canvasH);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasW * 3/8, canvasH * 13/16);
    ctx.lineTo(canvasW, canvasH * 13/16);
    ctx.stroke();

    // pop 글자 그리기
    ctx.font = (canvasW * fontSize) + "px Orbitron";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    const popX = popBox.x + popBox.width/2;
    const popY = popBox.y + popBox.height/2 + adjustFontY;
    ctx.fillText("POP", popX * canvasW, popY * canvasH);
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
    canvasRef.current.onselectstart = function () { return false; }
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  // canvas 기준 click 된 좌표를 0~1 사이 값으로 계산
  function handleCanvasClick(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    x /= canvasRef.current.offsetWidth;
    y /= canvasRef.current.offsetHeight;

  }

  return (
    <canvas className="show-canvas" ref={canvasRef}
      width={canvasWidth} height={canvasHeight} onClick={handleCanvasClick}/>
  );
}

export default StackCanvas;
