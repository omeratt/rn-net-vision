package com.omeratt.rnnetvision

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext

object ReactApplicationContextProvider {
    lateinit var context: Context

    fun initialize(reactContext: ReactApplicationContext) {
        context = reactContext.applicationContext
    }
}