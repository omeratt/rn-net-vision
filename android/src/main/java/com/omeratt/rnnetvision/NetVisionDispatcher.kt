package com.omeratt.rnnetvision

import android.util.Log
import okhttp3.*
import java.util.concurrent.TimeUnit

object NetVisionDispatcher {
    private var webSocket: WebSocket? = null
    private var isSocketInitialized = false

    fun connect(host: String, port: Int) {
        if (isSocketInitialized && webSocket != null) {
            Log.d("NetVision", "🔁 Already connected to $host:$port")
            NetVisionQueue.flushIfReady { send(it) }
            return
        }

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

                NetVisionQueue.flushIfReady { send(it) }
            }

            override fun onMessage(ws: WebSocket, text: String) {
                Log.d("NetVision", "📬 Message from debugger: $text")
            }

            override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
                Log.e("NetVision", "❌ WebSocket error: ${t.message}")
                isSocketInitialized = false
                webSocket = null
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
            Log.d("NetVision", "🕗 Queued message (WS not ready): ${message.take(100)}...")
            NetVisionQueue.add(message)
            return
        }

        val success = ws.send(message)
        if (success) {
            Log.d("NetVision", "📤 Sent to debugger: ${message.take(100)}...")
        } else {
            Log.d("NetVision", "🕗 Send failed — queueing")
            NetVisionQueue.add(message)
        }
    }
}