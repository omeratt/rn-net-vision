import Foundation

@objc public enum LogLevel: Int {
    case debug = 0
    case info = 1
    case warn = 2
    case error = 3
    case none = 4
}

@objc public class NetVisionLogger: NSObject {
    @objc public static let shared = NetVisionLogger()

    private var isProduction: Bool = false
    private var logLevel: LogLevel = .debug

    private override init() {}

    @objc public func configure(isProduction: Bool) {
        self.isProduction = isProduction
        self.logLevel = .debug // Always set to debug level, but production flag will control visibility
        log(level: .info, message: "Logger configured: production=\(isProduction)")
    }

    @objc public func log(level: LogLevel, message: String) {
        // Skip all logs in production mode
        if isProduction {
            return
        }

        // In debug mode, show all logs
        let prefix = levelPrefix(for: level)
        NSLog("\(prefix) [NetVision] %@", message)
    }

    @objc public func debug(_ message: String) {
        log(level: .debug, message: message)
    }

    @objc public func info(_ message: String) {
        log(level: .info, message: message)
    }

    @objc public func warn(_ message: String) {
        log(level: .warn, message: message)
    }

    @objc public func error(_ message: String) {
        log(level: .error, message: message)
    }

    private func levelPrefix(for level: LogLevel) -> String {
        switch level {
        case .debug: return "🔍"
        case .info: return "ℹ️"
        case .warn: return "⚠️"
        case .error: return "❌"
        case .none: return ""
        }
    }
}
