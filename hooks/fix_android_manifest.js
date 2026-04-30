#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

module.exports = function (context) {
    var platforms = context.opts.platforms || [];
    if (platforms.indexOf('android') === -1) return;

    var projectRoot = context.opts.projectRoot;
    var platformRoot = path.join(projectRoot, 'platforms', 'android');
    var appSrcMain = path.join(platformRoot, 'app', 'src', 'main');
    var manifestPath = path.join(appSrcMain, 'AndroidManifest.xml');

    // 1. Patch AndroidManifest.xml - add tools namespace and overrideLibrary
    if (fs.existsSync(manifestPath)) {
        var manifest = fs.readFileSync(manifestPath, 'utf8');

        // Add tools namespace if not present
        if (manifest.indexOf('xmlns:tools') === -1) {
            manifest = manifest.replace(
                '<manifest ',
                '<manifest xmlns:tools="http://schemas.android.com/tools" '
            );
        }

        // Add tools:overrideLibrary to uses-sdk if not present
        if (manifest.indexOf('tools:overrideLibrary') === -1) {
            manifest = manifest.replace(
                /<uses-sdk([^/>]*)\/?>/,
                '<uses-sdk$1 tools:overrideLibrary="biz.guglielmo.android.connect" />'
            );
        }

        fs.writeFileSync(manifestPath, manifest, 'utf8');
        console.log('fix_android_manifest: Added tools:overrideLibrary for GuglielmoConnectSDK');
    }

    // 2. Patch cdvMinSdkVersion in cordova gradle config
    var gradleConfigPath = path.join(platformRoot, 'app', 'cdv-gradle-config.json');
    if (fs.existsSync(gradleConfigPath)) {
        var config = JSON.parse(fs.readFileSync(gradleConfigPath, 'utf8'));
        if (config.MIN_SDK_VERSION && parseInt(config.MIN_SDK_VERSION) < 30) {
            config.MIN_SDK_VERSION = 30;
            fs.writeFileSync(gradleConfigPath, JSON.stringify(config, null, 2), 'utf8');
            console.log('fix_android_manifest: Updated MIN_SDK_VERSION to 30 in cdv-gradle-config.json');
        }
    }
};
