import Foundation

@objc(RnNetVision)
class RnNetVision: NSObject {

  @objc(startDebugger:withRejecter:)
  func startDebugger(resolve: @escaping RCTPromiseResolveBlock,
                     reject: @escaping RCTPromiseRejectBlock) {
    #if DEBUG
    DispatchQueue.global().async {
      do {
        let ip = self.getSafeHostIP()
        try NetVisionDispatcher.shared.connect(host: ip, port: 8088)
        NetVisionLogger.shared.info("📡 iOS Debugger started on ws://\(ip):8088")
        resolve("Connected to debugger")
      } catch {
        NetVisionLogger.shared.error("Failed to start debugger: \(error.localizedDescription)")
        reject("DEBUGGER_ERROR", error.localizedDescription, error)
      }
    }
    #else
    // In release builds, just resolve with success but don't actually start the debugger
    resolve("Debugger disabled in release builds")
    #endif
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

  @objc(configureLogger:withResolver:withRejecter:)
  func configureLogger(_ isProduction: Bool, 
                      resolver: RCTPromiseResolveBlock, 
                      rejecter: RCTPromiseRejectBlock) {
    NetVisionLogger.shared.configure(isProduction: isProduction)
    resolver(nil)
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
