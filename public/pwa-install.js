let deferredPrompt;
let hasFiredInstallable = false;

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/dummy-sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
        showResult('✅ Service Worker registered successfully');
      })
      .catch(err => {
        console.error('SW registration failed:', err);
        showResult('❌ Service Worker registration failed');
      });
  });
}

// Initialize install button
window.addEventListener('DOMContentLoaded', () => {
  const installButton = document.querySelector('#install');
  if (installButton) {
    installButton.addEventListener('click', installApp);
  }
});

// Handle beforeinstallprompt event (once)
window.addEventListener('beforeinstallprompt', e => {
  if (hasFiredInstallable) return;
  hasFiredInstallable = true;

  console.log('BeforeInstallPromptEvent fired');
  e.preventDefault();
  deferredPrompt = e;

  const installButton = document.querySelector('#install');
  if (installButton) {
    installButton.style.display = 'inline-block';
  }

  showResult('✅ App is installable!');
});

// Handle appinstalled event
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  showResult('✅ App installed successfully!');

  const installButton = document.querySelector('#install');
  if (installButton) {
    installButton.style.display = 'none';
  }
});

// Trigger the native install prompt
async function installApp() {
  if (!deferredPrompt) {
    showResult('❌ No deferred prompt available');
    return;
  }

  deferredPrompt.prompt();
  showResult('🆗 Installation dialog opened');

  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    showResult('😀 User accepted the install prompt');
  } else {
    showResult('😟 User dismissed the install prompt');
  }

  deferredPrompt = null;
  const installButton = document.querySelector('#install');
  if (installButton) {
    installButton.style.display = 'none';
  }
}

// showResult with auto‐hide after 4 seconds
function showResult(text) {
  const output = document.querySelector('#pwa-status');
  if (!output) return;

  output.innerHTML = text;
  output.style.display = 'block';
  console.log(text);

  if (output._hideTimeout) clearTimeout(output._hideTimeout);
  output._hideTimeout = setTimeout(() => {
    output.style.display = 'none';
    output.innerHTML = '';
  }, 4000);
}

// Hide install button if already installed
function checkInstallStatus() {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    const installButton = document.querySelector('#install');
    if (installButton) installButton.style.display = 'none';
  }
}

window.addEventListener('load', checkInstallStatus);
