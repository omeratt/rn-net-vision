package com.omeratt.rnnetvision

import android.util.Log

object NetVisionQueue {
    private val pending = mutableListOf<String>()
    private var isReady = false
    private var flushCallback: ((String) -> Unit)? = null

    fun add(message: String) {
        synchronized(pending) {
            Log.d("NetVision", "📥 Queued: ${message}")
            pending.add(message)
        }
    }

    fun flushIfReady(sendFn: (String) -> Unit) {
        synchronized(pending) {
            flushCallback = sendFn
            isReady = true
            Log.d("NetVision", "🚀 Flushing ${pending.size} messages...")
            pending.forEach { sendFn(it) }
            pending.clear()
        }
    }

    fun flushPendingMessages() {
        flushCallback?.let { cb ->
            flushIfReady(cb)
        } ?: Log.w("NetVision", "⚠️ Tried to flush, but no callback is registered")
    }

    fun clear() {
        synchronized(pending) {
            pending.clear()
            Log.d("NetVision", "🧹 Queue cleared")
        }
    }

    fun isEmpty(): Boolean = synchronized(pending) { pending.isEmpty() }
}