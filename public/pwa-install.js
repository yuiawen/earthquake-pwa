
// PWA Installation Handler
let deferredPrompt;

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/dummy-sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        showResult('✅ Service Worker registered successfully');
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
        showResult('❌ Service Worker registration failed');
      });
  });
}

// Initialize PWA install functionality
window.addEventListener('DOMContentLoaded', () => {
  const installButton = document.querySelector('#install');
  if (installButton) {
    installButton.addEventListener('click', installApp);
  }
  
  // Show debugging info
  showResult('🔍 Checking PWA installability...', true);
  
  if (!('BeforeInstallPromptEvent' in window)) {
    showResult('❌ BeforeInstallPromptEvent NOT supported', true);
  } else {
    showResult('✅ BeforeInstallPromptEvent supported', true);
  }
});

// Handle beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('BeforeInstallPromptEvent fired');
  e.preventDefault();
  deferredPrompt = e;
  
  const installButton = document.querySelector('#install');
  if (installButton) {
    installButton.style.display = 'block';
  }
  
  showResult('✅ BeforeInstallPromptEvent fired - App can be installed!', true);
});

// Handle app installed event
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  showResult('✅ App installed successfully!', true);
  
  const installButton = document.querySelector('#install');
  if (installButton) {
    installButton.style.display = 'none';
  }
});

// Install app function
async function installApp() {
  if (!deferredPrompt) {
    showResult('❌ No deferred prompt available', true);
    return;
  }

  try {
    deferredPrompt.prompt();
    showResult('🆗 Installation dialog opened', true);
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      showResult('😀 User accepted the install prompt', true);
    } else {
      showResult('😟 User dismissed the install prompt', true);
    }
    
    deferredPrompt = null;
    document.querySelector('#install').style.display = 'none';
  } catch (error) {
    console.error('Error during installation:', error);
    showResult('❌ Installation failed: ' + error.message, true);
  }
}

// Show result messages
function showResult(text, append = false) {
  const output = document.querySelector('#pwa-status');
  if (output) {
    output.innerHTML = append ? `${output.innerHTML}<br>${text}` : text;
    output.style.display = 'block';
  }
  console.log(text);
}

// Check if app is already installed
function checkInstallStatus() {
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    showResult('✅ App is running in standalone mode (installed)', true);
    const installButton = document.querySelector('#install');
    if (installButton) {
      installButton.style.display = 'none';
    }
  } else {
    showResult('📱 App is running in browser mode', true);
  }
}

// Check install status on load
window.addEventListener('load', checkInstallStatus);
