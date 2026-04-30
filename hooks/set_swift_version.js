#!/usr/bin/env node

module.exports = function(context) {
    var fs = require('fs');
    var path = require('path');
    
    // Find the .pbxproj file
    var platformRoot = path.join(context.opts.projectRoot, 'platforms', 'ios');
    var dirContent = fs.readdirSync(platformRoot);
    var xcodeProjectDir = dirContent.find(function(item) {
        return item.endsWith('.xcodeproj');
    });
    
    if (!xcodeProjectDir) {
        console.log('set_swift_version: No .xcodeproj found, skipping.');
        return;
    }
    
    var pbxprojPath = path.join(platformRoot, xcodeProjectDir, 'project.pbxproj');
    
    if (!fs.existsSync(pbxprojPath)) {
        console.log('set_swift_version: project.pbxproj not found, skipping.');
        return;
    }
    
    var content = fs.readFileSync(pbxprojPath, 'utf8');
    
    // If SWIFT_VERSION is already set, don't override
    if (content.indexOf('SWIFT_VERSION') !== -1) {
        console.log('set_swift_version: SWIFT_VERSION already set.');
        return;
    }
    
    // Add SWIFT_VERSION = 5 to all build configuration sections
    content = content.replace(/buildSettings = \{/g, 'buildSettings = {\n\t\t\t\tSWIFT_VERSION = 5;');
    
    fs.writeFileSync(pbxprojPath, content, 'utf8');
    console.log('set_swift_version: Set SWIFT_VERSION = 5 in project.pbxproj');
};
