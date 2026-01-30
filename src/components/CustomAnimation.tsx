import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import CloseIcon from './assets/Vector_close.svg';
import OpenIcon from './assets/Vector_open.svg';

interface AnimatingIconProps {
  mouseX: ReturnType<typeof useMotionValue>;
}

const AnimatingIcon: React.FC<AnimatingIconProps> = ({ mouseX }) => {
  const pathDataOpen = "M72.6173 108.495V92.1986L11.39 0.5H0.5V16.8091L61.7273 108.495H72.6173Z";
  const pathDataClose = "M3.60404 0.5H0.5V5.15611L69.5003 108.495H72.6173V103.839L3.60404 0.5Z";

  const path = useTransform(
    mouseX,
    [0, window.innerWidth],
    [pathDataClose, pathDataOpen],
    { clamp: true }
  );

  return (
    <motion.svg
      width="74"
      height="109"
      viewBox="0 0 74 109"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path d={path} stroke="#FF5521" strokeMiterlimit="10" />
    </motion.svg>
  );
};

interface CustomAnimationProps {
  size?: number;
}

const CustomAnimation: React.FC<CustomAnimationProps> = ({ size = 100 }) => {
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  const mouseX = useMotionValue(0);

  useEffect(() => {
    const calculateGrid = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const cols = Math.floor(screenWidth / size);
      const rows = Math.floor(screenHeight / size);
      setGrid({ cols, rows });
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, [size]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: grid.cols * grid.rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
          }}
        >
          <AnimatingIcon mouseX={mouseX} />
        </div>
      ))}
    </div>
  );
};

export default CustomAnimation;