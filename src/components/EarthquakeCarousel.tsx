
import React from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import GempaCard from './GempaCard';
import { GempaResponse, GempaItem } from '../types/gempa';

interface EarthquakeCarouselProps {
  gempaList: GempaResponse | null;
  onGempaClick: (gempa: GempaItem) => void;
}

const EarthquakeCarousel: React.FC<EarthquakeCarouselProps> = ({ 
  gempaList, 
  onGempaClick 
}) => {
  return (
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
                      onClick={() => onGempaClick(gempa)}
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
  );
};

export default EarthquakeCarousel;
