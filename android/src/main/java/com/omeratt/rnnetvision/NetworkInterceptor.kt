package com.omeratt.rnnetvision

import android.util.Log
import okhttp3.Interceptor
import okhttp3.Response
import okio.Buffer
import org.json.JSONArray
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

        // headers as JSON
        val requestHeadersJson = JSONObject()
        request.headers.toMultimap().forEach { (key, valueList) ->
            requestHeadersJson.put(key, JSONArray(valueList))
        }

        val responseHeadersJson = JSONObject()
        response.headers.toMultimap().forEach { (key, valueList) ->
            responseHeadersJson.put(key, JSONArray(valueList))
        }

        // request body
        val parsedRequestBody = extractRequestBody(request)



        // Parse request cookies
        val requestCookieHeader = request.header("Cookie")
        val requestCookiesJson = JSONObject()
        requestCookieHeader?.split(";")?.forEach {
            val parts = it.trim().split("=")
            if (parts.size == 2) {
                requestCookiesJson.put(parts[0], parts[1])
            }
        }

        // Parse response cookies
        val responseCookieHeader = response.headers("Set-Cookie")
        val responseCookiesJson = JSONObject()
        responseCookieHeader.forEach { fullCookie ->
            val parts = fullCookie.split(";")[0].split("=")
            if (parts.size == 2) {
                responseCookiesJson.put(parts[0].trim(), parts[1].trim())
            }
        }

        val responseBodyHolder = arrayOf<String?>(null)

        val interceptedResponse = response.newBuilder()
            .body(
                InterceptingResponseBody(response.body!!) { bodyString ->
                    Log.d("NetVision", "📦 Intercepted response body: ${bodyString?.take(100)}")
                    responseBodyHolder[0] = bodyString

                    val payload = JSONObject().apply {
                        put("type", "network-log")
                        put("method", request.method)
                        put("url", request.url.toString())
                        put("duration", duration)
                        put("status", response.code)
                        put("requestHeaders", requestHeadersJson)
                        put("responseHeaders", responseHeadersJson)
                        if (parsedRequestBody != null) put("requestBody", parsedRequestBody)
                        if (!bodyString.isNullOrBlank()) put("responseBody", bodyString)
                        if (requestCookiesJson.length() > 0 || responseCookiesJson.length() > 0) {
                            put("cookies", JSONObject().apply {
                                put("request", requestCookiesJson)
                                put("response", responseCookiesJson)
                            })
                        }
                    }

                    NetVisionDispatcher.send(payload.toString())
                }
            )
            .build()

        return interceptedResponse
    }
    fun extractRequestBody(request: okhttp3.Request): Any? {
        return try {
            val contentType = request.body?.contentType()?.toString()?.lowercase()
            val buffer = Buffer()
            request.body?.writeTo(buffer)
            val bodyString = buffer.readUtf8().trim()

            if (bodyString.isBlank()) return null

            return if (contentType?.contains("application/json") == true) {
                try {
                    when {
                        bodyString.startsWith("{") -> JSONObject(bodyString)
                        bodyString.startsWith("[") -> JSONArray(bodyString)
                        else -> bodyString
                    }
                } catch (_: Exception) {
                    bodyString
                }
            } else {
                bodyString
            }
        } catch (_: Exception) {
            null
        }
    }
}