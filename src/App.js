import React, { useState, useEffect } from 'react';

const GameComponent = () => {
  const [points, setPoints] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [allCleared, setAllCleared] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [nextIdToSelect, setNextIdToSelect] = useState(1);
  const [finish, setFinish] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generatePoints = (numPoints) => {
    let newPoints = Array.from({ length: numPoints }, (_, index) => ({
      id: index + 1,
      selected: false,
      top: Math.random() * 300,
      left: Math.random() * 300,
    }));
    newPoints = shuffleArray(newPoints);
    setPoints(newPoints);
    setAllCleared(false);
    setTimer(0);
    setIsTimerRunning(true); // Start the timer when points are generated
    setNextIdToSelect(1);
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

  const handleClearPoint = (id) => {
    if (id === nextIdToSelect) {
      setPoints((prevPoints) =>
        prevPoints.map((point) =>
          point.id === id ? { ...point, selected: true } : point
        )
      );
      setTimeout(() => {
        setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));
        setNextIdToSelect((prevId) => prevId + 1);
        
        if (points.length > points) {
          setIsTimerRunning(false); 
        }
      }, 300);
    } else {
      alert(`Game Over. Please click restart !`);
    }
  };

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

  useEffect(() => {
    if (points.length > 0 && points.every((point) => point.selected)) {
      setAllCleared(true);
      setIsTimerRunning(false);
    }
  }, [points]);

  const pointStyle = (selected, top, left) => ({
    position: 'absolute',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: selected ? 'red' : 'green',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    top: `${top}px`,
    left: `${left}px`,
    fontSize: '18px',
    fontWeight: 'bold',
  });

  return (
    <div style={{ paddingLeft: 10, paddingTop: 10 }}>
      {allCleared ? (
        <h3>ALL CLEARED!</h3>
      ) : (
        <h3>LET'S PLAY</h3>
      )}
      <div style={{ display: 'flex', gap: 30 }}>
        <p style={{ fontWeight: 'bold' }}>Points</p>
        <div style={{ paddingTop: 15 }}>
          <input
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 30 }}>
        <p style={{ fontWeight: 'bold' }}>Time</p>
        <div style={{ paddingTop: 15 }}>
          {(timer / 10).toFixed(1)}s
        </div>
      </div>
      <div style={{ marginBottom: '10px' }}>
        {finish ? (
          <button onClick={handleRestart}>Restart</button>
        ) : (
          <button onClick={handleGeneratePoints}>Play</button>
        )}
      </div>
      <div style={{ position: 'relative', width: '100%', height: '500px' }}>
        {points.map((point) => (
          <div
            key={point.id}
            style={pointStyle(point.selected, point.top, point.left)}
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
