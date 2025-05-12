import Foundation

@objc(RnNetVision)
class RnNetVision: NSObject {

  @objc(startDebugger:withRejecter:)
  func startDebugger(resolve: @escaping RCTPromiseResolveBlock,
                     reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global().async {
      do {
        let ip = self.getSafeHostIP()
        try NetVisionDispatcher.shared.connect(host: ip, port: 8088)
        debugPrint("📡 iOS Debugger started on ws://\(ip):8088")
        resolve("Connected to debugger")
      } catch {
        debugPrint("❌ Failed to start debugger: \(error.localizedDescription)")
        reject("DEBUGGER_ERROR", error.localizedDescription, error)
      }
    }
  }

  @objc
  func getHostIPAddress(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    let ip = getSafeHostIP()
    if ip != "localhost" {
      resolve(ip)
    } else {
      reject("NO_IP", "Failed to determine local IP address", nil)
    }
  }

  private func getSafeHostIP() -> String {
    return getLocalWiFiIPAddress() ?? "localhost"
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
