# Device Management Feature - Implementation Guide

This document summarizes the implementation of the device management feature in RN Net Vision debugger, which allows tracking and filtering network logs by device.

## Architecture Overview

The device management system consists of several components:

1. **Server-side device tracking**

   - `debug-server.js` tracks connected devices in a `connectedDevices` Map
   - Emits 'device-connected' and 'device-disconnected' events

2. **Client-side device state management**

   - `DeviceContext.tsx` maintains device state in the web viewer
   - Handles device connections, disconnections, and selection

3. **Network log augmentation**

   - Each network log is tagged with device information
   - Includes deviceId, deviceName, and devicePlatform

4. **UI Components**
   - `DeviceSelector.tsx` allows users to filter logs by device
   - Header component displays device connection counts
   - NetworkLog displays device information for each log entry

## Data Flow

1. Device connects to debug server

   ```
   Device → debug-server: { type: 'device-info', deviceId, deviceName, platform }
   ```

2. Debug server registers device

   ```
   debug-server → connectedDevices.set(id, { ...deviceInfo, ws })
   ```

3. Debug server notifies viewers about device connection

   ```
   debug-server → WebViewer: { type: 'device-connected', deviceId, deviceName, devicePlatform }
   ```

4. Web viewer updates device state

   ```
   WebViewer: useDevices().addDevice({ id, name, platform, connected: true })
   ```

5. When a network log is received, filtering is applied based on selected device
   ```
   filteredLogs = activeDeviceId ? logs.filter(log => log.deviceId === activeDeviceId) : logs
   ```

## Device Identification

Devices are identified using:

- Unique deviceId (UUID)
- Human-readable deviceName (e.g., "iPhone 15")
- Platform identifier ("ios" or "android")

## Testing

A test script (`test-multiple-devices.js`) is provided to simulate:

- Multiple devices connecting simultaneously
- Network logs from different devices
- Device disconnection and reconnection scenarios

## Adding Support for New Device Types

To add support for a new device type:

1. Modify the `DeviceInfoProvider` in the relevant platform code
2. Update the `platform` type in the TypeScript interface
3. Add appropriate visual indicators in the UI components

## Best Practices

- Always tag network logs with device information
- Handle device disconnections gracefully
- Provide clear visual distinction between device types
- Maintain backward compatibility for logs without device information
