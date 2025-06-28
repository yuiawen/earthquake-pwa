
import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  isOffline: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <div>
          <p className="font-medium text-orange-800 dark:text-orange-200">Mode Offline Aktif</p>
          <p className="text-sm text-orange-600 dark:text-orange-300">Menampilkan data terakhir yang tersimpan</p>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
