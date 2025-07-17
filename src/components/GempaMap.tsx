
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GempaMapProps {
  latitude: number;
  longitude: number;
  magnitude: string;
  wilayah: string;
}

declare global {
  interface Window {
    L: any;
  }
}

const GempaMap: React.FC<GempaMapProps> = ({ latitude, longitude, magnitude, wilayah }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet if not already loaded
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current || !window.L) return;

      console.log('Initializing map with coordinates:', latitude, longitude);

      // Remove existing map if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize new map
      mapInstanceRef.current = window.L.map(mapRef.current).setView([latitude, longitude], 8);

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Create custom icon based on magnitude
      const getMarkerColor = (mag: string) => {
        const magnitude = parseFloat(mag);
        if (magnitude >= 7) return 'red';
        if (magnitude >= 5) return 'orange';
        if (magnitude >= 3) return 'yellow';
        return 'green';
      };

      const markerIcon = window.L.divIcon({
        className: 'custom-earthquake-marker',
        html: `<div style="
          background-color: ${getMarkerColor(magnitude)};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 11px;
          color: ${parseFloat(magnitude) >= 5 ? 'white' : 'black'};
        ">${magnitude}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Add marker
      markerRef.current = window.L.marker([latitude, longitude], { icon: markerIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="text-align: center; min-width: 200px;">
            <strong style="font-size: 14px; color: #333;">${wilayah}</strong><br>
            <div style="margin: 8px 0;">
              <span style="background: ${getMarkerColor(magnitude)}; color: ${parseFloat(magnitude) >= 5 ? 'white' : 'black'}; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                Magnitudo: ${magnitude} SR
              </span>
            </div>
            <small style="color: #666;">Koordinat: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}</small>
          </div>
        `)
        .openPopup();

      console.log('Map initialized successfully');
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, magnitude, wilayah]);

  return (
    <Card className="bg-slate-800/90 dark:bg-slate-900/90 light:bg-white/95 backdrop-blur-md shadow-lg border border-slate-700/50 dark:border-slate-700/50 light:border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg text-slate-200 dark:text-slate-200 light:text-gray-900">Lokasi Gempa</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-80 rounded-lg border border-slate-700/50 dark:border-slate-700/50 light:border-gray-300"
          style={{ minHeight: '320px' }}
        />
        <div className="mt-3 text-sm text-slate-300 dark:text-slate-300 light:text-gray-700 space-y-1">
          <p><strong>Koordinat:</strong> {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
          <p><strong>Wilayah:</strong> {wilayah}</p>
          <p><strong>Magnitudo:</strong> {magnitude} SR</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GempaMap;
