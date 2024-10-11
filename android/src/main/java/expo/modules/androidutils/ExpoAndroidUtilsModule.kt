package expo.modules.androidutils

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.androidutils.payloadEncryption.*
import com.google.gson.JsonObject

class ExpoAndroidUtilsModule : Module() {
  private val rsaCipherWrap: RSACipherWrap by lazy { RSACipherWrap() }
  private val aesCipherWrap: AESCipherWrap by lazy { AESCipherWrap() }
  // private val preferencesManager: PreferencesManager by lazy { PreferencesManager(context = appContext.reactContext) }
  private val preferencesManager: PreferencesManager? by lazy {
    appContext.reactContext?.let { PreferencesManager(it) }
  }
  private val clientSecurePayloadProducer: ClientSecurePayloadProducer by lazy { ClientSecurePayloadProducer() }

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoAndroidUtils')` in JavaScript.
    Name("ExpoAndroidUtils")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    AsyncFunction("generateRsaKeyPair") {
      val rsaKeyPair = rsaCipherWrap.generateKeyPair()
      val publicKey = CompassEncodedKeySpec.encodeToString(rsaKeyPair.public)
      val resultMap = mapOf(
        "publicKey" to publicKey
      )
      return@AsyncFunction resultMap
    }

    AsyncFunction("generateAesKey") {
      val aesSecretKey =  aesCipherWrap.generateAESKey()
      val aesStringKey = aesCipherWrap.aesSecreteKeyToString(aesSecretKey)
      val resultMap = mapOf(
        "aesStringKey" to aesStringKey
      )
      return@AsyncFunction resultMap
    }

    AsyncFunction("saveStringData") { key: String, value: String ->
      preferencesManager?.saveStringData(key, value)
      val resultMap = mapOf(
        "success" to true
      )
      return@AsyncFunction resultMap
    }

    AsyncFunction("saveBoolData") { key: String, value: Boolean ->
      preferencesManager?.saveBoolData(key, value)
      val resultMap = mapOf(
        "success" to true
      )
      return@AsyncFunction resultMap
    }

    AsyncFunction("getStringData") { key: String ->
      val value = preferencesManager?.getStringData(key = key, "")
      val resultMap = mapOf(
        "data" to value
      )
      return@AsyncFunction resultMap
    }

    AsyncFunction("getBoolData") { key: String ->
      val value = preferencesManager?.getBoolData(key = key)
      val resultMap = mapOf(
        "data" to value
      )
      return@AsyncFunction resultMap
    }

    AsyncFunction("clearData") { key: String ->
      val value = preferencesManager?.clearData(key = key)
      val resultMap = mapOf(
        "success" to value
      )
      return@AsyncFunction resultMap
    }

    AsyncFunction("prepareRequestPayload") { payload: Map<String, Any> ->
      if (!payload.containsKey("cmt")) {
        throw Exception("Missing parameter: 'cmt'")
      }
      if (!payload.containsKey("bridgeRaPublicKey")) {
        throw Exception("Missing parameter: 'bridgeRaPublicKey'")
      }
      val cmt = payload["cmt"] as? String ?: ""
      val bridgeRaPublicKey = payload["bridgeRaPublicKey"] as? String ?: ""
      val response = clientSecurePayloadProducer.prepareRequestPayload(cmt, bridgeRaPublicKey)

      return@AsyncFunction mapOf("requestData" to response)
    }

    AsyncFunction("parseResponsePayload") { cmtPayload: String ->
      val response = clientSecurePayloadProducer.parseResponsePayload(cmtPayload)
      return@AsyncFunction mapOf("responseData" to response)
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ExpoAndroidUtilsView::class) {
      // Defines a setter for the `name` prop.
      Prop("name") { view: ExpoAndroidUtilsView, prop: String ->
        println(prop)
      }
    }
  }
}
