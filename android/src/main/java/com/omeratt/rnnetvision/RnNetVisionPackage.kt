package com.omeratt.rnnetvision

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.modules.network.NetworkingModule
import okhttp3.OkHttpClient
import okhttp3.Cache
import java.io.File

class RnNetVisionPackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        if (BuildConfig.DEBUG) {
            // Initialize context
            ReactApplicationContextProvider.initialize(reactContext)

            // Clean expired files in the cache
            CustomDiskCache.cleanExpiredFiles(reactContext)

            // Set up OkHttp cache and interceptors
            NetworkingModule.setCustomClientBuilder { builder: OkHttpClient.Builder ->
                val cacheSize = 10L * 1024 * 1024 // 10MB
                val cacheDir = File(reactContext.cacheDir, "okhttp_netvision_cache")
                val cache = Cache(cacheDir, cacheSize)

                builder.cache(cache)

                // Main interceptor (must be last!)
                builder.addNetworkInterceptor(NetworkInterceptor())
            }
        }

        return listOf(RnNetVisionModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}