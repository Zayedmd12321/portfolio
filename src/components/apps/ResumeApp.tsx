'use client';
import React from 'react';

export default function ResumeApp() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center overflow-hidden">
      <object
        data="/resume.pdf"
        type="application/pdf"
        className="w-full h-full"
      >
        <iframe
          src="/resume.pdf"
          className="w-full h-full border-none"
          title="Resume - Md Zayed Ghanchi"
        />
      </object>
    </div>
  );
}
