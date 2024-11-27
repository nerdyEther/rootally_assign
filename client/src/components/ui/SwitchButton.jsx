import React, { useState } from 'react';

const SwitchButton = ({ onSideChange, isEditing, initialSide = 'left' }) => {
  const [side, setSide] = useState(initialSide);

  const handleToggle = () => {
    const newSide = side === 'left' ? 'right' : 'left';
    setSide(newSide);
    onSideChange(newSide);
  };

  return (
    <button
      type="button"
      className={`
        px-4 py-2 rounded-full text-sm font-medium
        ${side === 'left' ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'}
        ${isEditing ? 'cursor-pointer hover:bg-blue-600' : 'cursor-not-allowed opacity-50'}
      `}
      onClick={isEditing ? handleToggle : undefined}
    >
      {side === 'left' ? 'Left' : 'Right'}
    </button>
  );
};

export default SwitchButton;