package com.omeratt.rnnetvision

import android.content.Context
import android.os.Build
import okhttp3.Interceptor
import okhttp3.Response
import okhttp3.ResponseBody.Companion.toResponseBody
import okio.Buffer
import org.json.JSONArray
import org.json.JSONObject
import okhttp3.Protocol
import android.util.Base64

class NetworkInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val startTime = System.currentTimeMillis()

        return try {
            val request = chain.request()
            val ignoredPorts = setOf(3232, 8088, 8089, 8081)
            val url = request.url

            val ignoredHosts = setOf("localhost", "127.0.0.1")
            NetVisionLogger.instance.debug("Checking request URL: $url (port=${url.port})")

            if (url.port in ignoredPorts || url.host in ignoredHosts) {
                NetVisionLogger.instance.debug("Intercepting request to: $url")
                return try {
                    chain.proceed(request)
                } catch (e: Exception) {
                    NetVisionLogger.instance.error("Ignored URL failed: $url - ${e.message}")
                    Response.Builder()
                        .code(500)
                        .protocol(Protocol.HTTP_1_1)
                        .message("Localhost unavailable")
                        .request(request)
                        .body("".toResponseBody(null))
                        .build()
                }
            }


            val response = chain.proceed(request)

            val duration = System.currentTimeMillis() - startTime

            NetVisionLogger.instance.debug("🚦 Interceptor triggered! URL: ${request.url}")

            val requestHeadersJson = request.headers.toMultimap().toJson()
            val responseHeadersJson = response.headers.toMultimap().toJson()
            val requestCookiesJson = request.header("cookie").parseCookies()
            val responseCookiesJson = response.headers("set-cookie").parseCookies()
            val parsedRequestBody = extractRequestBody(request)

            val context = ReactApplicationContextProvider.context

            NetVisionLogger.instance.debug("🐛 response.cache: ${response.cacheResponse}")

            val rawBytes = try {
                when {
                    response.code == 304 && response.cacheResponse?.body != null -> {
                        NetVisionLogger.instance.debug("📦 Using OkHttp cacheResponse for 304")
                        response.cacheResponse!!.body!!.bytes()
                    }
                    response.code == 304 -> {
                        NetVisionLogger.instance.debug("📦 OkHttp cacheResponse not found, using disk fallback for 304")
                        CustomDiskCache.loadCachedResponse(request, context) ?: ByteArray(0)
                    }
                    else -> {
                        NetVisionLogger.instance.debug("📦 Using fresh network response body")
                        NetVisionLogger.instance.debug("📁 OkHttp cache dir: ${context.cacheDir}/okhttp_netvision_cache")
                        NetVisionLogger.instance.debug("📛 response Cache-Control: ${response.header("Cache-Control")}")
                        NetVisionLogger.instance.debug("📥 response code: ${response.code}")
                        val bodyBytes = response.body?.bytes() ?: ByteArray(0)
                        if (response.code == 200 && bodyBytes.isNotEmpty()) {
                            CustomDiskCache.persistResponse(request, bodyBytes, context)
                        }
                        bodyBytes
                    }
                }
            } catch (sslError: javax.net.ssl.SSLPeerUnverifiedException) {
                NetVisionLogger.instance.error("⚠️ SSL Verification Failed: ${sslError.message}")
                return response
            } 
            catch (e: java.security.GeneralSecurityException) {
                NetVisionLogger.instance.error("❌ SSL/TLS Error (trust anchor): ${e.message}")
                return response // אל תעשה כלום, רק תמשיך בלי לקרוא את ה־body
            } catch (e: Exception) {
                NetVisionLogger.instance.error("⚠️ Error reading response body: ${e.message}")
                ByteArray(0)
            }

            val base64Body = Base64.encodeToString(rawBytes, Base64.NO_WRAP)
            
            // Get device information
            val deviceId = DeviceInfoProvider.getDeviceId(context)
            val deviceName = Build.MANUFACTURER + " " + Build.MODEL

            val payload = JSONObject().apply {
                put("type", "network-log")
                put("method", request.method)
                put("url", request.url.toString())
                put("duration", duration)
                put("status", response.code)
                put("timestamp", System.currentTimeMillis())
                
                // Add device information
                put("deviceId", deviceId)
                put("deviceName", deviceName)
                put("devicePlatform", "android")
                
                put("requestHeaders", requestHeadersJson)
                put("responseHeaders", responseHeadersJson)
                if (parsedRequestBody != null) put("requestBody", parsedRequestBody)
                if (base64Body.isNotBlank()) {
                    put("responseBody", base64Body)
                    put("responseBodyEncoding", "base64")
                }
                if (requestCookiesJson.length() > 0 || responseCookiesJson.length() > 0) {
                    put("cookies", JSONObject().apply {
                        put("request", requestCookiesJson)
                        put("response", responseCookiesJson)
                    })
                }
            }

            NetVisionDispatcher.send(payload.toString())

            return response.newBuilder()
                .body(rawBytes.toResponseBody(response.body?.contentType()))
                .build()

        } catch (e: Exception) {
            NetVisionLogger.instance.error("❌ Error in NetworkInterceptor: ${e.message}")

            val parsedRequestBody = extractRequestBody(chain.request())
            val requestHeaders = chain.request().headers.toMultimap().toJson()
            
            // Get device information for error log
            val context = ReactApplicationContextProvider.context
            val deviceId = DeviceInfoProvider.getDeviceId(context)
            val deviceName = Build.MANUFACTURER + " " + Build.MODEL

            val payload = JSONObject().apply {
                if (parsedRequestBody != null) put("requestBody", parsedRequestBody)
                put("type", "network-log")
                put("method", chain.request().method)
                put("url", chain.request().url.toString())
                put("timestamp", System.currentTimeMillis())
                put("status", 520)
                put("duration", System.currentTimeMillis() - startTime)
                put("requestHeaders", requestHeaders)
                put("error", e.localizedMessage ?: "Unknown error")
                
                // Add device information
                put("deviceId", deviceId)
                put("deviceName", deviceName)
                put("devicePlatform", "android")
            }

            NetVisionDispatcher.send(payload.toString())
            return Response.Builder()
                .request(chain.request())
                .protocol(Protocol.HTTP_1_1)
                .code(520)
                .message("Intercept Error: ${e.localizedMessage}")
                .body("".toResponseBody(null))
                .build()
        }
    }

    private fun extractRequestBody(request: okhttp3.Request): Any? {
        return try {
            val contentType = request.body?.contentType()?.toString()?.lowercase()
            val buffer = Buffer()
            request.body?.writeTo(buffer)
            val bodyString = buffer.readUtf8().trim()

            if (bodyString.isBlank()) return null

            if (contentType?.contains("application/json") == true) {
                when {
                    bodyString.startsWith("{") -> JSONObject(bodyString)
                    bodyString.startsWith("[") -> JSONArray(bodyString)
                    else -> bodyString
                }
            } else {
                bodyString
            }
        } catch (_: Exception) {
            null
        }
    }

    private fun Map<String, List<String>>.toJson(): JSONObject {
        val json = JSONObject()
        forEach { (key, values) ->
            json.put(key, JSONArray(values))
        }
        return json
    }

    private fun String?.parseCookies(): JSONObject {
        val json = JSONObject()
        this?.split(";")?.forEach {
            val (k, v) = it.trim().split("=").let { parts -> parts.getOrNull(0) to parts.getOrNull(1) }
            if (k != null && v != null) json.put(k, v)
        }
        return json
    }

    private fun List<String>.parseCookies(): JSONObject {
        val json = JSONObject()
        forEach { header ->
            val parts = header.split(";")[0].split("=")
            if (parts.size == 2) {
                json.put(parts[0].trim(), parts[1].trim())
            }
        }
        return json
    }
}