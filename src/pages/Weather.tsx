
import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, Eye, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '../components/LoadingSpinner';

interface WeatherData {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
    vis_km: number;
    feelslike_c: number;
  };
}

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('Jakarta');
  const [searchCity, setSearchCity] = useState('');

  const API_KEY = 'demo'; // User perlu mengganti dengan API key mereka

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    try {
      // Demo data for now - user needs to get API key from WeatherAPI
      const demoData: WeatherData = {
        location: {
          name: cityName,
          country: 'Indonesia'
        },
        current: {
          temp_c: 28,
          condition: {
            text: 'Partly cloudy',
            icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
          },
          humidity: 75,
          wind_kph: 12,
          pressure_mb: 1013,
          vis_km: 10,
          feelslike_c: 32
        }
      };
      
      setTimeout(() => {
        setWeatherData(demoData);
        setLoading(false);
      }, 1000);
      
      // Real API call would be:
      // const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}&aqi=no`);
      // const data = await response.json();
      // setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity.trim());
      setSearchCity('');
    }
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes('rain')) return CloudRain;
    if (condition.toLowerCase().includes('cloud')) return Cloud;
    return Sun;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Search Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Informasi Cuaca
        </h1>
        <div className="flex gap-2">
          <Input
            placeholder="Masukkan nama kota..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-600 to-cyan-600">
            Cari
          </Button>
        </div>
        <p className="text-sm text-orange-600 mt-2">
          * Demo mode - Dapatkan API key gratis dari WeatherAPI.com untuk data real-time
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : weatherData ? (
        <div className="space-y-6">
          {/* Current Weather */}
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{weatherData.location.name}</h2>
                  <p className="text-blue-100">{weatherData.location.country}</p>
                  <p className="text-5xl font-light mt-4">{weatherData.current.temp_c}°C</p>
                  <p className="text-blue-100 mt-2">{weatherData.current.condition.text}</p>
                </div>
                <div className="text-right">
                  {React.createElement(getWeatherIcon(weatherData.current.condition.text), {
                    className: "w-20 h-20 text-white/80"
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardContent className="p-4 text-center">
                <Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Terasa Seperti</p>
                <p className="text-xl font-bold">{weatherData.current.feelslike_c}°C</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardContent className="p-4 text-center">
                <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Kelembaban</p>
                <p className="text-xl font-bold">{weatherData.current.humidity}%</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardContent className="p-4 text-center">
                <Wind className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Angin</p>
                <p className="text-xl font-bold">{weatherData.current.wind_kph} km/h</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardContent className="p-4 text-center">
                <Gauge className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Tekanan</p>
                <p className="text-xl font-bold">{weatherData.current.pressure_mb} mb</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="bg-white/80 backdrop-blur-md shadow-lg">
            <CardHeader>
              <CardTitle>Detail Cuaca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <span>Jarak Pandang: {weatherData.current.vis_km} km</span>
                </div>
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-gray-500" />
                  <span>Tekanan Udara: {weatherData.current.pressure_mb} mbar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada data cuaca tersedia</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
