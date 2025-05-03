package com.omeratt.rnnetvision

import okhttp3.MediaType
import okhttp3.ResponseBody
import okio.*

import android.util.Base64

class InterceptingResponseBody(
    private val originalBody: ResponseBody,
    private val callback: (String) -> Unit
) : ResponseBody() {

    private val buffer = Buffer()

    override fun contentType(): MediaType? = originalBody.contentType()

    override fun contentLength(): Long = originalBody.contentLength()

    override fun source(): BufferedSource {
        val originalSource = originalBody.source()
        return object : ForwardingSource(originalSource) {
            override fun read(sink: Buffer, byteCount: Long): Long {
                val bytesRead = super.read(sink, byteCount)

                if (bytesRead > 0) {
                    // Read some bytes, write them to the buffer
                    val segment = sink.clone()
                    buffer.writeAll(segment)
                } else if (bytesRead == -1L) {
                    try {
                        val rawBytes = buffer.readByteArray()
                        val base64 = Base64.encodeToString(rawBytes, Base64.NO_WRAP)
                        callback(base64)
                    } catch (e: Exception) {
                        callback("")
                    }
                }

                return bytesRead
            }
        }.buffer()
    }
}