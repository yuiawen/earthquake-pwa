
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, TrendingUp, Clock, MapPin, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  isOffline: boolean;
  loading: boolean;
  onRefresh: () => void;
  totalData: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  isOffline, 
  loading, 
  onRefresh, 
  totalData 
}) => {
  const getLastUpdateTime = () => {
    const lastUpdate = localStorage.getItem('lastUpdate');
    if (lastUpdate) {
      try {
        const date = new Date(lastUpdate);
        if (isNaN(date.getTime())) {
          return 'N/A';
        }
        return date.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch {
        return 'N/A';
      }
    }
    return 'N/A';
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-10 text-white shadow-2xl">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">
                InfoGempa
              </h1>
            </div>
            <p className="text-blue-100 dark:text-slate-300 text-xl font-medium opacity-90 max-w-lg">
              Pantau aktivitas seismik Indonesia secara real-time
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Status Indicator */}
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-lg rounded-2xl px-4 py-3 border border-white/20">
              {isOffline ? (
                <>
                  <WifiOff className="w-5 h-5 text-orange-300" />
                  <span className="text-sm font-medium">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">Online</span>
                </>
              )}
            </div>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={onRefresh}
              disabled={loading || isOffline}
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/15 dark:bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-600/30 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-3 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 dark:text-slate-300 text-sm font-medium">Total Gempa</p>
                <p className="text-2xl font-bold text-white dark:text-white">{totalData}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/15 dark:bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-600/30 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 p-3 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 dark:text-slate-300 text-sm font-medium">Update Terakhir</p>
                <p className="text-lg font-bold text-white dark:text-white">{getLastUpdateTime()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/15 dark:bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-600/30 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-3 rounded-xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 dark:text-slate-300 text-sm font-medium">Sumber Data</p>
                <p className="text-lg font-bold text-white dark:text-white">BMKG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
