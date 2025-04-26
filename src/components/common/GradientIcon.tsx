import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface GradientIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

const GradientIcon: React.FC<GradientIconProps> = ({ 
  icon: Icon, 
  size = 24,
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent to-text-secondary opacity-20 rounded-xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon 
          size={size} 
          className="text-accent" 
          strokeWidth={2} 
        />
      </div>
      <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 shadow-sm" />
    </div>
  );
};

export default GradientIcon;