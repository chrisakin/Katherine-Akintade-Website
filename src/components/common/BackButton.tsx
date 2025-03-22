import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`group flex items-center gap-2 text-gray-600 hover:text-gray-900 
        transition-colors ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft 
        size={20} 
        className="transition-transform group-hover:-translate-x-1" 
      />
      <span>Back</span>
    </button>
  );
}