'use client';
import React from 'react';

interface InfoBoxProps {
  label: string;
  value: string;
}

function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
      <span className="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-wide block mb-1">{label}</span>
      <span className="text-[0.875rem] font-medium text-black dark:text-white truncate block" title={value}>{value}</span>
    </div>
  );
}

export default React.memo(InfoBox);
