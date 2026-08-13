export interface LocationResult {
  streetName: string;
  isLiveGps: boolean;
  coords?: {
    lat: number;
    lng: number;
    accuracy?: number; // Accuracy radius in meters
    heading?: number | null;
    speed?: number | null;
  };
  accuracyLabel?: string; // e.g. "±12m (GPS)"
  errorDetails?: string;
}

export const KNOWN_STREETS = [
  'Street 12, Soan Garden',
  'Street 4, G-9, Islamabad',
  'Kuri Road Feeder Area',
  'Sector F-10, Islamabad',
  'Gulberg Greens, Islamabad',
];

let activeWatchId: number | null = null;

/**
 * Reverse geocodes coordinates to a clean street name using Nominatim & BigDataCloud fallback.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
  accuracy?: number
): Promise<string> {
  const accuracyText = accuracy ? ` (±${Math.round(accuracy)}m)` : '';

  // 1. Try OpenStreetMap Nominatim with 5s AbortController timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: { 'Accept-Language': 'en,ur' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};

      const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || addr.residential;
      const suburb = addr.suburb || addr.neighbourhood || addr.city_district || addr.district;
      const city = addr.city || addr.town || addr.county || 'Islamabad';

      if (road && suburb) {
        return `${road}, ${suburb}${accuracyText}`;
      } else if (suburb) {
        return `${suburb}, ${city}${accuracyText}`;
      } else if (road) {
        return `${road}, ${city}${accuracyText}`;
      }
    }
  } catch (err) {
    console.warn('[LocationService] Nominatim geocode failed or timed out:', err);
  }

  // 2. Fallback to BigDataCloud client API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.city || data.principalSubdivision;
      if (locality) {
        return `${locality}, ${data.countryName || 'Pakistan'}${accuracyText}`;
      }
    }
  } catch (err) {
    console.warn('[LocationService] BigDataCloud geocode failed:', err);
  }

  // 3. Precise coordinate label fallback
  return `GPS Fix (${lat.toFixed(4)}, ${lng.toFixed(4)})${accuracyText}`;
}

/**
 * Detect current location once with maximum accuracy (maximumAge: 0, enableHighAccuracy: true)
 */
export async function detectLocation(
  fallbackStreet: string = 'Street 12, Soan Garden'
): Promise<LocationResult> {
  if (!('geolocation' in navigator)) {
    return {
      streetName: fallbackStreet,
      isLiveGps: false,
      errorDetails: 'Geolocation API not supported by this browser',
    };
  }

  return new Promise((resolve) => {
    console.log('[LocationService] Requesting fresh GPS location fix...');

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true, // Forces hardware GPS on mobile devices
      timeout: 15000,           // 15s timeout for cold GPS fix
      maximumAge: 0,            // STRICTLY ZERO: Do not serve stale cached fixes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy, heading, speed } = position.coords;
        console.log(`[LocationService] GPS Fix obtained: Lat=${latitude}, Lng=${longitude}, Accuracy=±${accuracy}m`);

        const accuracyLabel = accuracy <= 25 ? `±${Math.round(accuracy)}m (GPS)` : `±${Math.round(accuracy)}m (Network)`;
        const streetName = await reverseGeocode(latitude, longitude, accuracy);

        resolve({
          streetName,
          isLiveGps: true,
          coords: {
            lat: latitude,
            lng: longitude,
            accuracy,
            heading,
            speed,
          },
          accuracyLabel,
        });
      },
      (error) => {
        console.warn('[LocationService] Geolocation error:', error.code, error.message);
        let errorMsg = 'GPS signal lost or unavailable.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied by user.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'GPS location request timed out. Check sky view.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location position unavailable.';
        }

        resolve({
          streetName: fallbackStreet,
          isLiveGps: false,
          errorDetails: errorMsg,
        });
      },
      geoOptions
    );
  });
}

/**
 * Start continuous live location tracking using watchPosition
 */
export function startLiveTracking(
  onUpdate: (result: LocationResult) => void,
  onError?: (errorMsg: string) => void
): () => void {
  stopLiveTracking();

  if (!('geolocation' in navigator)) {
    onError?.('Geolocation not supported');
    return () => {};
  }

  const geoOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0, // Strict fresh updates
  };

  console.log('[LocationService] Starting live watchPosition continuous tracking...');

  activeWatchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy, heading, speed } = position.coords;
      console.log(`[LocationService] Live watch position update: Lat=${latitude}, Lng=${longitude}, Accuracy=±${accuracy}m`);

      const accuracyLabel = accuracy <= 25 ? `±${Math.round(accuracy)}m (GPS)` : `±${Math.round(accuracy)}m (Network)`;
      const streetName = await reverseGeocode(latitude, longitude, accuracy);

      onUpdate({
        streetName,
        isLiveGps: true,
        coords: { lat: latitude, lng: longitude, accuracy, heading, speed },
        accuracyLabel,
      });
    },
    (err) => {
      console.warn('[LocationService] watchPosition error:', err.message);
      onError?.(err.message);
    },
    geoOptions
  );

  return () => stopLiveTracking();
}

/**
 * Stop active watchPosition session
 */
export function stopLiveTracking(): void {
  if (activeWatchId !== null && 'geolocation' in navigator) {
    navigator.geolocation.clearWatch(activeWatchId);
    activeWatchId = null;
    console.log('[LocationService] Stopped watchPosition continuous tracking');
  }
}
