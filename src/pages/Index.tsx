
import React, { useState } from 'react';
import { useGempa } from '../hooks/useGempa';
import GempaCard from '../components/GempaCard';
import GempaDetail from '../components/GempaDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { GempaItem } from '../types/gempa';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { RefreshCw, Wifi, WifiOff, AlertTriangle, TrendingUp, Clock, MapPin } from 'lucide-react';

const Index: React.FC = () => {
  const { gempaList, autoGempa, loading, error, isOffline, refetch } = useGempa();
  const [selectedGempa, setSelectedGempa] = useState<GempaItem | null>(null);

  const getLastUpdate = () => {
    const lastUpdate = localStorage.getItem('lastUpdate');
    if (lastUpdate) {
      return new Date(lastUpdate).toLocaleString('id-ID');
    }
    return null;
  };

  if (loading && !gempaList) {
    return <LoadingSpinner />;
  }

  if (error && !gempaList) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  InfoGempa
                </h1>
                <p className="text-blue-100 text-lg opacity-90">
                  Pantau aktivitas seismik Indonesia secara real-time
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  {isOffline ? (
                    <>
                      <WifiOff className="w-4 h-4" />
                      <span className="text-sm font-medium">Offline</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4" />
                      <span className="text-sm font-medium">Online</span>
                    </>
                  )}
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={refetch}
                  disabled={loading || isOffline}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-yellow-300" />
                  <div>
                    <p className="text-white/80 text-sm">Total Data</p>
                    <p className="text-xl font-bold">{gempaList?.Infogempa?.gempa?.length || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-green-300" />
                  <div>
                    <p className="text-white/80 text-sm">Update Terakhir</p>
                    <p className="text-sm font-medium">{getLastUpdate() ? new Date(getLastUpdate()!).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-red-300" />
                  <div>
                    <p className="text-white/80 text-sm">Sumber Data</p>
                    <p className="text-sm font-medium">BMKG Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        {isOffline && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">Mode Offline Aktif</p>
                <p className="text-sm text-orange-600 dark:text-orange-300">Menampilkan data terakhir yang tersimpan</p>
              </div>
            </div>
          </div>
        )}

        {/* Latest Auto Earthquake Alert */}
        {autoGempa?.Infogempa?.gempa && (
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
                onClick={() => setSelectedGempa({
                  DateTime: autoGempa.Infogempa.gempa.DateTime,
                  Coordinates: autoGempa.Infogempa.gempa.Coordinates,
                  Lintang: autoGempa.Infogempa.gempa.Lintang,
                  Bujur: autoGempa.Infogempa.gempa.Bujur,
                  Magnitude: autoGempa.Infogempa.gempa.Magnitude,
                  Kedalaman: autoGempa.Infogempa.gempa.Kedalaman,
                  Wilayah: autoGempa.Infogempa.gempa.Wilayah,
                  Potensi: autoGempa.Infogempa.gempa.Potensi
                })}
                isLatest={true}
              />
            </CardContent>
          </Card>
        )}

        {/* Earthquake Carousel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                Gempa Terkini
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Geser untuk melihat data gempa lainnya</p>
            </div>
          </div>
          
          {gempaList?.Infogempa?.gempa && gempaList.Infogempa.gempa.length > 0 ? (
            <div className="relative">
              <Carousel 
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {gempaList.Infogempa.gempa.map((gempa, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <div className="h-full">
                        <GempaCard
                          gempa={gempa}
                          onClick={() => setSelectedGempa(gempa)}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-6" />
                <CarouselNext className="hidden sm:flex -right-4 lg:-right-6" />
              </Carousel>
              
              {/* Mobile swipe indicator */}
              <div className="sm:hidden mt-4 flex justify-center">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                  <span>Geser untuk melihat lebih banyak</span>
                </div>
              </div>
            </div>
          ) : (
            <Card className="p-8 text-center dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              <p className="text-gray-500 dark:text-gray-400">Belum ada data gempa tersedia</p>
            </Card>
          )}
        </div>

        {/* Detail Modal */}
        {selectedGempa && (
          <GempaDetail
            gempa={selectedGempa}
            onClose={() => setSelectedGempa(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
