
import React from 'react';
import { Activity } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
        <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-4 text-gray-600">Memuat data...</p>
    </div>
  );
};

export default LoadingSpinner;
