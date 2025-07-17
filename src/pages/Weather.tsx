import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, Eye, Gauge, Clock, MapPin, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '../components/LoadingSpinner';

interface WeatherData {
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
    timezone: number;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    visibility?: number;
  }>;
}

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('Jakarta');
  const [searchCity, setSearchCity] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const API_KEY = 'be21f541e438eba961c713159753058d';

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) {
      setError('Silakan masukkan nama kota terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=id`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod !== "200") {
        throw new Error(data.message || 'Gagal mengambil data cuaca');
      }

      setWeatherData(data);
      setIsOffline(false);
      
      // Store in localStorage for offline access
      localStorage.setItem('weatherData', JSON.stringify(data));
      localStorage.setItem('lastWeatherUpdate', new Date().toISOString());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      
      // Try to load from cache if offline
      if (!navigator.onLine) {
        const cachedData = localStorage.getItem('weatherData');
        if (cachedData) {
          setWeatherData(JSON.parse(cachedData));
          setIsOffline(true);
        } else {
          setError('Anda sedang offline dan tidak ada data cuaca yang tersimpan');
        }
      } else {
        setError(`Gagal mengambil data: ${errorMessage}. Pastikan nama kota benar.`);
      }
    } finally {
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
    const iconMap: Record<string, any> = {
      'Clear': Sun,
      'Clouds': Cloud,
      'Rain': CloudRain,
      'Thunderstorm': Cloud,
      'Drizzle': CloudRain,
      'Snow': Cloud,
      'Mist': Cloud,
      'Smoke': Wind,
      'Haze': Cloud,
      'Dust': Cloud,
      'Fog': Cloud,
      'Sand': Wind,
      'Ash': Cloud,
      'Squall': Wind,
      'Tornado': Wind
    };
    
    return iconMap[condition] || Cloud;
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

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 dark:from-slate-800/80 dark:to-slate-900/80 light:from-white/95 light:to-gray-50/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200/50">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl shadow-lg">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Informasi Cuaca
            </h1>
            <p className="text-slate-300 dark:text-slate-300 light:text-gray-600">Data cuaca real-time untuk seluruh dunia</p>
          </div>
        </div>
        
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Masukkan nama kota..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 rounded-2xl border-slate-600/50 dark:border-slate-600/50 light:border-gray-300 bg-slate-700/50 dark:bg-slate-700/50 light:bg-white text-slate-200 dark:text-slate-200 light:text-gray-900 placeholder-slate-400 dark:placeholder-slate-400 light:placeholder-gray-500"
          />
          <Button 
            onClick={handleSearch} 
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl px-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Search className="w-4 h-4 mr-2" />
            Cari
          </Button>
        </div>
        
        {isOffline && (
          <div className="bg-gradient-to-r from-orange-800/50 to-amber-800/50 dark:from-orange-800/50 dark:to-amber-800/50 light:from-orange-100 light:to-amber-100 rounded-2xl p-4 border border-orange-600/50 dark:border-orange-600/50 light:border-orange-300">
            <p className="text-sm text-orange-200 dark:text-orange-200 light:text-orange-800 font-medium">
              ⚠️ Anda sedang offline - Menampilkan data cuaca terakhir
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-gradient-to-r from-red-800/50 to-red-900/50 dark:from-red-800/50 dark:to-red-900/50 light:from-red-100 light:to-red-200 rounded-2xl p-4 border border-red-600/50 dark:border-red-600/50 light:border-red-300">
            <p className="text-sm text-red-200 dark:text-red-200 light:text-red-800 font-medium">
              ❌ {error}
            </p>
          </div>
        )}
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
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-cyan-200" />
                    <div>
                      <h2 className="text-4xl font-bold">{weatherData.city.name}</h2>
                      <p className="text-blue-100 text-lg">{weatherData.city.country}</p>
                    </div>
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
                    <p className="text-6xl font-light">{Math.round(weatherData.list[0].main.temp)}°C</p>
                    <p className="text-blue-100 text-xl mt-2 capitalize">{weatherData.list[0].weather[0].description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
                    {React.createElement(getWeatherIcon(weatherData.list[0].weather[0].main), {
                      className: "w-24 h-24 text-white/90"
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800/80 dark:bg-slate-900/80 light:bg-white/95 backdrop-blur-xl shadow-xl border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200 rounded-3xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Thermometer className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600 font-medium">Terasa Seperti</p>
                <p className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-gray-900">{Math.round(weatherData.list[0].main.feels_like)}°C</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 dark:bg-slate-900/80 light:bg-white/95 backdrop-blur-xl shadow-xl border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200 rounded-3xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600 font-medium">Kelembaban</p>
                <p className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-gray-900">{weatherData.list[0].main.humidity}%</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 dark:bg-slate-900/80 light:bg-white/95 backdrop-blur-xl shadow-xl border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200 rounded-3xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600 font-medium">Angin</p>
                <p className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-gray-900">{weatherData.list[0].wind.speed.toFixed(1)} m/s</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 dark:bg-slate-900/80 light:bg-white/95 backdrop-blur-xl shadow-xl border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200 rounded-3xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Gauge className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600 font-medium">Tekanan</p>
                <p className="text-2xl font-bold text-slate-200 dark:text-slate-200 light:text-gray-900">{weatherData.list[0].main.pressure} mb</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="bg-slate-800/80 dark:bg-slate-900/80 light:bg-white/95 backdrop-blur-xl shadow-xl border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Detail Cuaca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 rounded-2xl p-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-sm">Matahari Terbit</p>
                    <p className="font-bold text-lg text-slate-200 dark:text-slate-200 light:text-gray-900">{formatTimestamp(weatherData.city.sunrise)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 rounded-2xl p-4">
                  <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-3 rounded-xl">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-sm">Matahari Terbenam</p>
                    <p className="font-bold text-lg text-slate-200 dark:text-slate-200 light:text-gray-900">{formatTimestamp(weatherData.city.sunset)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forecast */}
          <Card className="bg-slate-800/80 dark:bg-slate-900/80 light:bg-white/95 backdrop-blur-xl shadow-xl border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Prakiraan Cuaca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {weatherData.list.slice(0, 8).map((item, index) => (
                  <div key={index} className="bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 rounded-2xl p-4 text-center">
                    <p className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-gray-900 mb-2">
                      {formatTimestamp(item.dt)}
                    </p>
                    <div className="flex justify-center mb-2">
                      {React.createElement(getWeatherIcon(item.weather[0].main), {
                        className: "w-8 h-8 text-blue-400"
                      })}
                    </div>
                    <p className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-gray-900">{Math.round(item.main.temp)}°C</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-slate-800/80 dark:bg-slate-900/80 light:bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-xl">
            <Cloud className="w-16 h-16 text-slate-400 dark:text-slate-400 light:text-gray-500 mx-auto mb-4" />
            <p className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-lg">Tidak ada data cuaca tersedia</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
