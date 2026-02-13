import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useTime } from 'framer-motion';

const pathFrames = [
  "M3.6 0.5 C3.6,0.5 0.5,0.5 0.5,0.5 C0.5,0.5 0.5,5.16 0.5,5.16 C0.5,5.16 69.5,108.5 69.5,108.5 C69.5,108.5 72.62,108.5 72.62,108.5 C72.62,108.5 72.62,103.84 72.62,103.84 C72.62,103.84 3.6,0.5 3.6,0.5z",
  "M2.98 0.5 C2.98,0.5 0.5,0.5 0.5,0.5 C0.5,0.5 0.5,2.66 0.5,2.66 C0.5,2.66 70.13,108.5 70.13,108.5 C70.13,108.5 72.62,108.5 72.62,108.5 C72.62,108.5 72.62,106.34 72.62,106.34 C72.62,106.34 2.98,0.5 2.98,0.5z",
  "M17.6 0.5 C17.6,0.5 0.5,0.5 0.5,0.5 C0.5,0.5 0.5,24.66 0.5,24.66 C0.5,24.66 54.75,108.49 54.75,108.49 C54.75,108.49 72.62,108.5 72.62,108.5 C72.62,108.5 72.74,83.59 72.74,83.59 C72.74,83.59 17.6,0.5 17.6,0.5z"
];

const keyTimes = [0, 0.375, 1];

interface AnimatingIconProps {
  mousePos: {
    x: ReturnType<typeof useMotionValue>;
    y: ReturnType<typeof useMotionValue>;
  };
  size: number;
  waveFrequency: number;
  waveAmplitude: number;
  randomnessFactor: number; // New prop for randomness control
}

const AnimatingIcon: React.FC<AnimatingIconProps> = ({ mousePos, size, waveFrequency, waveAmplitude, randomnessFactor }) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(Infinity);
  const time = useTime();
  const randomSeed = useRef(Math.random()); // Unique random value for each instance

  useEffect(() => {
    const updateDistance = () => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const iconCenterY = rect.top + rect.height / 2;
        const mx = mousePos.x.get();
        const my = mousePos.y.get();
        const newDist = Math.sqrt(Math.pow(mx - iconCenterX, 2) + Math.pow(my - iconCenterY, 2));
        distance.set(newDist);
      }
    };
    
    const unsubscribeX = mousePos.x.onChange(updateDistance);
    const unsubscribeY = mousePos.y.onChange(updateDistance);
    
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mousePos.x, mousePos.y, distance]);
  
  const hoverProgress = useTransform(distance, [0, size * 2], [1, 0], { clamp: true });
  const waveProgress = useTransform(time, value => (Math.sin(value / waveFrequency + randomSeed.current * randomnessFactor * 10) + 1) / 2 * waveAmplitude); // Add randomSeed to wave phase
  
  // Combine hover and wave
  const combinedProgress = useTransform([hoverProgress, waveProgress], ([h, w]) => {
    return Math.min(Math.max(0, h + w), 1); // Clamp between 0 and 1
  });
  
  const path = useTransform(combinedProgress, keyTimes, pathFrames);

  return (
    <div ref={iconRef} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.svg
        width="74"
        height="109"
        viewBox="0 0 74 109"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path d={path} stroke="#FF5521" strokeMiterlimit="10" />
      </motion.svg>
    </div>
  );
};

interface CustomAnimationProps {
  size?: number;
  horizontalSpacing?: number;
  verticalSpacing?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  randomnessFactor?: number; // New prop for randomness control
  numRows?: number; 
  numCols?: number; 
}

const CustomAnimation: React.FC<CustomAnimationProps> = ({ 
  size = 100, 
  horizontalSpacing = 40,
  verticalSpacing = 40,
  waveFrequency = 1000,
  waveAmplitude = 0.5,
  randomnessFactor = 0, // Default to no randomness
  numRows,
  numCols,
}) => {
  const [calculatedGrid, setCalculatedGrid] = useState({ cols: 0, rows: 0 });
  const mousePos = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  useEffect(() => {
    const calculateGrid = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      const effectiveCols = numCols !== undefined && numCols > 0
        ? numCols 
        : Math.floor(screenWidth / (size - horizontalSpacing));
      
      const effectiveRows = numRows !== undefined && numRows > 0
        ? numRows 
        : Math.floor(screenHeight / (size - verticalSpacing));
      
      setCalculatedGrid({ cols: effectiveCols, rows: effectiveRows });
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, [size, horizontalSpacing, verticalSpacing, numRows, numCols]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x.set(e.clientX);
      mousePos.y.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mousePos.x, mousePos.y]);

  const displayCols = numCols !== undefined ? numCols : calculatedGrid.cols;
  const displayRows = numRows !== undefined ? numRows : calculatedGrid.rows;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${displayCols}, ${size - horizontalSpacing}px)`,
        gridTemplateRows: `repeat(${displayRows}, ${size - verticalSpacing}px)`, 
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        justifyContent: 'center',
        alignContent: 'center', 
      }}
    >
      {Array.from({ length: displayCols * displayRows }).map((_, i) => (
            <AnimatingIcon 
              key={i}
              mousePos={mousePos}
              size={size}
              waveFrequency={waveFrequency}
              waveAmplitude={waveAmplitude}
              randomnessFactor={randomnessFactor}
            />
      ))}
    </div>
  );
};

export default CustomAnimation;