
import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, Eye, Gauge, Clock } from 'lucide-react';
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
  const [currentTime, setCurrentTime] = useState(new Date());

  const API_KEY = 'demo';

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-blue-500/10 border border-white/20 dark:border-slate-700/30">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl shadow-lg">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Informasi Cuaca
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Data cuaca real-time untuk Indonesia</p>
          </div>
        </div>
        
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Masukkan nama kota..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 rounded-2xl border-white/20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          />
          <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl px-8 shadow-lg hover:shadow-xl transition-all duration-300">
            Cari
          </Button>
        </div>
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl p-4 border border-orange-200 dark:border-orange-700/50">
          <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
            💡 Demo mode - Dapatkan API key gratis dari WeatherAPI.com untuk data real-time
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : weatherData ? (
        <div className="space-y-8">
          {/* Current Weather with Time */}
          <Card className="bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 text-white border-0 shadow-2xl shadow-blue-500/25 rounded-3xl overflow-hidden">
            <CardContent className="p-10">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-4xl font-bold">{weatherData.location.name}</h2>
                    <p className="text-blue-100 text-lg">{weatherData.location.country}</p>
                  </div>
                  
                  {/* Current Time Section */}
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-cyan-200" />
                      <span className="text-cyan-100 font-medium">Waktu Saat Ini</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatTime(currentTime)}</p>
                    <p className="text-blue-100 text-sm">{formatDate(currentTime)}</p>
                  </div>
                  
                  <div>
                    <p className="text-6xl font-light">{weatherData.current.temp_c}°C</p>
                    <p className="text-blue-100 text-xl mt-2">{weatherData.current.condition.text}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
                    {React.createElement(getWeatherIcon(weatherData.current.condition.text), {
                      className: "w-24 h-24 text-white/90"
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-xl shadow-xl border border-white/20 dark:border-slate-700/30 rounded-3xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Thermometer className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Terasa Seperti</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{weatherData.current.feelslike_c}°C</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-xl shadow-xl border border-white/20 dark:border-slate-700/30 rounded-3xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Kelembaban</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{weatherData.current.humidity}%</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-xl shadow-xl border border-white/20 dark:border-slate-700/30 rounded-3xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Angin</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{weatherData.current.wind_kph} km/h</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-xl shadow-xl border border-white/20 dark:border-slate-700/30 rounded-3xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Gauge className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tekanan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{weatherData.current.pressure_mb} mb</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-xl shadow-xl border border-white/20 dark:border-slate-700/30 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Detail Cuaca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-4">
                  <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-3 rounded-xl">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Jarak Pandang</p>
                    <p className="font-bold text-lg">{weatherData.current.vis_km} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-4">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-xl">
                    <Gauge className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Tekanan Udara</p>
                    <p className="font-bold text-lg">{weatherData.current.pressure_mb} mbar</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-xl rounded-3xl p-12 shadow-xl">
            <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada data cuaca tersedia</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
