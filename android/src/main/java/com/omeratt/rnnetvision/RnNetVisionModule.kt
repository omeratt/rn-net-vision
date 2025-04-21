package com.omeratt.rnnetvision

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.network.OkHttpClientFactory
import okhttp3.*
import java.io.IOException
import java.lang.reflect.Proxy

import java.net.DatagramPacket
import java.net.HttpURLConnection
import java.net.InetAddress
import java.net.URL
import com.omeratt.rnnetvision.NetVisionDispatcher
import java.net.DatagramSocket

import java.net.NetworkInterface

class RnNetVisionModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME


  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  @ReactMethod
  fun start() {
    Log.d(NAME, "🟢 NetVision manually triggered via Dev Menu")
  }

  @ReactMethod
  fun startDebuggerViaDiscovery(promise: Promise) {
      Thread {
          try {
              val udpPort = 4242
              val responseBuf = ByteArray(1024)
              val socket = DatagramSocket()
              socket.broadcast = true
              socket.soTimeout = 1500

              val sendData = "NETVISION_DISCOVER".toByteArray()

              val dynamicBroadcasts = getDynamicBroadcastAddresses()
              val staticTargets = listOf(
                  "10.0.2.2",
                  "127.0.0.1",
                  "255.255.255.255"
              )

              val allTargets = dynamicBroadcasts + staticTargets

              for (ip in allTargets) {
                  try {
                      val address = InetAddress.getByName(ip)
                      val packet = DatagramPacket(sendData, sendData.size, address, udpPort)
                      socket.send(packet)
                      Log.d("NetVision", "📡 Sent UDP discovery to $ip")
                  } catch (e: Exception) {
                      Log.w("NetVision", "⚠️ Failed to send to $ip: ${e.message}")
                  }
              }

              val responsePacket = DatagramPacket(responseBuf, responseBuf.size)
              socket.receive(responsePacket)
              socket.close()

              val message = String(responsePacket.data, 0, responsePacket.length)
              Log.d("NetVision", "📡 Got UDP response: $message")

              val parts = message.split(":")
              val serverIP = responsePacket.address.hostAddress
              val port = parts.getOrNull(1)?.toIntOrNull() ?: 8088

              NetVisionDispatcher.connect(serverIP, port)
              Log.d("NetVision", "📡 Connecting to debugger at $serverIP:$port")

              promise.resolve("Connected to debugger at $serverIP:$port")
          } catch (e: Exception) {
              Log.e("NetVision", "❌ Discovery failed: ${e.message}")
              promise.reject("DISCOVERY_FAILED", e)
          }
      }.start()
  }

  private fun getDynamicBroadcastAddresses(): List<String> {
      val result = mutableListOf<String>()
      try {
          val interfaces = NetworkInterface.getNetworkInterfaces()
          for (iface in interfaces) {
              val addresses = iface.interfaceAddresses
              for (addr in addresses) {
                  val broadcast = addr.broadcast ?: continue
                  result.add(broadcast.hostAddress)
              }
          }
      } catch (e: Exception) {
          Log.w("NetVision", "⚠️ Failed to get dynamic broadcast addresses: ${e.message}")
      }
      return result
  }
  // @ReactMethod
  // fun startDebuggerViaDiscovery(promise: Promise) {
  //   Thread {
  //       try {
  //           val serverIP = "10.0.2.2" // Emulator IP pointing to localhost
  //           val debuggerPort = 8088

  //           Log.d("NetVision", "📡 Connecting to debugger at $serverIP:$debuggerPort")
  //           NetVisionDispatcher.connect(serverIP, debuggerPort)

  //           promise.resolve("Debugger connected to $serverIP:$debuggerPort")
  //       } catch (e: Exception) {
  //           Log.e("NetVision", "❌ Failed to connect to debugger: ${e.message}")
  //           promise.reject("DEBUGGER_CONNECT_FAILED", e)
  //       }
  //   }.start()
  // }

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