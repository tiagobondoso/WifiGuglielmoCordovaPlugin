#import <Cordova/CDVPlugin.h>

@interface WifiSDKPlugin : CDVPlugin

- (void)initialize:(CDVInvokedUrlCommand *)command;
- (void)isNetworkAdded:(CDVInvokedUrlCommand *)command;
- (void)addNetwork:(CDVInvokedUrlCommand *)command;

@end
