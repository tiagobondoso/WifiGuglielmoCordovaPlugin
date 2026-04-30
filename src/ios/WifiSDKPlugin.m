#import "WifiSDKPlugin.h"
@import GuglielmoConnectSDK;

@implementation WifiSDKPlugin

- (void)initialize:(CDVInvokedUrlCommand *)command {
    NSDictionary *options = [command.arguments objectAtIndex:0];
    NSString *username = options[@"username"];
    NSString *password = options[@"password"];

    if (!username || [username length] == 0 || !password || [password length] == 0) {
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"username and password are required"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    [[GuglielmoConnectSDK instance] initializeWithUsername:username password:password];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"SDK initialized"];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)isNetworkAdded:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        [[GuglielmoConnectSDK instance] isSuggestedNetworkAlreadyAddedWithCompletion:^(BOOL alreadyAdded, id response) {
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:alreadyAdded];
            [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        }];
    }];
}

- (void)addNetwork:(CDVInvokedUrlCommand *)command {
    NSDictionary *options = [command.arguments objectAtIndex:0];
    NSString *userId = options[@"userId"];
    NSDictionary *additionalInfo = options[@"additionalInfo"];

    if (!userId || [userId length] == 0) {
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"userId is required"];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    [self.commandDelegate runInBackground:^{
        [[GuglielmoConnectSDK instance] askUserToAddSuggestedNetworkWithUserIdentifier:userId additionalInfo:additionalInfo completion:^(BOOL success, id response) {
            if (success) {
                CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            } else {
                CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Failed to add network"];
                [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
            }
        }];
    }];
}

@end
