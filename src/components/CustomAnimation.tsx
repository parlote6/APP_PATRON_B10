import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useTime } from 'framer-motion';

interface AnimatingIconProps {
  mousePos: {
    x: ReturnType<typeof useMotionValue>;
    y: ReturnType<typeof useMotionValue>;
  };
  size: number;
  waveFrequency: number;
  waveAmplitude: number;
}

const AnimatingIcon: React.FC<AnimatingIconProps> = ({ mousePos, size, waveFrequency, waveAmplitude }) => {
  const pathDataOpen = "M12.1 0.5 C12.1,0.5 0.5,0.5 0.5,0.5 C0.5,0.5 0.5,17.16 0.5,17.16 C0.5,17.16 61.5,108.49 61.5,108.49 C61.5,108.49 72.62,108.5 72.62,108.5 C72.62,108.5 72.74,91.09 72.74,91.09 C72.74,91.09 12.1,0.5 12.1,0.5z";
  const pathDataClose = "M3.6 0.5 C3.6,0.5 0.5,0.5 0.5,0.5 C0.5,0.5 0.5,5.16 0.5,5.16 C0.5,5.16 69.5,108.5 69.5,108.5 C69.5,108.5 72.62,108.5 72.62,108.5 C72.62,108.5 72.62,103.84 72.62,103.84 C72.62,103.84 3.6,0.5 3.6,0.5z";

  const iconRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(Infinity);
  const time = useTime();

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
  const waveProgress = useTransform(time, value => (Math.sin(value / waveFrequency) + 1) / 2 * waveAmplitude);
  const combinedProgress = useTransform([hoverProgress, waveProgress], ([h, w]) => Math.min(h + w, 1));
  const path = useTransform(combinedProgress, [0, 1], [pathDataClose, pathDataOpen]);

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
  waveFrequency?: number;
  waveAmplitude?: number;
}

const CustomAnimation: React.FC<CustomAnimationProps> = ({ 
  size = 100, 
  horizontalSpacing = 40,
  waveFrequency = 1000,
  waveAmplitude = 0.5,
}) => {
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  const mousePos = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  useEffect(() => {
    const calculateGrid = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const cols = Math.floor(screenWidth / (size - horizontalSpacing));
      const rows = Math.floor(screenHeight / size);
      setGrid({ cols, rows });
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, [size, horizontalSpacing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x.set(e.clientX);
      mousePos.y.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mousePos.x, mousePos.y]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.cols}, ${size - horizontalSpacing}px)`,
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: grid.cols * grid.rows }).map((_, i) => (
            <AnimatingIcon 
              key={i}
              mousePos={mousePos}
              size={size}
              waveFrequency={waveFrequency}
              waveAmplitude={waveAmplitude}
            />
      ))}
    </div>
  );
};

export default CustomAnimation;