package com.omeratt.rnnetvision

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import okhttp3.*
import com.omeratt.rnnetvision.NetVisionDispatcher
import android.os.Build


class RnNetVisionModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  override fun initialize() {
      super.initialize()
      tryInjectInterceptorIfClientExists()
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


  private fun tryInjectInterceptorIfClientExists(): Boolean {
      return try {
          val sslPinningModuleClass = Class.forName("com.toyberman.RNSslPinningModule")
          val clientField = sslPinningModuleClass.getDeclaredField("client")
          clientField.isAccessible = true

          try {
              val utilsClass = Class.forName("com.toyberman.Utils.OkHttpUtils")
              val method = utilsClass.getDeclaredMethod("addInterceptorForDebug", Interceptor::class.java)
              method.isAccessible = true
              method.invoke(null, NetworkInterceptor())
              Log.d("RnNetVision", "✅ Interceptor added to RNSslPinning using reflection")
          } catch (e: Exception) {
              Log.d("RnNetVision", "❌ Failed to reflect addInterceptorForDebug on RNSslPinning", e)
          }

          val nativeModule = reactContext.getNativeModule("RNSslPinning") ?: return false
          val okHttpClient = clientField.get(nativeModule) as? OkHttpClient ?: return false

          val alreadyInjected = okHttpClient.interceptors.any { it is NetworkInterceptor }
          if (alreadyInjected) {
              Log.d("RnNetVision", "Interceptor already present in chain.")
              return true
          }

          val newClient = okHttpClient.newBuilder()
              .addNetworkInterceptor(NetworkInterceptor())
              .build()

          clientField.set(nativeModule, newClient)
          true
      } catch (e: Exception) {
          Log.e("RnNetVision", "Error during scheduled injection", e)
          false
      }
  }

  companion object {
    const val NAME = "RnNetVision"
  }
}