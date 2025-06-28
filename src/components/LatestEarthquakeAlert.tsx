
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import GempaCard from './GempaCard';
import { AutoGempaResponse, GempaItem } from '../types/gempa';

interface LatestEarthquakeAlertProps {
  autoGempa: AutoGempaResponse | null;
  onGempaClick: (gempa: GempaItem) => void;
}

const LatestEarthquakeAlert: React.FC<LatestEarthquakeAlertProps> = ({ 
  autoGempa, 
  onGempaClick 
}) => {
  if (!autoGempa?.Infogempa?.gempa) return null;

  const handleClick = () => {
    onGempaClick({
      DateTime: autoGempa.Infogempa.gempa.DateTime,
      Coordinates: autoGempa.Infogempa.gempa.Coordinates,
      Lintang: autoGempa.Infogempa.gempa.Lintang,
      Bujur: autoGempa.Infogempa.gempa.Bujur,
      Magnitude: autoGempa.Infogempa.gempa.Magnitude,
      Kedalaman: autoGempa.Infogempa.gempa.Kedalaman,
      Wilayah: autoGempa.Infogempa.gempa.Wilayah,
      Potensi: autoGempa.Infogempa.gempa.Potensi
    });
  };

  return (
    <Card className="border-red-200 dark:border-red-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 text-white">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          🚨 Gempa Terbaru Otomatis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <GempaCard
          gempa={{
            DateTime: autoGempa.Infogempa.gempa.DateTime,
            Coordinates: autoGempa.Infogempa.gempa.Coordinates,
            Lintang: autoGempa.Infogempa.gempa.Lintang,
            Bujur: autoGempa.Infogempa.gempa.Bujur,
            Magnitude: autoGempa.Infogempa.gempa.Magnitude,
            Kedalaman: autoGempa.Infogempa.gempa.Kedalaman,
            Wilayah: autoGempa.Infogempa.gempa.Wilayah,
            Potensi: autoGempa.Infogempa.gempa.Potensi
          }}
          onClick={handleClick}
          isLatest={true}
        />
      </CardContent>
    </Card>
  );
};

export default LatestEarthquakeAlert;
