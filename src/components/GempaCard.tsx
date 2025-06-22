
import React from 'react';
import { MapPin, Clock, Gauge, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GempaItem } from '../types/gempa';

interface GempaCardProps {
  gempa: GempaItem;
  onClick: () => void;
  isLatest?: boolean;
}

const GempaCard: React.FC<GempaCardProps> = ({ gempa, onClick, isLatest }) => {
  const getMagnitudeColor = (magnitude: string) => {
    const mag = parseFloat(magnitude);
    if (mag >= 7) return 'destructive';
    if (mag >= 5) return 'destructive';
    if (mag >= 3) return 'secondary';
    return 'secondary';
  };

  const getMagnitudeBgColor = (magnitude: string) => {
    const mag = parseFloat(magnitude);
    if (mag >= 7) return 'from-red-500 to-red-600 dark:from-red-600 dark:to-red-700';
    if (mag >= 5) return 'from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600';
    if (mag >= 3) return 'from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600';
    return 'from-green-400 to-blue-500 dark:from-green-500 dark:to-blue-600';
  };

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return {
        date: date.toLocaleDateString('id-ID', { 
          day: '2-digit', 
          month: 'short' 
        }),
        time: date.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
    } catch {
      return { date: dateTime, time: '' };
    }
  };

  const { date, time } = formatDateTime(gempa.DateTime);

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group h-full dark:bg-slate-800/50 dark:border-slate-700 ${
        isLatest ? 'ring-2 ring-red-400 dark:ring-red-500 shadow-xl' : 'hover:shadow-lg'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0 h-full">
        {/* Header with magnitude */}
        <div className={`bg-gradient-to-r ${getMagnitudeBgColor(gempa.Magnitude)} p-4 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <div className="text-sm">
                  <div className="font-semibold">{date}</div>
                  <div className="opacity-90 text-xs">{time}</div>
                </div>
              </div>
              {isLatest && (
                <Badge variant="destructive" className="text-xs bg-white/20 text-white border-white/30">
                  Terbaru
                </Badge>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">M {gempa.Magnitude}</div>
              <div className="text-sm opacity-90">Skala Richter</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex-1">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight">
                {gempa.Wilayah}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <Layers className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Kedalaman:</span> {gempa.Kedalaman}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-slate-600">
            <div className="flex justify-between items-center">
              <Badge variant={getMagnitudeColor(gempa.Magnitude)} className="text-xs">
                {parseFloat(gempa.Magnitude) >= 5 ? '⚠️ Kuat' : parseFloat(gempa.Magnitude) >= 3 ? '🟡 Sedang' : '🟢 Ringan'}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {gempa.Coordinates}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GempaCard;
