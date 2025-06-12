// Updated for device management
package com.omeratt.rnnetvision;

import android.os.Build;
import android.content.Context;
import android.provider.Settings;

import org.json.JSONObject;
import org.json.JSONException;

import java.util.UUID;

public class DeviceInfoProvider {
    private static String uniqueDeviceId;
    private static final String DEVICE_ID_PREF = "net_vision_device_id";

    public static String getDeviceId(Context context) {
        if (uniqueDeviceId == null) {
            try {
                // Try to get Android ID first
                uniqueDeviceId = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
                
                // If not available, create and store a random UUID
                if (uniqueDeviceId == null || uniqueDeviceId.equals("") || uniqueDeviceId.equals("9774d56d682e549c")) {
                    // Android ID might be null or a standard emulator ID
                    uniqueDeviceId = UUID.randomUUID().toString();
                }
            } catch (Exception e) {
                // Fallback to random UUID if there's any issue
                uniqueDeviceId = UUID.randomUUID().toString();
            }
        }
        return uniqueDeviceId;
    }

    public static JSONObject getDeviceInfoJson(Context context) {
        JSONObject deviceInfo = new JSONObject();
        try {
            // Get device ID
            String deviceId = getDeviceId(context);
            
            // Create a device name based on model & manufacturer
            String deviceName = Build.MANUFACTURER + " " + Build.MODEL;
            
            deviceInfo.put("type", "device-info");
            deviceInfo.put("deviceId", deviceId);
            deviceInfo.put("deviceName", deviceName);
            deviceInfo.put("platform", "android");
            deviceInfo.put("osVersion", Build.VERSION.RELEASE);
            deviceInfo.put("apiLevel", Build.VERSION.SDK_INT);
            deviceInfo.put("manufacturer", Build.MANUFACTURER);
            deviceInfo.put("model", Build.MODEL);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return deviceInfo;
    }
}
