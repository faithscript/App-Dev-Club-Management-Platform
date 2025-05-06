import React from 'react';

interface SpaceshipProps {
  name: string;
  points: number;
  spaceshipImage: string;
}

const Spaceship: React.FC<SpaceshipProps> = ({ name, points, spaceshipImage }) => {
  return (
    <div className="flex flex-col items-center mx-4">
      <img src={spaceshipImage} alt={`${name} spaceship`} className="w-20 h-25 object-contain" />
      <p className="text-m mt-2 font-semibold">{name}</p>
      <p className="text-xs text-gray-600">Points: {points}</p>
    </div>
  );
};

export default Spaceship;