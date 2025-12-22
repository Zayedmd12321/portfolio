'use client';
import React from 'react';

interface InfoBoxProps {
  label: string;
  value: string;
}

export default function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block mb-1">{label}</span>
      <span className="text-[14px] font-medium text-black dark:text-white truncate block" title={value}>{value}</span>
    </div>
  );
}
