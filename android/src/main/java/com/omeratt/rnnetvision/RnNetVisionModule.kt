package com.omeratt.rnnetvision

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import okhttp3.*
import java.io.IOException
import java.net.URL
import com.omeratt.rnnetvision.NetVisionDispatcher
import android.os.Build

class RnNetVisionModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private var debuggerHost: String? = null

  override fun getName(): String = NAME

  @ReactMethod
  fun setDebuggerHost(host: String) {
    debuggerHost = host
    Log.d("NetVision", "🌐 Debugger host set from JS: $host")
  }

  @ReactMethod
  fun startDebugger(promise: Promise) {
      Thread {
          try {
              NetVisionDispatcher.connect("localhost", 8088)

              Log.d("NetVision", "📡 Connecting to debugger at localhost:8088")

              promise.resolve("Connected to debugger at localhost")
          } catch (e: Exception) {
              Log.e("NetVision", "❌ Direct connection failed: ${e.message}")
              promise.reject("DIRECT_FAILED", e)
          }
      }.start()
  }

  @ReactMethod
  fun testRequest(promise: Promise) {
    val client = OkHttpClient.Builder()
      .addInterceptor(NetworkInterceptor())
      .build()

    val request = Request.Builder()
      .url("https://jsonplaceholder.typicode.com/todos/1")
      .build()

    client.newCall(request).enqueue(object : Callback {
      override fun onFailure(call: Call, e: IOException) {
        promise.reject("FAIL", e)
      }

      override fun onResponse(call: Call, response: Response) {
        val body = response.body?.string()
        promise.resolve(body)
      }
    })
  }

  companion object {
    const val NAME = "RnNetVision"
  }
}