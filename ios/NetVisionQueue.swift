//
//  NetVisionQueue.swift
//  Pods
//
//  Created by Omer Attias on 10/05/2025.
//

import Foundation

enum NetVisionQueueError: Error {
    case emptyQueue
}

class NetVisionQueue {
    static let shared = NetVisionQueue()

    private var messages: [String] = []
    private let accessQueue = DispatchQueue(label: "com.netvision.queue", attributes: .concurrent)

    private init() {}

    func enqueue(_ message: String) {
        accessQueue.async(flags: .barrier) {
            self.messages.append(message)
        }
    }

    func dequeue() throws -> String {
        return try accessQueue.sync(flags: .barrier) {
            guard !self.messages.isEmpty else {
                throw NetVisionQueueError.emptyQueue
            }
            return self.messages.removeFirst()
        }
    }

    func flush() -> [String] {
        return accessQueue.sync(flags: .barrier) {
            let current = self.messages
            self.messages.removeAll()
            return current
        }
    }

    func isEmpty() -> Bool {
        return accessQueue.sync {
            self.messages.isEmpty
        }
    }

    func count() -> Int {
        return accessQueue.sync {
            self.messages.count
        }
    }
  
    func flushAll() -> [String] {
        return flush()
    }
}
