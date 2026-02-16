
import { bus } from '../bus/bus';

export function initializeNetworkListener() {
  const updateStatus = () => {
    bus.emit('network/status', {
      online: navigator.onLine,
      timestamp: Date.now()
    });
  };

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  // Initial emit
  updateStatus();
}
