package com.omeratt.rnnetvision

import okhttp3.*
import java.util.concurrent.TimeUnit

object NetVisionDispatcher {
    private var webSocket: WebSocket? = null
    private var isSocketInitialized = false

    fun connect(host: String, port: Int) {
        if (isSocketInitialized && webSocket != null) {
            NetVisionLogger.instance.debug("Already connected to $host:$port")
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
                NetVisionLogger.instance.info("Connected to debugger at ws://$host:$port")

                NetVisionQueue.flushIfReady { send(it) }
            }

            override fun onMessage(ws: WebSocket, text: String) {
                NetVisionLogger.instance.debug("📬 Message from debugger: $text")
            }

            override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
                NetVisionLogger.instance.error("❌ WebSocket error: ${t.message}")
                isSocketInitialized = false
                webSocket = null
            }

            override fun onClosed(ws: WebSocket, code: Int, reason: String) {
                NetVisionLogger.instance.debug("❌ WebSocket closed: $reason")
                isSocketInitialized = false
                webSocket = null
            }
        })

        client.dispatcher.executorService.shutdown()
    }

    fun send(message: String) {
        val ws = webSocket
        if (ws == null) {
            NetVisionLogger.instance.debug("🕗 Queued message (WS not ready): ${message.take(100)}...")
            NetVisionQueue.add(message)
            return
        }

        val success = ws.send(message)
        if (success) {
            NetVisionLogger.instance.debug("📤 Sent to debugger: ${message.take(100)}...")
        } else {
            NetVisionLogger.instance.debug("🕗 Send failed — queueing")
            NetVisionQueue.add(message)
        }
    }
}