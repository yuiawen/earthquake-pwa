
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, X, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installStatus, setInstallStatus] = useState<string>('Menunggu event...');

  useEffect(() => {
    // Check if app is already installed
    const checkInstallStatus = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setInstallStatus('Sudah terinstal');
        setIsVisible(false); // Hide button if already installed
        console.log('App is already installed');
        return;
      }
      setInstallStatus('Belum terinstal');
    };

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('BeforeInstallPromptEvent fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstallStatus('Siap diinstal!');
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setInstallStatus('Berhasil diinstal!');
      setDeferredPrompt(null);
      // Hide button after successful installation
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    checkInstallStatus();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available - showing info');
      setInstallStatus('Event belum tersedia. Coba refresh halaman.');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User response to the install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        setInstallStatus('Sedang menginstal...');
        setIsInstalled(true);
      } else {
        setInstallStatus('Instalasi dibatalkan');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during installation:', error);
      setInstallStatus('Error saat instalasi');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Hide button if not visible or already installed
  if (!isVisible || isInstalled) return null;

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
            <p className="text-xs opacity-80">{installStatus}</p>
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
