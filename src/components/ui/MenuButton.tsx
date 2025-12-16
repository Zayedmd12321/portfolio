'use client';
import React from 'react';

interface MenuButtonProps {
  children?: React.ReactNode;
  label?: string;
  bold?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export function MenuButton({ 
  children, 
  label, 
  bold = false, 
  active = false, 
  onClick 
}: MenuButtonProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        px-2 h-6 rounded-sm flex items-center cursor-default transition-all duration-100 
        ${active ? 'bg-white/20' : 'hover:bg-white/10'}
        ${bold ? 'font-bold tracking-tight' : 'font-medium'}
      `}
    >
      {children || label}
    </div>
  );
}
