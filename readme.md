# Pulse Platform app

**Provide Bluetooth beacon and geofence services to your customers.**

This app targets iOS and Android, and uses the [Pulse Platform](https://www2.nowsquare.com/pulse-platform) API, https://www2.nowsquare.com/pulse-platform/documentation/v2/API/scenario-boards.

## Prerequisites
The following libraries are required:

 - [NodeJS](https://www.nodejs.org)
 - [NPM](https://www.npmjs.com)
 - [Ionic 2 and Cordova](https://ionicframework.com/docs/v2/getting-started/installation/)
 - [Bower](http://bower.io)

## Installation
After you've downloaded the project, open the `config.xml` in the root and update the name, app id and version. Then, navigate to the root directory with your CLI.

### Install required NPM packages
`$ npm install`

### Add Ionic dirs
`$ ionic serve`

### Add plugins

 - `$ ionic plugin add cordova-plugin-device`
 - `$ ionic plugin add cordova-sqlite-storage`
 - `$ ionic plugin add phonegap-plugin-barcodescanner`
 - `$ ionic plugin add cordova-plugin-geolocation`
 - `$ ionic plugin add cordova-plugin-ibeacon`
 - `$ ionic plugin add https://github.com/EddyVerbruggen/cordova-plugin-local-notifications`
 - `$ ionic plugin add cordova-plugin-safariviewcontroller`
 - `$ ionic plugin add https://github.com/cowbell/cordova-plugin-geofence`

#### Cordova Geofence Plugin
The Cordova Geofence Plugin requires some extra settings for iOS. In Xcode set:

**Build Settings > Use Legacy Swift Language Version > Yes**

And in config.xml:

`<preference name="UseLegacySwiftLanguageVersion" value="true" />`

### iOS

Add the following keys to the project's Info.plist:

> <key>NSCameraUsageDescription</key>
> <string>Used to scan QR codes</string>

> <key>NSLocationAlwaysUsageDescription</key>
> <string>Used to provide information based on the device location</string>

> <key>NSBluetoothPeripheralUsageDescription</key>
> <string>Used to receive Bluetooth Beacon signals</string>

### Add platforms
For iOS developers, take a look at the [Cordova iOS Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/) and follow the instructions to install or upgrade X Code, and possibly register for a developer account to start building apps for iOS.

For Android developers, take a look at the [Cordova Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/) and follow the instructions to install the SDK and/or Android Studio to start building apps for Android.
