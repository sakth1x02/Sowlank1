import React, { useState, useEffect } from 'react';
import Clock from '../../assets/Clock.jpg'; // Adjust the path as needed
import './Timer.css';

const Timer = () => {
  const [seconds, setSeconds] = useState(5); // 25 minutes = 1500 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(interval); // Stop the timer at 0
          return 0;
        }
        return prevSeconds - 1; // Decrement seconds
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Format seconds into mm:ss
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      {/* Conditionally apply animation based on whether the timer is active */}
      <img
        src={Clock}
        alt="Clock"
        style={{
          ...styles.clockImage,
          animation: seconds > 0 ? 'spin 2s linear infinite' : 'none',
        }}
      />
      <div style={styles.timerText}>{formatTime(seconds)}</div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  clockImage: {
    width: '100px',
    height: '100px',
  },
  timerText: {
    marginTop: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
};

export default Timer;
