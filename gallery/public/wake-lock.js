// Screen Wake Lock Script
// Include this script in your HTML to prevent the device screen from turning off.
// Example: <script src="/wake-lock.js"></script>

(function () {
  let wakeLock = null;

  async function requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Screen Wake Lock is active');

        wakeLock.addEventListener('release', () => {
          console.log('Screen Wake Lock was released');
        });
      } catch (err) {
        console.error(`Wake Lock error: ${err.name}, ${err.message}`);
      }
    } else {
      console.warn('Screen Wake Lock API not supported in this browser.');
    }
  }

  // Request the wake lock when the script loads
  document.addEventListener('DOMContentLoaded', () => {
    requestWakeLock();
  });

  // Re-request the wake lock when the document becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });
})();
