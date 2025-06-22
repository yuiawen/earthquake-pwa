
import React from 'react';
import { X, MapPin, Clock, Gauge, Layers, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GempaItem } from '../types/gempa';
import GempaMap from './GempaMap';

interface GempaDetailProps {
  gempa: GempaItem;
  onClose: () => void;
}

const GempaDetail: React.FC<GempaDetailProps> = ({ gempa, onClose }) => {
  const parseCoordinates = (coordinates: string) => {
    const [lat, lng] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
    return { latitude: lat, longitude: lng };
  };

  const { latitude, longitude } = parseCoordinates(gempa.Coordinates);

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return {
        date: date.toLocaleDateString('id-ID', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        })
      };
    } catch {
      return { date: dateTime, time: '' };
    }
  };

  const { date, time } = formatDateTime(gempa.DateTime);

  const getMagnitudeInfo = (magnitude: string) => {
    const mag = parseFloat(magnitude);
    if (mag >= 7) return { 
      level: 'Sangat Kuat', 
      color: 'destructive',
      description: 'Dapat menyebabkan kerusakan parah' 
    };
    if (mag >= 5) return { 
      level: 'Kuat', 
      color: 'orange',
      description: 'Dapat menyebabkan kerusakan ringan hingga sedang' 
    };
    if (mag >= 3) return { 
      level: 'Sedang', 
      color: 'yellow',
      description: 'Dapat dirasakan oleh orang' 
    };
    return { 
      level: 'Lemah', 
      color: 'secondary',
      description: 'Umumnya tidak dirasakan' 
    };
  };

  const magnitudeInfo = getMagnitudeInfo(gempa.Magnitude);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Detail Gempa Bumi</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Alert for strong earthquakes */}
          {parseFloat(gempa.Magnitude) >= 5 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Peringatan Gempa Kuat</span>
                </div>
                <p className="text-sm text-orange-600 mt-1">
                  Gempa dengan magnitudo {gempa.Magnitude} berpotensi menyebabkan kerusakan. 
                  Tetap waspada dan siaga.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Informasi Waktu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-semibold">Tanggal:</span> {date}
              </div>
              <div>
                <span className="font-semibold">Waktu:</span> {time} WIB
              </div>
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-semibold">Wilayah:</span> {gempa.Wilayah}
              </div>
              <div>
                <span className="font-semibold">Koordinat:</span> {gempa.Coordinates}
              </div>
              <div>
                <span className="font-semibold">Lintang:</span> {gempa.Lintang}
              </div>
              <div>
                <span className="font-semibold">Bujur:</span> {gempa.Bujur}
              </div>
            </CardContent>
          </Card>

          {/* Technical Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Data Teknis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Magnitudo:</span>
                <div className="flex items-center gap-2">
                  <Badge variant={magnitudeInfo.color as any}>
                    {gempa.Magnitude} SR
                  </Badge>
                  <span className="text-sm">({magnitudeInfo.level})</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Kedalaman:</span>
                <span>{gempa.Kedalaman}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Potensi:</span>
                <span>{gempa.Potensi || 'Tidak ada informasi'}</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {magnitudeInfo.description}
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <GempaMap 
            latitude={latitude}
            longitude={longitude}
            magnitude={gempa.Magnitude}
            wilayah={gempa.Wilayah}
          />

          {/* Footer Info */}
          <div className="text-xs text-gray-500 text-center">
            Data dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
          </div>
        </div>
      </div>
    </div>
  );
};

export default GempaDetail;
