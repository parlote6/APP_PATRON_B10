import { useControls } from 'leva';
import CustomAnimation from './components/CustomAnimation';

function App() {
  const { 
    size, 
    horizontalSpacing, 
    verticalSpacing,
    waveFrequency, 
    waveAmplitude, 
    randomnessFactor, 
    numRows, 
    numCols 
  } = useControls({
    size: { value: 100, min: 20, max: 200, step: 1, label: 'size' },
    horizontalSpacing: { value: 40, min: 0, max: 80, step: 1, label: 'horizontalSpacing' },
    verticalSpacing: { value: 40, min: 0, max: 80, step: 1, label: 'verticalSpacing' },
    waveFrequency: { value: 1000, min: 100, max: 2000, step: 10, label: 'waveFrequency' },
    waveAmplitude: { value: 0.5, min: 0, max: 1, step: 0.01, label: 'waveAmplitude' },
    randomnessFactor: { value: 0, step: 0.01, label: 'randomnessFactor' },
    numRows: { value: 0, min: 0, max: 50, step: 1, label: 'numRows' },
    numCols: { value: 0, min: 0, max: 50, step: 1, label: 'numCols' },
  });

  const handleExportJson = () => {
    const animationConfig = {
      type: 'APP_PATRON_ANIMATION',
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: {
        size,
        horizontalSpacing,
        verticalSpacing,
        waveFrequency,
        waveAmplitude,
        randomnessFactor,
        numRows,
        numCols,
      },
    };

    const blob = new Blob([JSON.stringify(animationConfig, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.href = url;
    link.download = `app-patron-animation-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button
        onClick={handleExportJson}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          border: 'none',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          color: '#fff',
          background: '#111',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
        }}
      >
        Export JSON
      </button>
      <CustomAnimation 
        size={size}
        horizontalSpacing={horizontalSpacing}
        verticalSpacing={verticalSpacing}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        randomnessFactor={randomnessFactor}
        numRows={numRows}
        numCols={numCols}
      />
    </div>
  )
}

export default App;
