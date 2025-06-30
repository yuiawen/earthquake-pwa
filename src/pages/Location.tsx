
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Settings, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface LocationData {
  city: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const Location: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [savedLocations, setSavedLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);

  const indonesianCities = [
    { city: 'Jakarta', province: 'DKI Jakarta', latitude: -6.2088, longitude: 106.8456 },
    { city: 'Surabaya', province: 'Jawa Timur', latitude: -7.2575, longitude: 112.7521 },
    { city: 'Bandung', province: 'Jawa Barat', latitude: -6.9175, longitude: 107.6191 },
    { city: 'Medan', province: 'Sumatera Utara', latitude: 3.5952, longitude: 98.6722 },
    { city: 'Semarang', province: 'Jawa Tengah', latitude: -6.9667, longitude: 110.4167 },
    { city: 'Makassar', province: 'Sulawesi Selatan', latitude: -5.1477, longitude: 119.4327 },
    { city: 'Palembang', province: 'Sumatera Selatan', latitude: -2.9167, longitude: 104.7458 },
    { city: 'Tangerang', province: 'Banten', latitude: -6.1783, longitude: 106.6319 },
    { city: 'Bekasi', province: 'Jawa Barat', latitude: -6.2349, longitude: 106.9896 },
    { city: 'Depok', province: 'Jawa Barat', latitude: -6.4025, longitude: 106.7942 },
    { city: 'Batam', province: 'Kepulauan Riau', latitude: 1.1307, longitude: 104.0530 },
    { city: 'Balikpapan', province: 'Kalimantan Timur', latitude: -1.2379, longitude: 116.8969 },
    { city: 'Bandar Lampung', province: 'Lampung', latitude: -5.4292, longitude: 105.2610 },
    { city: 'Malang', province: 'Jawa Timur', latitude: -7.9666, longitude: 112.6326 },
    { city: 'Yogyakarta', province: 'DI Yogyakarta', latitude: -7.7956, longitude: 110.3695 },
  ];

  useEffect(() => {
    // Load saved locations from localStorage
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }

    // Load current location from localStorage
    const current = localStorage.getItem('currentLocation');
    if (current) {
      setCurrentLocation(JSON.parse(current));
    } else {
      // Set default to Jakarta
      const jakarta = {
        city: 'Jakarta',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        latitude: -6.2088,
        longitude: 106.8456,
        timezone: 'Asia/Jakarta'
      };
      setCurrentLocation(jakarta);
      localStorage.setItem('currentLocation', JSON.stringify(jakarta));
    }
  }, []);

  const getCurrentPosition = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // For demo, we'll just set a location based on coordinates
          const newLocation: LocationData = {
            city: 'Lokasi Saat Ini',
            province: 'Terdeteksi GPS',
            country: 'Indonesia',
            latitude,
            longitude,
            timezone: 'Asia/Jakarta'
          };
          setCurrentLocation(newLocation);
          localStorage.setItem('currentLocation', JSON.stringify(newLocation));
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const selectCity = (cityData: any) => {
    const locationData: LocationData = {
      city: cityData.city,
      province: cityData.province,
      country: 'Indonesia',
      latitude: cityData.latitude,
      longitude: cityData.longitude,
      timezone: 'Asia/Jakarta'
    };
    setCurrentLocation(locationData);
    localStorage.setItem('currentLocation', JSON.stringify(locationData));
  };

  const saveLocation = (location: LocationData) => {
    const updated = [...savedLocations.filter(loc => loc.city !== location.city), location];
    setSavedLocations(updated);
    localStorage.setItem('savedLocations', JSON.stringify(updated));
  };

  const removeLocation = (city: string) => {
    const updated = savedLocations.filter(loc => loc.city !== city);
    setSavedLocations(updated);
    localStorage.setItem('savedLocations', JSON.stringify(updated));
  };

  const filteredCities = indonesianCities.filter(city =>
    city.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
    city.province.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-border/50">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Pengaturan Lokasi
        </h1>
        <p className="text-muted-foreground">Atur lokasi untuk mendapatkan informasi gempa dan cuaca yang lebih akurat</p>
      </div>

      {/* Current Location */}
      {currentLocation && (
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Lokasi Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{currentLocation.city}</h3>
              <p className="text-blue-100">{currentLocation.province}, {currentLocation.country}</p>
              <p className="text-sm text-blue-100">
                {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => saveLocation(currentLocation)}
                  disabled={savedLocations.some(loc => loc.city === currentLocation.city)}
                >
                  {savedLocations.some(loc => loc.city === currentLocation.city) ? 'Tersimpan' : 'Simpan Lokasi'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GPS Location */}
      <Card className="bg-card/80 backdrop-blur-md shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-500" />
            Deteksi Lokasi GPS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Gunakan GPS untuk mendeteksi lokasi Anda secara otomatis
          </p>
          <Button
            onClick={getCurrentPosition}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {loading ? 'Mendeteksi...' : 'Deteksi Lokasi Saya'}
          </Button>
        </CardContent>
      </Card>

      {/* Search Cities */}
      <Card className="bg-card/80 backdrop-blur-md shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-green-500" />
            Pilih Kota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Cari kota di Indonesia..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="mb-4"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {filteredCities.map((city, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  currentLocation?.city === city.city
                    ? 'bg-blue-500/20 border-blue-500/50 dark:bg-blue-900/30 dark:border-blue-400/50'
                    : 'bg-muted/50 border-border hover:bg-muted/80'
                }`}
                onClick={() => selectCity(city)}
              >
                <p className="font-medium">{city.city}</p>
                <p className="text-sm text-muted-foreground">{city.province}</p>
                {currentLocation?.city === city.city && (
                  <Badge variant="outline" className="mt-1 text-xs">Aktif</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-md shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-500" />
              Lokasi Tersimpan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">{location.city}</p>
                    <p className="text-sm text-muted-foreground">{location.province}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectCity(location)}
                    >
                      Pilih
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeLocation(location.city)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Location;
