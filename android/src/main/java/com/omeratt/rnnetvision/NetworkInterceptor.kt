package com.omeratt.rnnetvision
import com.omeratt.rnnetvision.NetVisionDispatcher
import android.util.Log
import okhttp3.Interceptor
import okhttp3.Response
import org.json.JSONObject

class NetworkInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val ignoredPorts = setOf(3232, 8088, 8089, 8081)
        val url = request.url

        if (url.port in ignoredPorts) {
            return chain.proceed(request)
        }

        val startTime = System.currentTimeMillis()
        val response = chain.proceed(request)
        val duration = System.currentTimeMillis() - startTime

        Log.d("NetVision", "🚦 Interceptor triggered! URL: ${request.url}")

        val payload = JSONObject().apply {
            put("type", "network-log")
            put("method", request.method)
            put("url", request.url.toString())
            put("duration", duration)
            put("status", response.code)
            put("headers", response.headers.toMultimap())
        }

        NetVisionDispatcher.send(payload.toString())

        return response
    }

}
