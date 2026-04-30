import Foundation
import class GuglielmoConnectSDK.GuglielmoConnectSDK
import struct GuglielmoConnectSDK.ConnectResponse

@objc(WifiSDKPlugin)
class WifiSDKPlugin: CDVPlugin {

    private let sdk = GuglielmoConnectSDK.instance

    @objc(initialize:)
    func initialize(command: CDVInvokedUrlCommand) {
        guard let options = command.arguments?.first as? [String: Any],
              let username = options["username"] as? String, !username.isEmpty,
              let password = options["password"] as? String, !password.isEmpty else {
            let result = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "username and password are required")
            self.commandDelegate.send(result, callbackId: command.callbackId)
            return
        }

        sdk.initialize(username: username, password: password)

        let result = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: "SDK initialized")
        self.commandDelegate.send(result, callbackId: command.callbackId)
    }

    @objc(isNetworkAdded:)
    func isNetworkAdded(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run(inBackground: {
            self.sdk.isSuggestedNetworkAlreadyAdded { alreadyAdded, response in
                let result = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: alreadyAdded)
                self.commandDelegate.send(result, callbackId: command.callbackId)
            }
        })
    }

    @objc(addNetwork:)
    func addNetwork(command: CDVInvokedUrlCommand) {
        guard let options = command.arguments?.first as? [String: Any],
              let userId = options["userId"] as? String, !userId.isEmpty else {
            let result = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "userId is required")
            self.commandDelegate.send(result, callbackId: command.callbackId)
            return
        }

        let additionalInfo = options["additionalInfo"] as? [String: String]

        self.commandDelegate.run(inBackground: {
            self.sdk.askUserToAddSuggestedNetwork(
                userIdentifier: userId,
                additionalInfo: additionalInfo
            ) { success, response in
                if success {
                    let result = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: true)
                    self.commandDelegate.send(result, callbackId: command.callbackId)
                } else {
                    let message = response.message ?? "Failed to add network"
                    let result = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: message)
                    self.commandDelegate.send(result, callbackId: command.callbackId)
                }
            }
        })
    }
}