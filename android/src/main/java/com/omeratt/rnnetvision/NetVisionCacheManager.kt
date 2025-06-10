package com.omeratt.rnnetvision

import android.content.Context
import android.util.Base64
import java.io.File
import java.io.RandomAccessFile

object CustomDiskCache {
    private const val TAG = "NetVision"
    private const val TIMESTAMP_HEADER_SIZE = Long.SIZE_BYTES // 8 bytes
    private var initialized = false
    private lateinit var cacheDir: File

    private fun ensureInitialized(context: Context) {
        if (!initialized) {
            cacheDir = File(context.cacheDir, "netvision_cache").apply {
                if (!exists()) mkdirs()
            }
            initialized = true
        }
    }

    private fun cacheFile(request: okhttp3.Request, context: Context): File {
        ensureInitialized(context)
        val keyRaw = "${request.method}::${request.url}"
        val fileName = Base64.encodeToString(keyRaw.toByteArray(), Base64.NO_WRAP)
        return File(cacheDir, fileName)
    }

    fun persistResponse(request: okhttp3.Request, bytes: ByteArray, context: Context) {
        try {
            val file = cacheFile(request, context)
            val timestamp = System.currentTimeMillis()
            RandomAccessFile(file, "rw").use { raf ->
                raf.writeLong(timestamp) // Write the timestamp at the beginning taking 8 bytes
                raf.write(bytes)
            }
            NetVisionLogger.instance.debug("Cached with timestamp: $timestamp to ${file.absolutePath}")
        } catch (e: Exception) {
            NetVisionLogger.instance.error("Failed to persist response: ${e.message}")
        }
    }

    fun loadCachedResponse(request: okhttp3.Request, context: Context): ByteArray? {
        return try {
            val file = cacheFile(request, context)
            if (!file.exists()) return null

            RandomAccessFile(file, "r").use { raf ->
                raf.seek(TIMESTAMP_HEADER_SIZE.toLong()) // Skip the timestamp header
                val remaining = ByteArray((raf.length() - TIMESTAMP_HEADER_SIZE).toInt())
                raf.readFully(remaining)
                NetVisionLogger.instance.debug("Loaded cache from: ${file.absolutePath}")
                remaining
            }
        } catch (e: Exception) {
            NetVisionLogger.instance.error("Failed to load cache: ${e.message}")
            null
        }
    }

    fun isExpired(request: okhttp3.Request, context: Context, ttlMs: Long): Boolean {
        return try {
            val file = cacheFile(request, context)
            isExpired(file, ttlMs)
        } catch (_: Exception) {
            true
        }
    }

    private fun isExpired(file: File, ttlMs: Long): Boolean {
        return try {
            if (!file.exists()) return true
            RandomAccessFile(file, "r").use { raf ->
                val timestamp = raf.readLong() // Read the timestamp from the beginning
                System.currentTimeMillis() - timestamp > ttlMs
            }
        } catch (_: Exception) {
            true
        }
    }

    fun cleanExpiredFiles(context: Context, ttlMs: Long = 24 * 60 * 60 * 1000L) {
        ensureInitialized(context)
        NetVisionLogger.instance.debug("🧹 Cleaning expired cache files older than $ttlMs ms")
        cacheDir.listFiles()?.forEach { file ->
            try {
                if (isExpired(file, ttlMs)) {
                    file.delete()
                    NetVisionLogger.instance.debug("🧹 Deleted expired cache file: ${file.name}")
                }
            } catch (e: Exception) {
                NetVisionLogger.instance.error("❌ Error checking expiration: ${e.message}")
            }
        }
    }
}