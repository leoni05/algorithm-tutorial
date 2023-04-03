import React, { useState, useEffect, useRef } from 'react';
import './GrahamCanvas.css';

function GrahamCanvas() {
  const canvasRef = useRef(null); // 캔버스 접근을 위한 useRef
  const pointsRef = useRef([]); // 선택한 점들을 저장
  const sortedRef = useRef([]); // 정렬한 점들을 저장
  const hullRef = useRef([]); // 컨벡스 헐
  const requestIdRef = useRef(null); // 애니메이션 request id를 저장

  // canvas의 너비, 높이 저장을 위한 state
  // canvas 요소 실제 크기의 2배로 설정
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const animTime = 300; // 애니메이션 효과 지속시간 (ms 단위)
  const fontSize = 0.03;
  // orbitron 폰트가 살짝 올라가 있어, y좌표 조금 내리기 위함
  const adjustFontY = 0.0017;

  const spaceNum = 16; // 가로 세로 칸의 개수
  const inputFinishTimeRef = useRef(-1); // 10번째 점 입력한 timestamp
  const nextUpdateIdxRef = useRef(0); // 다음으로 hull에 업데이트할 idx
  const animGap = 1000;

  // 1 frame을 위한 렌더링
  function renderFrame() {
    const ctx = canvasRef.current.getContext("2d");
    const canvasW = canvasRef.current.offsetWidth * 2;
    const canvasH = canvasRef.current.offsetHeight * 2;
    const nowTime = new Date().getTime();
    const points = pointsRef.current;
    const sorted = sortedRef.current;
    const hull = hullRef.current;

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvasW, canvasH);

    ctx.lineWidth = 2;
    ctx.fillStyle = "#000";
    // 가로 눈금 그리기
    for(var i=1; i<=spaceNum-1; i++){
      const nowY = canvasH * i / spaceNum;
      ctx.beginPath();
      ctx.moveTo(0, nowY);
      ctx.lineTo(canvasW, nowY);
      ctx.stroke();
    }

    // 세로 눈금 그리기
    for(var i=1; i<=spaceNum-1; i++){
      const nowX = canvasW * i / spaceNum;
      ctx.beginPath();
      ctx.moveTo(nowX, 0);
      ctx.lineTo(nowX, canvasH);
      ctx.stroke();
    }

    // 선택된 점들 그리기
    for(var i=0; i<points.length; i++){
      var px = points[i].x * canvasW / spaceNum;
      var py = points[i].y * canvasH / spaceNum;
      ctx.fillRect(px, py, canvasW / spaceNum, canvasH / spaceNum);
    }

    // hull 그리기
    if(hull.length > 1){
      var px = (hull[0].x/spaceNum + 1/(spaceNum*2)) * canvasW;
      var py = (hull[0].y/spaceNum + 1/(spaceNum*2)) * canvasH;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px, py);

      for(var i=1; i<hull.length; i++){
        var nx = (hull[i].x/spaceNum + 1/(spaceNum*2)) * canvasW;
        var ny = (hull[i].y/spaceNum + 1/(spaceNum*2)) * canvasH;
        ctx.lineTo(nx, ny);
      }

      ctx.lineTo(px, py);
      ctx.stroke();
    }

    // 각정렬 순서대로 숫자 그리기
    ctx.font = (canvasW * fontSize) + "px Orbitron";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    if(points.length >= 10){
      const nowTime = new Date().getTime();
      if(inputFinishTimeRef.current == -1){
        inputFinishTimeRef.current = nowTime;
      }
      const timeGap = nowTime - inputFinishTimeRef.current;
      const displayNum = Math.min(9, timeGap / animGap);

      for(var i=0; i<=displayNum; i++){
        var px = sorted[i].x/spaceNum * canvasW + canvasW / 32;
        var py = sorted[i].y/spaceNum * canvasH + canvasH / 32;
        ctx.fillText(i, px, py + (adjustFontY * canvasH));
      }

      // hull에 업데이트 해야하는 점이 있다면 업데이트
      while(nextUpdateIdxRef.current <= displayNum){
        updateHull(nextUpdateIdxRef.current);
        nextUpdateIdxRef.current = nextUpdateIdxRef.current + 1;
      }
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
    canvasRef.current.onselectstart = function () { return false; }
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  // 점 비교 함수
  function pointCompare(p1, p2) {
    if(p1.y < p2.y) return -1;
    if(p1.y > p2.y) return 1;
    if(p1.x < p2.x) return -1;
    if(p1.x > p2.x) return 1;
    return 0;
  }
  // 점 minus 연산 함수
  function pointMinus(p1, p2) {
    return {x: p1.x - p2.x, y: p1.y - p2.y};
  }
  // 점 내적 함수
  function pointCross(p1, p2) {
    return p1.x * p2.y - p2.x * p1.y;
  }
  // 점 3개 내적 함수
  function pointCross3(p, p1, p2) {
    return pointCross(pointMinus(p1, p), pointMinus(p2, p));
  }

  // 배열에서 원소 값 swap
  function arrSwap(arr, idx1, idx2) {
    var tmp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = tmp;
  }

  // 각정렬
  function sortByAngle() {
    var points = pointsRef.current;
    var sorted = sortedRef.current;
    var tmp;
    var std = 0;

    // tmp에 복사 후 y좌표 -1 곱하기
    tmp = points.slice();
    for(var i=0; i<tmp.length; i++){
      tmp[i].y *= -1;
    }

    // 기준점 찾기
    for(var i=0; i<tmp.length; i++){
      if(pointCompare(tmp[i], tmp[std]) < 0){
        std = i;
      }
    }
    sorted[0] = tmp[std];
    sorted.splice(1, sorted.length-1);
    tmp.splice(std, 1);

    // 기준점으로 각정렬하기
    tmp.sort(function(p1, p2) {
      const crossRes = pointCross3(sorted[0], p1, p2);
      if(crossRes != 0) {
        if(crossRes > 0) return -1;
        else return 1;
      }
      return pointCompare(p1, p2);
    });

    // sorted에 결과값 저장하기
    sorted[0].y *= -1;
    for(var i=0; i<tmp.length; i++){
      tmp[i].y *= -1;
      sorted.push(tmp[i]);
    }
  }

  // hull에 sorted[idx] 점 업데이트
  function updateHull(idx) {
    var hull = hullRef.current;
    const sorted = sortedRef.current;

    while(hull.length >= 2) {
      var last1 = hull[hull.length - 1];
      var last2 = hull[hull.length - 2];
      var crossRes;

      // 내적 값을 구하기 전 y좌표에 -1 곱하기
      last1.y *= -1; last2.y *=-1; sorted[idx].y *= -1;
      crossRes = pointCross3(last2, last1, sorted[idx]);
      last1.y *= -1; last2.y *=-1; sorted[idx].y *= -1;

      if(crossRes > 0) break;
      hull.pop();
    }
    hull.push(sorted[idx]);
  }

  // canvas 기준 click 된 좌표를 0~1 사이 값으로 계산
  function handleCanvasClick(event) {
    const points = pointsRef.current;
    // 점의 개수 최대 10개
    if(points.length >= 10) { return; }

    const rect = canvasRef.current.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    x /= canvasRef.current.offsetWidth;
    y /= canvasRef.current.offsetHeight;

    // 점의 좌표를 정수형으로 저장
    var pointX = parseInt(x / (1/spaceNum) + 0.01);
    var pointY = parseInt(y / (1/spaceNum) + 0.01);

    // 이미 존재하면 패스
    for(var i=0; i<points.length; i++){
      if(points[i].x == pointX && points[i].y == pointY){
        return;
      }
    }
    points.push({x: pointX, y:pointY});
    if(points.length >= 10){
      sortByAngle();
    }
  }

  return (
    <canvas className="show-canvas" ref={canvasRef}
      width={canvasWidth} height={canvasHeight} onClick={handleCanvasClick}/>
  );
}

export default GrahamCanvas;
