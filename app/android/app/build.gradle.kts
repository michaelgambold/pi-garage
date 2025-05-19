import java.util.Properties
import java.io.FileInputStream

val localPropertiesFile = rootProject.file("local.properties")
val localProperties = Properties().apply {
    if (localPropertiesFile.exists()) {
        load(FileInputStream(localPropertiesFile))
    }
}

fun getLocalProperty(key: String, defaultValue: String): String {
    return localProperties.getProperty(key) ?: defaultValue
}

val flutterVersionCode = getLocalProperty("flutter.versionCode", "1").toInt()
val flutterVersionName = getLocalProperty("flutter.versionName", "1.0")

val keystorePropertiesFile = rootProject.file("key.properties")
val keystoreProperties = Properties().apply {
    if (keystorePropertiesFile.exists()) {
        load(FileInputStream(keystorePropertiesFile))
    } else {
        put("keyAlias", System.getenv("KEY_ALIAS") ?: "")
        put("keyPassword", System.getenv("KEY_PASSWORD") ?: "")
        put("storeFile", System.getenv("KEYSTORE_FILE") ?: "")
        put("storePassword", System.getenv("STORE_PASSWORD") ?: "")
    }
}

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.michaelgambold.pigarage"
    compileSdk = flutter.compileSdkVersion
    //ndkVersion = flutter.ndkVersion
    ndkVersion = "27.0.12077973"

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.michaelgambold.pigarage"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutterVersionCode
        versionName = flutterVersionName
    }

    signingConfigs {
        create("release") {
            keyAlias = keystoreProperties["keyAlias"] as String
            keyPassword = keystoreProperties["keyPassword"] as String
            storeFile = keystoreProperties["storeFile"]?.let { file(it as String) }
            storePassword = keystoreProperties["storePassword"] as String
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            // signingConfig signingConfigs.release
        }
    }
}

flutter {
    source = "../.."
}
