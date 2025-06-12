package com.omeratt.rnnetvision

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext

object ReactApplicationContextProvider {
    lateinit var context: Context
    lateinit var reactContext: ReactApplicationContext


    fun initialize(reactContext: ReactApplicationContext) {
        context = reactContext.applicationContext
        this.reactContext = reactContext
    }
    
    // Helper method to safely get the ReactContext
    fun safeGetReactContext(): ReactApplicationContext? {
        return if (::reactContext.isInitialized) {
            reactContext
        } else {
            null
        }
    }
}