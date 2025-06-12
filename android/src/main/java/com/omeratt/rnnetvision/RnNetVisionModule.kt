package com.omeratt.rnnetvision

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import okhttp3.*
import com.omeratt.rnnetvision.NetVisionDispatcher
import com.omeratt.rnnetvision.NetVisionLogger
import android.os.Build


class RnNetVisionModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  override fun initialize() {
      super.initialize()
      // Initialize the context provider for device info
      ReactApplicationContextProvider.initialize(reactContext)
      tryInjectInterceptorIfClientExists()
  }


    @ReactMethod
  fun startDebugger(promise: Promise) {
      Thread {
          try {
              NetVisionDispatcher.connect("localhost", 8088)

              NetVisionLogger.instance.info("Connecting to debugger at localhost:8088")

              promise.resolve("Connected to debugger at localhost")
          } catch (e: Exception) {
              NetVisionLogger.instance.error("Direct connection failed: ${e.message}")
              promise.reject("DIRECT_FAILED", e)
          }
      }.start()
  }

  @ReactMethod
  fun configureLogger(isProduction: Boolean, promise: Promise) {
    try {
      NetVisionLogger.instance.configure(isProduction)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("ERR_UNEXPECTED_EXCEPTION", e.message, e)
    }
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
              NetVisionLogger.instance.debug("Interceptor added to RNSslPinning using reflection")
          } catch (e: Exception) {
              NetVisionLogger.instance.debug("❌ Failed to reflect addInterceptorForDebug on RNSslPinning: ${e.message}")
          }

          val nativeModule = reactContext.getNativeModule("RNSslPinning") ?: return false
          val okHttpClient = clientField.get(nativeModule) as? OkHttpClient ?: return false

          val alreadyInjected = okHttpClient.interceptors.any { it is NetworkInterceptor }
          if (alreadyInjected) {
              NetVisionLogger.instance.debug("Interceptor already present in chain.")
              return true
          }

          val newClient = okHttpClient.newBuilder()
              .addNetworkInterceptor(NetworkInterceptor())
              .build()

          clientField.set(nativeModule, newClient)
          true
      } catch (e: Exception) {
          NetVisionLogger.instance.error("Error during scheduled injection: ${e.message}")
          false
      }
  }

  companion object {
    const val NAME = "RnNetVision"
  }
}