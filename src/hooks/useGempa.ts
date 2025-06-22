
import { useState, useEffect } from 'react';
import { GempaResponse, AutoGempaResponse } from '../types/gempa';

const GEMPA_API = 'https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json';
const AUTO_GEMPA_API = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';

export const useGempa = () => {
  const [gempaList, setGempaList] = useState<GempaResponse | null>(null);
  const [autoGempa, setAutoGempa] = useState<AutoGempaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const fetchGempaData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [gempaResponse, autoGempaResponse] = await Promise.all([
        fetch(GEMPA_API),
        fetch(AUTO_GEMPA_API)
      ]);

      if (!gempaResponse.ok || !autoGempaResponse.ok) {
        throw new Error('Gagal mengambil data gempa');
      }

      const gempaData: GempaResponse = await gempaResponse.json();
      const autoGempaData: AutoGempaResponse = await autoGempaResponse.json();

      setGempaList(gempaData);
      setAutoGempa(autoGempaData);
      
      // Store in localStorage for offline access
      localStorage.setItem('gempaData', JSON.stringify(gempaData));
      localStorage.setItem('autoGempaData', JSON.stringify(autoGempaData));
      localStorage.setItem('lastUpdate', new Date().toISOString());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      
      // Try to load from cache if offline
      const cachedGempa = localStorage.getItem('gempaData');
      const cachedAutoGempa = localStorage.getItem('autoGempaData');
      
      if (cachedGempa && cachedAutoGempa) {
        setGempaList(JSON.parse(cachedGempa));
        setAutoGempa(JSON.parse(cachedAutoGempa));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      fetchGempaData();
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchGempaData();

    // Refresh data every 5 minutes when online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        fetchGempaData();
      }
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return {
    gempaList,
    autoGempa,
    loading,
    error,
    isOffline,
    refetch: fetchGempaData
  };
};
