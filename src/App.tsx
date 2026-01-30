import React, { useState } from 'react';
import CustomAnimation from './components/CustomAnimation';

function App() {
  const [size, setSize] = useState(100);
  const [horizontalSpacing, setHorizontalSpacing] = useState(40);
  const [waveFrequency, setWaveFrequency] = useState(1000);
  const [waveAmplitude, setWaveAmplitude] = useState(0.5);

  return (
    <div>
      <div style={{
        position: 'fixed',
        top: 10,
        left: 10,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div>
          <label>Size / Rows: {size}</label>
          <input 
            type="range" 
            min="20" 
            max="200" 
            value={size} 
            onChange={(e) => setSize(Number(e.target.value))} 
          />
        </div>
        <div>
          <label>X Spacing: {horizontalSpacing}</label>
          <input 
            type="range" 
            min="0" 
            max="80" 
            value={horizontalSpacing} 
            onChange={(e) => setHorizontalSpacing(Number(e.target.value))} 
          />
        </div>
        <div>
          <label>Wave Frequency: {waveFrequency}</label>
          <input 
            type="range" 
            min="100" 
            max="2000" 
            value={waveFrequency} 
            onChange={(e) => setWaveFrequency(Number(e.target.value))} 
          />
        </div>
        <div>
          <label>Wave Amplitude: {waveAmplitude}</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={waveAmplitude} 
            onChange={(e) => setWaveAmplitude(Number(e.target.value))} 
          />
        </div>
      </div>
      <CustomAnimation 
        size={size}
        horizontalSpacing={horizontalSpacing}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
      />
    </div>
  )
}

export default App;