import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, Clock } from 'lucide-react';
import GempaMap from '../components/GempaMap';
import { useGempa } from '../hooks/useGempa';
import LoadingSpinner from '../components/LoadingSpinner';

const MapPage: React.FC = () => {
  const { gempaList, autoGempa, loading } = useGempa();
  const [selectedGempa, setSelectedGempa] = useState<any>(null);

  useEffect(() => {
    // Set gempa terbaru sebagai default
    if (autoGempa?.Infogempa?.gempa) {
      setSelectedGempa({
        ...autoGempa.Infogempa.gempa,
        isLatest: true
      });
    }
  }, [autoGempa]);

  const parseCoordinates = (coordinates: string) => {
    // Format: "7.42 LS - 106.86 BT"
    const parts = coordinates.split(' - ');
    if (parts.length !== 2) return { lat: -6.2, lng: 106.816 }; // Default Jakarta
    
    const latPart = parts[0].trim();
    const lngPart = parts[1].trim();
    
    const lat = parseFloat(latPart.split(' ')[0]) * (latPart.includes('LS') ? -1 : 1);
    const lng = parseFloat(lngPart.split(' ')[0]) * (lngPart.includes('BB') ? -1 : 1);
    
    return { lat, lng };
  };

  if (loading && !gempaList) {
    return <LoadingSpinner />;
  }

  const coordinates = selectedGempa ? parseCoordinates(selectedGempa.Coordinates) : { lat: -6.2, lng: 106.816 };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Peta Lokasi Gempa
        </h1>
        <p className="text-gray-600">Visualisasi lokasi gempa bumi di Indonesia</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-md shadow-lg">
            <CardContent className="p-0">
              {selectedGempa && (
                <GempaMap
                  latitude={coordinates.lat}
                  longitude={coordinates.lng}
                  magnitude={selectedGempa.Magnitude}
                  wilayah={selectedGempa.Wilayah}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Earthquake Info */}
          {selectedGempa && (
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  Gempa Terpilih
                  {selectedGempa.isLatest && (
                    <Badge variant="destructive" className="text-xs">Terbaru</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Lokasi</p>
                  <p className="font-medium">{selectedGempa.Wilayah}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Magnitudo</p>
                    <p className="font-bold text-lg">{selectedGempa.Magnitude} SR</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kedalaman</p>
                    <p className="font-medium">{selectedGempa.Kedalaman}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Koordinat</p>
                  <p className="font-mono text-sm">{selectedGempa.Coordinates}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Waktu</p>
                  <p className="font-medium">{selectedGempa.DateTime}</p>
                </div>

                {selectedGempa.Potensi && (
                  <div>
                    <p className="text-sm text-gray-600">Potensi</p>
                    <p className="font-medium text-orange-600">{selectedGempa.Potensi}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Earthquake List */}
          <Card className="bg-white/80 backdrop-blur-md shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                Daftar Gempa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {/* Latest Earthquake */}
              {autoGempa?.Infogempa?.gempa && (
                <div
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedGempa?.isLatest
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedGempa({
                    ...autoGempa.Infogempa.gempa,
                    isLatest: true
                  })}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="destructive" className="text-xs">Terbaru</Badge>
                    <span className="font-bold">M {autoGempa.Infogempa.gempa.Magnitude}</span>
                  </div>
                  <p className="text-sm font-medium">{autoGempa.Infogempa.gempa.Wilayah}</p>
                  <p className="text-xs text-gray-500">{autoGempa.Infogempa.gempa.DateTime}</p>
                </div>
              )}

              {/* Other Earthquakes */}
              {gempaList?.Infogempa?.gempa?.slice(0, 10).map((gempa, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedGempa && !selectedGempa.isLatest && selectedGempa.DateTime === gempa.DateTime
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedGempa(gempa)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="font-bold">M {gempa.Magnitude}</span>
                  </div>
                  <p className="text-sm font-medium">{gempa.Wilayah}</p>
                  <p className="text-xs text-gray-500">{gempa.DateTime}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
