
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
    // Set gempa terbaru sebagai default saat data tersedia
    if (autoGempa?.Infogempa?.gempa && !selectedGempa) {
      setSelectedGempa({
        ...autoGempa.Infogempa.gempa,
        isLatest: true
      });
    }
  }, [autoGempa]);

  const parseCoordinates = (coordinates: string) => {
    console.log('Parsing coordinates:', coordinates); // Debug log
    
    // Handle different coordinate formats
    if (coordinates.includes(',')) {
      // Format: "-3.25,130.35" or "5.40,126.02"
      const [latStr, lngStr] = coordinates.split(',').map(s => s.trim());
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        console.log('Parsed coordinates:', { lat, lng }); // Debug log
        return { lat, lng };
      }
    }
    
    if (coordinates.includes(' - ')) {
      // Format: "7.42 LS - 106.86 BT"
      const parts = coordinates.split(' - ');
      if (parts.length === 2) {
        const latPart = parts[0].trim();
        const lngPart = parts[1].trim();
        
        const lat = parseFloat(latPart.split(' ')[0]) * (latPart.includes('LS') ? -1 : 1);
        const lng = parseFloat(lngPart.split(' ')[0]) * (lngPart.includes('BB') ? -1 : 1);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          console.log('Parsed coordinates:', { lat, lng }); // Debug log
          return { lat, lng };
        }
      }
    }
    
    // Default to Jakarta if parsing fails
    console.log('Failed to parse coordinates, using default'); // Debug log
    return { lat: -6.2, lng: 106.816 };
  };

  const handleGempaSelect = (gempa: any, isLatest = false) => {
    console.log('Selecting gempa:', gempa); // Debug log
    const gempaData = isLatest ? { ...gempa, isLatest: true } : gempa;
    setSelectedGempa(gempaData);
  };

  if (loading && !gempaList) {
    return <LoadingSpinner />;
  }

  const coordinates = selectedGempa ? parseCoordinates(selectedGempa.Coordinates) : { lat: -6.2, lng: 106.816 };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-slate-800/90 dark:bg-slate-900/90 light:bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Peta Lokasi Gempa
        </h1>
        <p className="text-slate-300 dark:text-slate-300 light:text-gray-600">Visualisasi lokasi gempa bumi di Indonesia</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          {selectedGempa ? (
            <GempaMap
              key={`${selectedGempa.DateTime}-${coordinates.lat}-${coordinates.lng}`}
              latitude={coordinates.lat}
              longitude={coordinates.lng}
              magnitude={selectedGempa.Magnitude}
              wilayah={selectedGempa.Wilayah}
            />
          ) : (
            <Card className="bg-slate-800/90 dark:bg-slate-900/90 light:bg-white/95 backdrop-blur-md shadow-lg border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200">
              <CardContent className="flex items-center justify-center h-96">
                <p className="text-slate-400 dark:text-slate-400 light:text-gray-600">Pilih gempa dari daftar untuk melihat lokasi</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Earthquake Info */}
          {selectedGempa && (
            <Card className="bg-slate-800/90 dark:bg-slate-900/90 light:bg-white/95 backdrop-blur-md shadow-lg border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200">
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
                  <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600">Lokasi</p>
                  <p className="font-medium text-slate-200 dark:text-slate-200 light:text-gray-900">{selectedGempa.Wilayah}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600">Magnitudo</p>
                    <p className="font-bold text-lg text-slate-200 dark:text-slate-200 light:text-gray-900">{selectedGempa.Magnitude} SR</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600">Kedalaman</p>
                    <p className="font-medium text-slate-200 dark:text-slate-200 light:text-gray-900">{selectedGempa.Kedalaman}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600">Koordinat</p>
                  <p className="font-mono text-sm text-slate-200 dark:text-slate-200 light:text-gray-900">{selectedGempa.Coordinates}</p>
                  <p className="font-mono text-xs text-slate-400 dark:text-slate-400 light:text-gray-500">Parsed: {coordinates.lat.toFixed(3)}, {coordinates.lng.toFixed(3)}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600">Waktu</p>
                  <p className="font-medium text-slate-200 dark:text-slate-200 light:text-gray-900">{selectedGempa.DateTime}</p>
                </div>

                {selectedGempa.Potensi && (
                  <div>
                    <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600">Potensi</p>
                    <p className="font-medium text-orange-400 dark:text-orange-400 light:text-orange-600">{selectedGempa.Potensi}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Earthquake List */}
          <Card className="bg-slate-800/90 dark:bg-slate-900/90 light:bg-white/95 backdrop-blur-md shadow-lg border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200">
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
                      ? 'bg-blue-600/30 border-blue-500/50'
                      : 'bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 border-slate-600/50 dark:border-slate-600/50 light:border-gray-300 hover:bg-slate-700/80 dark:hover:bg-slate-700/80 light:hover:bg-gray-200'
                  }`}
                  onClick={() => handleGempaSelect(autoGempa.Infogempa.gempa, true)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="destructive" className="text-xs">Terbaru</Badge>
                    <span className="font-bold text-slate-200 dark:text-slate-200 light:text-gray-900">M {autoGempa.Infogempa.gempa.Magnitude}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 dark:text-slate-200 light:text-gray-900">{autoGempa.Infogempa.gempa.Wilayah}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-600">{autoGempa.Infogempa.gempa.DateTime}</p>
                </div>
              )}

              {/* Other Earthquakes */}
              {gempaList?.Infogempa?.gempa?.slice(0, 10).map((gempa, index) => (
                <div
                  key={`${gempa.DateTime}-${index}`}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedGempa && !selectedGempa.isLatest && selectedGempa.DateTime === gempa.DateTime
                      ? 'bg-blue-600/30 border-blue-500/50'
                      : 'bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 border-slate-600/50 dark:border-slate-600/50 light:border-gray-300 hover:bg-slate-700/80 dark:hover:bg-slate-700/80 light:hover:bg-gray-200'
                  }`}
                  onClick={() => handleGempaSelect(gempa)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-slate-400 dark:text-slate-400 light:text-gray-600" />
                    <span className="font-bold text-slate-200 dark:text-slate-200 light:text-gray-900">M {gempa.Magnitude}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 dark:text-slate-200 light:text-gray-900">{gempa.Wilayah}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-600">{gempa.DateTime}</p>
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
