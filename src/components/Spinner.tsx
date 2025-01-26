'use client';
import { useState, useEffect } from "react";

interface CarSpinnerProps {
  imageFolder: string;
  imageCount: number;
  imageExtension: string;
}

const CarSpinner: React.FC<CarSpinnerProps> = ({
  imageFolder,
  imageCount,
  imageExtension,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(32);
  const [isMouseInside, setIsMouseInside] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMouseInside) {
      const { offsetWidth, offsetLeft } = e.currentTarget;
      const relativeX = e.clientX - offsetLeft;
      const percentage = relativeX / offsetWidth + 0.4;
      const newIndex = Math.floor(percentage * imageCount) % imageCount;
      setCurrentImageIndex(newIndex);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsMouseInside(true)}
      onMouseLeave={() => {
        setIsMouseInside(false);
      }}
      onMouseMove={handleMouseMove}
      className="relative h-[400px] w-full overflow-hidden"
    >
      <img
        src={`${imageFolder}/${currentImageIndex + 1}${imageExtension}`}
        alt="Spinning Car"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default CarSpinner;