package com.omeratt.rnnetvision

object NetVisionQueue {
    private val pending = mutableListOf<String>()
    private var isReady = false
    private var flushCallback: ((String) -> Unit)? = null

    fun add(message: String) {
        synchronized(pending) {
            NetVisionLogger.instance.debug("Queued: ${message.take(500)}...")
            pending.add(message)
        }
    }

    fun flushIfReady(sendFn: (String) -> Unit) {
        synchronized(pending) {
            flushCallback = sendFn
            isReady = true
            NetVisionLogger.instance.debug("Flushing ${pending.size} messages...")
            pending.forEach { sendFn(it) }
            pending.clear()
        }
    }

    fun flushPendingMessages() {
        flushCallback?.let { cb ->
            flushIfReady(cb)
        } ?: NetVisionLogger.instance.warn("Tried to flush, but no callback is registered")
    }

    fun clear() {
        synchronized(pending) {
            pending.clear()
            NetVisionLogger.instance.debug("🧹 Queue cleared")
        }
    }

    fun isEmpty(): Boolean = synchronized(pending) { pending.isEmpty() }
}