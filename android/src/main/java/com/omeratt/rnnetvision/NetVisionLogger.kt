package com.omeratt.rnnetvision

import android.util.Log

enum class LogLevel(val value: Int) {
    DEBUG(0),
    INFO(1),
    WARN(2),
    ERROR(3),
    NONE(4)
}

class NetVisionLogger private constructor() {
    private var isProduction = false
    private var logLevel = LogLevel.DEBUG

    companion object {
        private const val TAG = "NetVision"
        val instance = NetVisionLogger()
    }

    fun configure(isProduction: Boolean) {
        this.isProduction = isProduction
        this.logLevel = LogLevel.DEBUG // Always set to debug level, but production flag will control visibility
        log(LogLevel.INFO, "Logger configured: production=$isProduction")
    }

    fun log(level: LogLevel, message: String) {
        // Skip all logs in production mode
        if (isProduction) {
            return
        }

        // In debug mode, show all logs
        val prefix = levelPrefix(level)
        when (level) {
            LogLevel.DEBUG -> Log.d(TAG, "$prefix $message")
            LogLevel.INFO -> Log.i(TAG, "$prefix $message")
            LogLevel.WARN -> Log.w(TAG, "$prefix $message")
            LogLevel.ERROR -> Log.e(TAG, "$prefix $message")
            LogLevel.NONE -> {}
        }
    }

    fun debug(message: String) = log(LogLevel.DEBUG, message)
    fun info(message: String) = log(LogLevel.INFO, message)
    fun warn(message: String) = log(LogLevel.WARN, message)
    fun error(message: String) = log(LogLevel.ERROR, message)

    private fun levelPrefix(level: LogLevel): String {
        return when (level) {
            LogLevel.DEBUG -> "🔍"
            LogLevel.INFO -> "ℹ️"
            LogLevel.WARN -> "⚠️"
            LogLevel.ERROR -> "❌"
            LogLevel.NONE -> ""
        }
    }
}
