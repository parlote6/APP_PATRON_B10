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

  return (
    <div>
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