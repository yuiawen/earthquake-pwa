
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

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize map
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
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 10px;
        color: ${parseFloat(magnitude) >= 5 ? 'white' : 'black'};
      ">${magnitude}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add marker
    window.L.marker([latitude, longitude], { icon: markerIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div style="text-align: center;">
          <strong>${wilayah}</strong><br>
          Magnitudo: ${magnitude} SR<br>
          Koordinat: ${latitude}, ${longitude}
        </div>
      `)
      .openPopup();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, magnitude, wilayah]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lokasi Gempa</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg border border-gray-200"
          style={{ minHeight: '256px' }}
        />
        <div className="mt-3 text-sm text-gray-600">
          <p><strong>Koordinat:</strong> {latitude}, {longitude}</p>
          <p><strong>Wilayah:</strong> {wilayah}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GempaMap;
