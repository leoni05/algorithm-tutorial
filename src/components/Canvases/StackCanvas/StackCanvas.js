import React, { useState, useEffect, useRef } from 'react';
import './StackCanvas.css';
import duckSvg from '../../../img/duck.svg';
import cubeSvg from '../../../img/cube.svg';
import carSvg from '../../../img/car.svg';
import gameboySvg from '../../../img/gameboy.svg';
import catSvg from '../../../img/cat.svg';

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

  const popBox = { x: 3/8, y: 13/16, width: 5/8, height: 3/16 }; // pop 글자 박스
  const images = useRef([]); // 이미지 객체들 저장하는 배열
  const imageSrc = [ duckSvg, cubeSvg, carSvg, gameboySvg, catSvg ];
  const imagesPos = [ // 각 이미지의 초기위치 및 너비, 높이
    { x: 0.434, y: 0.09, width: 0.231, height: 0.225 }, // duck
    { x: 0.712, y: 0.027, width: 0.231, height: 0.212 }, // cube
    { x: 0.659, y: 0.252, width: 0.315, height: 0.248 }, // car
    { x: 0.456, y: 0.407, width: 0.209, height: 0.302 }, // gameboy
    { x: 0.682, y: 0.492, width: 0.292, height: 0.285 }, // cat
  ];
  const duck = 0;
  const cube = 1;
  const car = 2;
  const gameboy = 3;
  const cat = 4;

  const pending = 0; // 입력 대기 상태
  const dropping = 1; // 물체가 떨어지고 있는 중
  const popping = 2; // 스택에서 물체 빼고 있는 중
  const stateRef = useRef(0); // 애니메이션 상태
  const g = 0.001; // 중력 가속도
  const popTime = 500; // pop 하는 데 걸리는 시간
  const dropObjRef = useRef({ objNum: -1, y: -0.5, speed: 0, bounced: false, }); // 떨어지고 있는 물체
  const popObjRef = useRef({ objNum: -1, popBeginTime: -1 }); // pop되고 있는 물체
  const usedRef = useRef([ false,false,false,false,false ]); // 각 물체가 사용되었는지(dropping, staked, popping)
  const stackRef = useRef([{ objNum: -1, height: 1 }]); // 실제 스택 (height : 현재 물체의 y좌표)

  // 1 frame을 위한 렌더링
  function renderFrame() {
    const ctx = canvasRef.current.getContext("2d");
    const canvasW = canvasRef.current.offsetWidth * 2;
    const canvasH = canvasRef.current.offsetHeight * 2;
    const nowTime = new Date().getTime();
    const stack = stackRef.current;

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

    // 대기 중인 image 그리기
    for(var i=0; i<5; i++){
      if(usedRef.current[i] == false){
        ctx.drawImage(images.current[i], imagesPos[i].x * canvasW, imagesPos[i].y * canvasH,
          imagesPos[i].width * canvasW, imagesPos[i].height * canvasH);
      }
    }

    // 스택에 있는 image 그리기
    for(var i=1; i<stack.length; i++){
      const obj = stack[i].objNum;
      const x = ((3/8) - imagesPos[obj].width)/2;
      const y = stack[i].height;
      ctx.drawImage(images.current[obj], x * canvasW, y * canvasH,
        imagesPos[obj].width * canvasW, imagesPos[obj].height * canvasH);
    }

    if(stateRef.current == dropping) {
      proceedDropping(nowTime);
      // 떨어지는 물체 그리기
      const obj = dropObjRef.current.objNum;
      const x = ((3/8) - imagesPos[obj].width)/2;
      const y = dropObjRef.current.y;
      ctx.drawImage(images.current[obj], x * canvasW, y * canvasH,
              imagesPos[obj].width * canvasW, imagesPos[obj].height * canvasH);
    }
    if(stateRef.current == popping) {
      proceedPopping(nowTime);
    }
  }

  // 떨어짐 진행시키기
  function proceedDropping(nowTime) {
    var dropObj = dropObjRef.current;
    dropObj.speed += g;
    dropObj.y += dropObj.speed;

    // 스택 최상단에 도달함 체크
    const last = stackRef.current.length - 1;
    const minY = stackRef.current[last].height - imagesPos[dropObj.objNum].height; // 물체가 내려갈 수 있는 y 좌표 최대값
    if(dropObj.y >= minY){
      dropObj.y = minY;

      if(dropObj.bounced == 0){
        dropObj.bounced = 1;
        dropObj.speed = (dropObj.speed / 5) * (-1);
      }
      else {
        stateRef.current = pending;
        stackRef.current.push({ objNum: dropObj.objNum, height: minY });
      }
    }
  }

  // pop 진행시키기
  function proceedPopping(nowTime) {
    if(nowTime - popObjRef.current.popBeginTime >= popTime){
      stateRef.current = pending;
      usedRef.current[popObjRef.current.objNum] = false;
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

  // images 배열에 이미지 세팅
  function setImages() {
    const imgs = images.current;
    for(var i=0; i<5; i++){
      imgs[i] = new Image();
      imgs[i].src = imageSrc[i];
    }
  }

  // 초기 canvas 사이즈 세팅, 이미지 세팅, resize 이벤트 리스너 추가
  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    canvasRef.current.onselectstart = function () { return false; }
    setImages();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  // x,y 좌표가 square에 포함되는가
  function inSquare(square, x, y) {
    return square.x <= x && x <= square.x + square.width
      && square.y <= y && y <= square.y + square.height;
  }

  // canvas 기준 click 된 좌표를 0~1 사이 값으로 계산
  function handleCanvasClick(event) {
    // pending일 때만 입력 받기
    if(stateRef.current != pending) return;

    const rect = canvasRef.current.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    x /= canvasRef.current.offsetWidth;
    y /= canvasRef.current.offsetHeight;

    // pop box 클릭
    if(inSquare(popBox, x, y) && stackRef.current.length > 1){
       const nowTime = new Date().getTime();
       stateRef.current = popping;
       popObjRef.current.objNum = stackRef.current.pop().objNum;
       popObjRef.current.popBeginTime = nowTime;
    }

    for(var i=0; i<5; i++){
      if(inSquare(imagesPos[i], x, y) && usedRef.current[i] == false && stackRef.current.length <= 4){
        stateRef.current = dropping;
        dropObjRef.current.objNum = i;
        dropObjRef.current.y = -0.5;
        dropObjRef.current.speed = 0;
        dropObjRef.current.bounced = false;
        usedRef.current[i] = true;
      }
    }
  }

  return (
    <canvas className="show-canvas" ref={canvasRef}
      width={canvasWidth} height={canvasHeight} onClick={handleCanvasClick}/>
  );
}

export default StackCanvas;
