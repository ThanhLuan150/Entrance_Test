import React, { useState, useEffect, useCallback } from 'react';

const GameComponent = () => {
  const [points, setPoints] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [allCleared, setAllCleared] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [nextIdToSelect, setNextIdToSelect] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [finish, setFinish] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const generatePoints = (numPoints) => {
    const newPoints = Array.from({ length: Math.min(numPoints, 1000) }, (_, index) => ({
      id: index + 1,
      selected: false,
      top: Math.random() * 450,
      left: Math.random() * 570,
    }));
    setPoints(newPoints);
    setAllCleared(false);
    setTimer(0);
    setIsTimerRunning(true);
    setNextIdToSelect(1);
    setGameOver(false);
    setFinish(true);
  };

  const handleGeneratePoints = () => {
    const numPoints = parseInt(inputValue, 10);
    if (isNaN(numPoints) || numPoints <= 0) {
      alert('Please enter a valid number');
      return;
    }
    generatePoints(numPoints);
  };

  const handleClearPoint = useCallback(
    (id) => {
      if (gameOver) return;
      if (id === nextIdToSelect) {
        setPoints((prevPoints) =>
          prevPoints.map((point) =>
            point.id === id ? { ...point, selected: true } : point
          )
        );
        setTimeout(() => {
          setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));
          setNextIdToSelect((prevId) => prevId + 1);

          if (points.length === 1) {
            setAllCleared(true);
            setIsTimerRunning(false);
          }
        }, 100);
      } else {
        setIsTimerRunning(false);
        setGameOver(true);
      }
    },
    [gameOver, nextIdToSelect, points.length]
  );

  const handleRestart = () => {
    const numPoints = parseInt(inputValue, 10);
    if (!isNaN(numPoints) && numPoints > 0) {
      generatePoints(numPoints);
    } else {
      setPoints([]);
      setInputValue('');
      setAllCleared(false);
      setTimer(0);
      setIsTimerRunning(false);
      setNextIdToSelect(1);
      setGameOver(false);
      setFinish(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 100);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTimerRunning]);

  const pointStyle = useCallback((selected, top, left, id, numPoints) => {
    const size = Math.max(30, 30 - Math.floor((id / numPoints) * 20));
    const topAdjusted = Math.min(Math.max(top, 5), 450 - size);
    const leftAdjusted = Math.min(Math.max(left, 5), 570 - size);

    return {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: selected ? '#F44336' : '#FFF',
      color: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      top: `${topAdjusted}px`,
      left: `${leftAdjusted}px`,
      fontSize: '10px',
      fontWeight: 'bold',
      zIndex: 10000 - id, 
      transform: id > 100 ? 'translateY(-5px)' : 'none',
      transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s',
      border: selected ? '2px solid #F44336' : '2px solid #252525',
    };
  }, []);

  return (
    <div style={{ paddingLeft: 20 }}>
      {allCleared ? (
        <h2 style={{ color: '#4CAF50' }}>ALL CLEARED!</h2>
      ) : gameOver ? (
        <h2 style={{ color: '#F44336' }}>GAME OVER!</h2>
      ) : (
        <h2 style={{ color: '#3F51B5' }}>LET'S PLAY</h2>
      )}
      <div style={{ gap: 30, marginBottom: 20, display: 'block' }}>
        <div style={{ display: 'flex' }}>
          <label style={{ fontWeight: 'bold', marginRight: 10 }}>Points:</label>
          <input
            value={inputValue}
            onChange={handleInputChange}
            style={{ padding: 5, fontSize: 16 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 30 }}>
          <p style={{ fontWeight: 'bold' }}>Time</p>
          <div style={{ paddingTop: 15 }}>{(timer / 10).toFixed(1)}s</div>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        {finish ? (
          <button
            onClick={handleRestart}
            style={{
              padding: '10px 20px',
              fontSize: 16,
              backgroundColor: '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            Restart
          </button>
        ) : (
          <button
            onClick={handleGeneratePoints}
            style={{
              padding: '10px 20px',
              fontSize: 16,
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            Play
          </button>
        )}
      </div>
      <div
        style={{
          position: 'relative',
          width: '580px',
          height: '455px',
          border: '2px solid #000000',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {points.map((point) => (
          <div
            key={point.id}
            style={pointStyle(point.selected, point.top, point.left, point.id, points.length)}
            onClick={() => handleClearPoint(point.id)}
          >
            {point.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameComponent;
