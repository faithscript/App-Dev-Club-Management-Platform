import React from 'react';

interface CarProps {
  name: string;
  points: number;
  carImage: string;
}

const Car: React.FC<CarProps> = ({ name, points, carImage }) => {
  return (
    <div className="flex flex-col items-center mx-4">
      <img src={carImage} alt={`${name} car`} className="w-30 h-40 object-contain" />
      <p className="text-sm mt-2 font-semibold">{name}</p>
      <p className="text-xs text-gray-600">Points: {points}</p>
    </div>
  );
};

export default Car;