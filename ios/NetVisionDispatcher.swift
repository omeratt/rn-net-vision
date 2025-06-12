//
//  NetVisionDispatcher.swift
//  RnNetVision
//
//  Created by Omer Attias on 10/05/2025.
//

import Foundation
import UIKit

@objc public class NetVisionDispatcher: NSObject, URLSessionDelegate {
    @objc public static let shared = NetVisionDispatcher()

    private var webSocket: URLSessionWebSocketTask?
    private var isConnected = false
    private let queue = NetVisionQueue.shared
    private var host: String = "localhost"
    private var port: Int = 8088

    private override init() {}

    @objc public func connect(host: String, port: Int) throws {
        guard let url = URL(string: "ws://\(host):\(port)") else {
            throw NSError(domain: "NetVision", code: 1001, userInfo: [
                NSLocalizedDescriptionKey: "Invalid WebSocket URL"
            ])
        }

        NetVisionLogger.shared.debug("WebSocket connecting to \(url.absoluteString)")
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: OperationQueue())
        webSocket = session.webSocketTask(with: url)
        webSocket?.resume()

        // נסה לשלוח ping ולחכות לתשובה — סימן שהחיבור פתוח
        webSocket?.sendPing { [weak self] error in
            if let error = error {
                NetVisionLogger.shared.error("WebSocket ping failed: \(error)")
            } else {
                NetVisionLogger.shared.info("WebSocket connected (ping success)")
                self?.isConnected = true
                self?.sendDeviceInfo()
                self?.flush()
            }
        }

        listen()
    }

    private func listen() {
        webSocket?.receive { [weak self] result in
            switch result {
            case .failure(let error):
                NetVisionLogger.shared.error("WebSocket receive failed: \(error)")
                self?.isConnected = false
            case .success(let message):
                switch message {
                case .string(let text):
                    NetVisionLogger.shared.debug("Received message: \(text)")
                default:
                    NetVisionLogger.shared.debug("Received non-text WebSocket message")
                }
                self?.listen()
            }
        }
    }

    func sendResponse(for request: URLRequest, response: URLResponse?, data: Data) {
        guard let url = request.url?.absoluteString else {
            NetVisionLogger.shared.warn("Cannot extract URL from request")
            return
        }

        let requestHeaders = request.allHTTPHeaderFields ?? [:]
        let responseHeaders = (response as? HTTPURLResponse)?.allHeaderFields ?? [:]
        let base64Body = data.base64EncodedString()

        let requestCookies = parseCookies(from: requestHeaders["Cookie"])
        let responseCookies = parseCookies(from: responseHeaders["Set-Cookie"] as? String)
        
        // Get device information for the network log
        let deviceId = DeviceInfoProvider.shared.getDeviceId()
        let deviceModel = DeviceInfoProvider.shared.getDeviceModel()
        let deviceName = "\(deviceModel) (\(UIDevice.current.name))"

        let json: [String: Any] = [
            "type": "network-log",
            "method": request.httpMethod ?? "UNKNOWN",
            "url": url,
            "status": (response as? HTTPURLResponse)?.statusCode ?? -1,
            "timestamp": Int(Date().timeIntervalSince1970 * 1000),
            "requestHeaders": requestHeaders,
            "responseHeaders": responseHeaders,
            "responseBody": base64Body,
            "responseBodyEncoding": "base64",
            // Add device information
            "deviceId": deviceId,
            "deviceName": deviceName,
            "devicePlatform": "ios",
            "cookies": [
                "request": requestCookies,
                "response": responseCookies
            ]
        ]

        do {
            let jsonData = try JSONSerialization.data(withJSONObject: json, options: [])
            if let jsonString = String(data: jsonData, encoding: .utf8) {
                NetVisionLogger.shared.debug("Enqueuing network log for \(url)")
                queue.enqueue(jsonString)
                flush()
            }
        } catch {
            NetVisionLogger.shared.error("Failed to serialize network log: \(error)")
        }
    }

    private func parseCookies(from header: String?) -> [String: String] {
        guard let header = header else { return [:] }

        var cookies: [String: String] = [:]

        header
            .components(separatedBy: ";")
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .forEach { pair in
                let parts = pair.components(separatedBy: "=")
                if parts.count == 2 {
                    cookies[parts[0]] = parts[1]
                }
            }

        return cookies
    }

    func flush() {
        guard isConnected, let socket = webSocket else {
            NetVisionLogger.shared.debug("WebSocket not connected. Messages will remain in queue.")
            return
        }

        for message in queue.flushAll() {
            socket.send(.string(message)) { error in
                if let error = error {
                    NetVisionLogger.shared.error("Failed to send message over WebSocket: \(error)")
                } else {
                    NetVisionLogger.shared.debug("Sent message to debugger")
                }
            }
        }
    }
  
    @objc public func send(
      request: URLRequest,
      response: HTTPURLResponse?,
      data: Data?,
      startTime: TimeInterval
    ) {
      let endTime = Date().timeIntervalSince1970 * 1000.0
      let duration = Int(endTime - startTime)  // ms
      let timestamp = Int(startTime) // ms

      // Get device information
      let deviceId = DeviceInfoProvider.shared.getDeviceId()
      let deviceModel = DeviceInfoProvider.shared.getDeviceModel()
      let deviceName = "\(deviceModel) (\(UIDevice.current.name))"
      
      var payload: [String: Any] = [
        "type": "network-log",
        "method": request.httpMethod ?? "GET",
        "url": request.url?.absoluteString ?? "",
        "timestamp": timestamp,
        "duration": duration,
        // Add device information
        "deviceId": deviceId,
        "deviceName": deviceName,
        "devicePlatform": "ios"
      ]

      // Request Headers (as Record<string, string[]>)
      if let headers = request.allHTTPHeaderFields {
        var formattedHeaders = [String: [String]]()
        for (key, value) in headers {
          formattedHeaders[key] = [value]
        }
        payload["requestHeaders"] = formattedHeaders
      }

      // Request Cookies
      if let cookieHeader = request.allHTTPHeaderFields?["Cookie"] {
        var requestCookies = [String: String]()
        let cookiePairs = cookieHeader.components(separatedBy: ";")
        for pair in cookiePairs {
          let parts = pair.trimmingCharacters(in: .whitespaces).components(separatedBy: "=")
          if parts.count == 2 {
            requestCookies[parts[0]] = parts[1]
          }
        }
        payload["cookies"] = ["request": requestCookies]
      }

      // Request Body
      if let body = request.httpBody {
        if let jsonObject = try? JSONSerialization.jsonObject(with: body, options: []),
           JSONSerialization.isValidJSONObject(jsonObject) {
          payload["requestBody"] = jsonObject
        } else if let string = String(data: body, encoding: .utf8) {
          payload["requestBody"] = string
        } else {
          payload["requestBody"] = NSNull()
        }
      } else {
        payload["requestBody"] = NSNull()
      }

      // Response headers
      if let res = response {
        payload["status"] = res.statusCode
        var formattedResponseHeaders = [String: [String]]()
        for (key, value) in res.allHeaderFields {
          if let keyStr = key as? String, let valStr = value as? String {
            formattedResponseHeaders[keyStr] = [valStr]
          }
        }
        
        // Handle error headers specially
        if res.statusCode == 520, // Standard error code we're using
           let errorDesc = res.allHeaderFields["Error-Description"] as? String {
          payload["error"] = errorDesc
        }
        
        payload["responseHeaders"] = formattedResponseHeaders

        // Response cookies
        if let setCookieHeaders = res.allHeaderFields["Set-Cookie"] as? String {
          var responseCookies = [String: String]()
          let cookiePairs = setCookieHeaders.components(separatedBy: ";")
          for pair in cookiePairs {
            let parts = pair.trimmingCharacters(in: .whitespaces).components(separatedBy: "=")
            if parts.count == 2 {
              responseCookies[parts[0]] = parts[1]
            }
          }
          if payload["cookies"] == nil {
            payload["cookies"] = [:]
          }
          var cookiesDict = payload["cookies"] as? [String: Any] ?? [:]
          cookiesDict["response"] = responseCookies
          payload["cookies"] = cookiesDict
        }
      }

      // Response Body (base64)
      if let responseData = data, !responseData.isEmpty {
        let base64 = responseData.base64EncodedString()
        
        // If this is an error response with status code 520, extract the error message
        if let res = response, res.statusCode == 520,
           let errorDesc = res.allHeaderFields["Error-Description"] as? String {
          // Store error in a dedicated field
          payload["error"] = errorDesc
          
          // For error responses, we'll empty the responseBody to avoid duplication
          // since the error is already captured in the error field
          payload["responseBody"] = ""
          payload["responseBodyEncoding"] = "text"
        } else {
          payload["responseBody"] = base64
          payload["responseBodyEncoding"] = "base64"
        }
      } else {
        payload["responseBody"] = ""
        payload["responseBodyEncoding"] = "text"
      }

      // Serialize to JSON
      do {
        let jsonData = try JSONSerialization.data(withJSONObject: payload, options: [])
        if let jsonString = String(data: jsonData, encoding: .utf8) {
          NetVisionLogger.shared.debug("Sending payload to debugger")
          queue.enqueue(jsonString)
          flush()
        }
      } catch {
        NetVisionLogger.shared.error("Failed to serialize payload: \(error.localizedDescription)")
      }
    }

    @objc public func sendWithPayload(_ payload: NSDictionary) {
        guard let jsonData = try? JSONSerialization.data(withJSONObject: payload, options: []),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            NetVisionLogger.shared.error("Failed to serialize payload to JSON string")
            return
        }

        queue.enqueue(jsonString)
        flush()
    }
    
    private func sendDeviceInfo() {
        guard isConnected, let socket = webSocket else {
            NetVisionLogger.shared.debug("Cannot send device info: WebSocket not connected")
            return
        }
        
        let deviceInfo = DeviceInfoProvider.shared.getDeviceInfo()
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: deviceInfo, options: [])
            
            if let jsonString = String(data: jsonData, encoding: .utf8) {
                socket.send(.string(jsonString)) { error in
                    if let error = error {
                        NetVisionLogger.shared.error("Failed to send device info: \(error)")
                    } else {
                        NetVisionLogger.shared.info("Sent device info to debugger")
                    }
                }
            }
        } catch {
            NetVisionLogger.shared.error("Failed to serialize device info: \(error)")
        }
    }
}
