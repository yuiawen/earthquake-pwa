
import React from 'react';
import { Activity, Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isOffline: boolean;
  onRefresh: () => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ isOffline, onRefresh, loading }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">InfoGempa</h1>
            <p className="text-blue-100 text-sm">Data BMKG Indonesia</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOffline ? (
            <div className="flex items-center gap-1 text-orange-200">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">Offline</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-200">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Online</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading || isOffline}
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
