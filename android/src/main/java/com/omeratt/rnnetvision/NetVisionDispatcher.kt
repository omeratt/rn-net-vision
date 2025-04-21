package com.omeratt.rnnetvision

import android.util.Log
import okhttp3.*
import okio.ByteString
import java.util.concurrent.TimeUnit

object NetVisionDispatcher {
    private var webSocket: WebSocket? = null
    private val pendingMessages = mutableListOf<String>()
    private var isSocketInitialized = false

    fun connect(host: String, port: Int) {
        if (isSocketInitialized) return

        val client = OkHttpClient.Builder()
            .connectTimeout(3, TimeUnit.SECONDS)
            .build()

        val request = Request.Builder()
            .url("ws://$host:$port")
            .build()

        client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(ws: WebSocket, response: Response) {
                webSocket = ws
                isSocketInitialized = true
                Log.d("NetVision", "✅ Connected to debugger at ws://$host:$port")

                synchronized(pendingMessages) {
                    pendingMessages.forEach { send(it) }
                    pendingMessages.clear()
                }
            }

            override fun onMessage(ws: WebSocket, text: String) {
                Log.d("NetVision", "📥 Message from debugger: $text")
            }

            override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
                Log.e("NetVision", "❌ WebSocket error: ${t.message}")
            }

            override fun onClosed(ws: WebSocket, code: Int, reason: String) {
                Log.d("NetVision", "❌ WebSocket closed: $reason")
                isSocketInitialized = false
                webSocket = null
            }
        })

        client.dispatcher.executorService.shutdown()
    }

    fun send(message: String) {
        val ws = webSocket
        if (ws == null) {
            Log.d("NetVision", "🕗 Queued message: $message")
            synchronized(pendingMessages) {
                pendingMessages.add(message)
            }
            return
        }

        val success = ws.send(message)
        if (success) {
            Log.d("NetVision", "📤 Sent to debugger: $message")
        } else {
            Log.e("NetVision", "❌ Failed to send message")
        }
    }
}
