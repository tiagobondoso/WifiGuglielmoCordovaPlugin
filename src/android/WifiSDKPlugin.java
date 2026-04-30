package com.plugin.wifisdk;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import biz.guglielmo.android.sdk.connect.GuglielmoConnectSDK;
import biz.guglielmo.android.sdk.connect.GuglielmoResponse;
import biz.guglielmo.android.sdk.connect.listeners.GuglielmoNetworkStatusListener;
import biz.guglielmo.android.sdk.connect.listeners.GuglielmoNetworkSuggestionListener;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class WifiSDKPlugin extends CordovaPlugin {

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
            case "initialize":
                this.initializeSDK(args, callbackContext);
                return true;
            case "isNetworkAdded":
                this.isNetworkAdded(args, callbackContext);
                return true;
            case "addNetwork":
                this.addNetwork(args, callbackContext);
                return true;
            default:
                callbackContext.error("Action not recognized: " + action);
                return false;
        }
    }

    private void initializeSDK(JSONArray args, CallbackContext callbackContext) {
        try {
            JSONObject options = args.optJSONObject(0);
            String username = options != null ? options.optString("username", "") : "";
            String password = options != null ? options.optString("password", "") : "";

            if (username.isEmpty() || password.isEmpty()) {
                callbackContext.error("username and password are required");
                return;
            }

            GuglielmoConnectSDK.initialize(
                cordova.getActivity().getApplicationContext(),
                username,
                password
            );

            callbackContext.success("SDK initialized");
        } catch (Exception e) {
            callbackContext.error("Error initializing SDK: " + e.getMessage());
        }
    }

    private void isNetworkAdded(JSONArray args, final CallbackContext callbackContext) {
        try {
            GuglielmoConnectSDK.isSuggestedNetworkAlreadyAdded(
                cordova.getActivity(),
                new GuglielmoNetworkStatusListener() {
                    @Override
                    public void onNetworkStatus(boolean isAlreadyAdded) {
                        callbackContext.success(isAlreadyAdded ? 1 : 0);
                    }

                    @Override
                    public void onError(GuglielmoResponse guglielmoResponse) {
                        callbackContext.error(guglielmoResponse.getMessage());
                    }
                }
            );
        } catch (Exception e) {
            callbackContext.error("Error checking network: " + e.getMessage());
        }
    }

    private void addNetwork(JSONArray args, final CallbackContext callbackContext) {
        try {
            JSONObject options = args.optJSONObject(0);
            String userId = options != null ? options.optString("userId", "") : "";

            if (userId.isEmpty()) {
                callbackContext.error("userId is required");
                return;
            }

            Map<String, String> extras = null;
            if (options != null && options.has("additionalInfo")) {
                JSONObject additionalInfo = options.optJSONObject("additionalInfo");
                if (additionalInfo != null) {
                    extras = new HashMap<>();
                    Iterator<String> keys = additionalInfo.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        extras.put(key, additionalInfo.optString(key, ""));
                    }
                }
            }

            GuglielmoConnectSDK.askUserToAddSuggestedNetwork(
                cordova.getActivity(),
                userId,
                extras,
                new GuglielmoNetworkSuggestionListener() {
                    @Override
                    public void onNetworkAdded() {
                        callbackContext.success(1);
                    }

                    @Override
                    public void onError(GuglielmoResponse guglielmoResponse) {
                        callbackContext.error(guglielmoResponse.getMessage());
                    }
                }
            );
        } catch (Exception e) {
            callbackContext.error("Error adding network: " + e.getMessage());
        }
    }
}
