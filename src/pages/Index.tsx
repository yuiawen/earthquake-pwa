
import React, { useState } from 'react';
import { useGempa } from '../hooks/useGempa';
import GempaDetail from '../components/GempaDetail';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import HeroSection from '../components/HeroSection';
import OfflineIndicator from '../components/OfflineIndicator';
import LatestEarthquakeAlert from '../components/LatestEarthquakeAlert';
import EarthquakeCarousel from '../components/EarthquakeCarousel';
import { GempaItem } from '../types/gempa';

const Index: React.FC = () => {
  const { gempaList, autoGempa, loading, error, isOffline, refetch } = useGempa();
  const [selectedGempa, setSelectedGempa] = useState<GempaItem | null>(null);

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
        <HeroSection
          isOffline={isOffline}
          loading={loading}
          onRefresh={refetch}
          totalData={gempaList?.Infogempa?.gempa?.length || 0}
        />

        {/* Status Indicator */}
        <OfflineIndicator isOffline={isOffline} />

        {/* Latest Auto Earthquake Alert */}
        <LatestEarthquakeAlert
          autoGempa={autoGempa}
          onGempaClick={setSelectedGempa}
        />

        {/* Earthquake Carousel */}
        <EarthquakeCarousel
          gempaList={gempaList}
          onGempaClick={setSelectedGempa}
        />

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
