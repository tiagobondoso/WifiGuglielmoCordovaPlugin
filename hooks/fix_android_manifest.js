#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

module.exports = function (context) {
    var platforms = context.opts.platforms || [];
    if (platforms.indexOf('android') === -1) return;

    var platformRoot = path.join(context.opts.projectRoot, 'platforms', 'android', 'app', 'src', 'main');
    var manifestPath = path.join(platformRoot, 'AndroidManifest.xml');

    if (!fs.existsSync(manifestPath)) return;

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
};
