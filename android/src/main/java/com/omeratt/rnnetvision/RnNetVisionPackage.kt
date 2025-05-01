package com.omeratt.rnnetvision

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.modules.network.NetworkingModule
import okhttp3.OkHttpClient

class RnNetVisionPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(RnNetVisionModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

    init {
        NetworkingModule.setCustomClientBuilder { builder: OkHttpClient.Builder ->
            builder.addNetworkInterceptor(NetworkInterceptor())
        }
    }
}