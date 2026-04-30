# cordova-plugin-wifi-sdk

Cordova plugin wrapping the **GuglielmoConnectSDK** for iOS and Android, enabling Passpoint/OpenRoaming WiFi network provisioning in hybrid mobile apps (including OutSystems MABS).

## Supported Platforms

- **iOS** (arm64) — Swift, requires iOS 15.0+
- **Android** (arm64/x86_64) — Java, requires minSdkVersion 30+

## Installation

```bash
cordova plugin add https://github.com/tiagobondoso/WifiGuglielmoCordovaPlugin.git
```

Or in OutSystems, reference the plugin's GitHub URL in your extensibility configurations.

## API

The plugin exposes a global `WifiSDKPlugin` object with three methods:

### `WifiSDKPlugin.initialize(options, success, error)`

Initializes the SDK with your Guglielmo credentials. Must be called before any other method.

| Parameter | Type | Description |
|-----------|------|-------------|
| `options.username` | `String` | Your Guglielmo SDK username |
| `options.password` | `String` | Your Guglielmo SDK API key/password |

```javascript
WifiSDKPlugin.initialize(
    { username: "your_username", password: "your_api_key" },
    function () { console.log("SDK initialized"); },
    function (err) { console.error("Init failed:", err); }
);
```

### `WifiSDKPlugin.isNetworkAdded(success, error)`

Checks whether the Passpoint/OpenRoaming network profile is already provisioned on the device.

| Callback | Value | Description |
|----------|-------|-------------|
| `success` | `1` / `0` (Android) or `true` / `false` (iOS) | Whether the profile is present |

```javascript
WifiSDKPlugin.isNetworkAdded(
    function (isAdded) { console.log("Network added:", isAdded); },
    function (err) { console.error("Check failed:", err); }
);
```

### `WifiSDKPlugin.addNetwork(options, success, error)`

Prompts the user to add the Passpoint/OpenRoaming network profile to the device.

| Parameter | Type | Description |
|-----------|------|-------------|
| `options.userId` | `String` | User identifier (e.g. email) |
| `options.additionalInfo` | `Object` *(optional)* | Key-value pairs with extra metadata |

```javascript
WifiSDKPlugin.addNetwork(
    { userId: "user@example.com", additionalInfo: { plan: "premium" } },
    function (result) { console.log("Network added successfully"); },
    function (err) { console.error("Add failed:", err); }
);
```

## Project Structure

```
plugin.xml                          # Plugin configuration
package.json                        # npm/Cordova metadata
www/
  WifiSDKPlugin.js                  # JavaScript interface
src/
  android/
    WifiSDKPlugin.java              # Android native bridge
    GuglielmoConnectSDK-release.aar # Android SDK binary
    build-extras.gradle             # Gradle dependencies & config
  ios/
    WifiSDKPlugin.swift             # iOS native bridge
    Frameworks/
      GuglielmoConnectSDK.xcframework/  # iOS SDK binary
hooks/
  set_swift_version.js              # Sets Swift version in Xcode project
  fix_android_manifest.js           # Patches minSdkVersion & manifest for Android
```

## Notes

- **Android**: The SDK requires `minSdkVersion 30`. The plugin automatically patches the Android manifest and Gradle config to handle this.
- **iOS**: The SDK xcframework includes hand-crafted `.swiftinterface` files for module stability. Built with Swift 6.2.x (effective-5.10).
- **OutSystems MABS**: Tested and compatible with MABS 11 builds using cordova-android 14.x and cordova-ios 7.1.x.

## License

MIT
