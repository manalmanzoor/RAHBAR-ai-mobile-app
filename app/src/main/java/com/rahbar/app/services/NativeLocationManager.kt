package com.rahbar.app.services

import android.annotation.SuppressLint
import android.content.Context
import android.location.Geocoder
import android.location.Location
import android.os.Build
import android.util.Log
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.Locale

data class NativeLocationResult(
    val streetName: String,
    val isLiveGps: Boolean,
    val accuracyLabel: String? = null,
    val errorDetails: String? = null
)

class NativeLocationManager(private val context: Context) {

    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    @SuppressLint("MissingPermission")
    suspend fun getCurrentLocation(fallbackStreet: String = "Street 12, Soan Garden"): NativeLocationResult =
        withContext(Dispatchers.IO) {
            try {
                val cancellationSource = CancellationTokenSource()
                val locationTask = fusedLocationClient.getCurrentLocation(
                    Priority.PRIORITY_HIGH_ACCURACY,
                    cancellationSource.token
                )

                var location: Location? = null
                val startTime = System.currentTimeMillis()
                while (!locationTask.isComplete && System.currentTimeMillis() - startTime < 10000) {
                    Thread.sleep(100)
                }

                if (locationTask.isSuccessful && locationTask.result != null) {
                    location = locationTask.result
                }

                if (location != null) {
                    val accuracyMeters = location.accuracy.toInt()
                    val accuracyLabel = "±${accuracyMeters}m (GPS)"
                    val streetName = reverseGeocode(location.latitude, location.longitude, accuracyMeters)

                    NativeLocationResult(
                        streetName = streetName,
                        isLiveGps = true,
                        accuracyLabel = accuracyLabel
                    )
                } else {
                    NativeLocationResult(
                        streetName = fallbackStreet,
                        isLiveGps = false,
                        errorDetails = "Could not get fresh GPS fix. Using default street."
                    )
                }
            } catch (e: Exception) {
                Log.w("NativeLocationManager", "Location fetch error", e)
                NativeLocationResult(
                    streetName = fallbackStreet,
                    isLiveGps = false,
                    errorDetails = e.localizedMessage ?: "GPS location request failed."
                )
            }
        }

    private fun reverseGeocode(lat: Double, lng: Double, accuracy: Int): String {
        try {
            if (Geocoder.isPresent()) {
                val geocoder = Geocoder(context, Locale.getDefault())
                @Suppress("DEPRECATION")
                val addresses = geocoder.getFromLocation(lat, lng, 1)
                if (!addresses.isNullOrEmpty()) {
                    val addr = addresses[0]
                    val featureName = addr.featureName ?: addr.thoroughfare ?: addr.subLocality
                    val subLocality = addr.subLocality ?: addr.locality ?: "Islamabad"
                    if (featureName != null && subLocality != null) {
                        return "$featureName, $subLocality (±${accuracy}m)"
                    } else if (subLocality != null) {
                        return "$subLocality (±${accuracy}m)"
                    }
                }
            }
        } catch (e: Exception) {
            Log.w("NativeLocationManager", "Geocoder error: ${e.message}")
        }
        return "GPS Fix (${String.format(Locale.US, "%.4f", lat)}, ${String.format(Locale.US, "%.4f", lng)}) (±${accuracy}m)"
    }
}
