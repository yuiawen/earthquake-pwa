
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, X } from 'lucide-react';

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide install button if already installed
    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="lg"
        onClick={handleInstallClick}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl px-6 py-4 group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">INSTAL PWA</p>
            <p className="text-xs opacity-80">Akses offline</p>
          </div>
          <Download className="w-4 h-4 animate-bounce" />
        </div>
      </Button>
      
      {/* Dismiss button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDismiss}
        className="absolute -top-2 -right-2 w-6 h-6 bg-slate-600 hover:bg-slate-700 text-white rounded-full p-1"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default PWAInstallButton;
