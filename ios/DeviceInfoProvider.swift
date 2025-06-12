// DeviceInfoProvider.swift
import Foundation
import UIKit

class DeviceInfoProvider {
    static let shared = DeviceInfoProvider()
    
    private init() {}
    
    // Get a unique device identifier
    func getDeviceId() -> String {
        // Use device UUID stored in UserDefaults or create a new one if not available
        if let storedId = UserDefaults.standard.string(forKey: "net_vision_device_id") {
            return storedId
        } else {
            let newId = UUID().uuidString
            UserDefaults.standard.set(newId, forKey: "net_vision_device_id")
            return newId
        }
    }
    
    // Get device model name
    func getDeviceModel() -> String {
        var systemInfo = utsname()
        uname(&systemInfo)
        
        let machineMirror = Mirror(reflecting: systemInfo.machine)
        let identifier = machineMirror.children.reduce("") { identifier, element in
            guard let value = element.value as? Int8, value != 0 else { return identifier }
            return identifier + String(UnicodeScalar(UInt8(value)))
        }
        
        // Map common device identifiers to marketing names
        switch identifier {
        case "iPhone10,1", "iPhone10,4":                  return "iPhone 8"
        case "iPhone10,2", "iPhone10,5":                  return "iPhone 8 Plus"
        case "iPhone10,3", "iPhone10,6":                  return "iPhone X"
        case "iPhone11,2":                                return "iPhone XS"
        case "iPhone11,4", "iPhone11,6":                  return "iPhone XS Max"
        case "iPhone11,8":                                return "iPhone XR"
        case "iPhone12,1":                                return "iPhone 11"
        case "iPhone12,3":                                return "iPhone 11 Pro"
        case "iPhone12,5":                                return "iPhone 11 Pro Max"
        case "iPhone13,1":                                return "iPhone 12 mini"
        case "iPhone13,2":                                return "iPhone 12"
        case "iPhone13,3":                                return "iPhone 12 Pro"
        case "iPhone13,4":                                return "iPhone 12 Pro Max"
        case "iPhone14,4":                                return "iPhone 13 mini"
        case "iPhone14,5":                                return "iPhone 13"
        case "iPhone14,2":                                return "iPhone 13 Pro"
        case "iPhone14,3":                                return "iPhone 13 Pro Max"
        case "iPhone14,7":                                return "iPhone 14"
        case "iPhone14,8":                                return "iPhone 14 Plus"
        case "iPhone15,2":                                return "iPhone 14 Pro"
        case "iPhone15,3":                                return "iPhone 14 Pro Max"
        case "iPhone15,4":                                return "iPhone 15"
        case "iPhone15,5":                                return "iPhone 15 Plus"
        case "iPhone16,1":                                return "iPhone 15 Pro"
        case "iPhone16,2":                                return "iPhone 15 Pro Max"
        default:                                          return identifier
        }
    }
    
    // Get full device info as a dictionary
    func getDeviceInfo() -> [String: Any] {
        let device = UIDevice.current
        let deviceId = getDeviceId()
        let deviceModel = getDeviceModel()
        
        return [
            "type": "device-info",
            "deviceId": deviceId,
            "deviceName": "\(deviceModel) (\(device.name))",
            "platform": "ios",
            "osVersion": device.systemVersion,
            "deviceModel": deviceModel,
            "isSimulator": isSimulator()
        ]
    }
    
    // Check if running on simulator
    private func isSimulator() -> Bool {
        #if targetEnvironment(simulator)
            return true
        #else
            return false
        #endif
    }
}
