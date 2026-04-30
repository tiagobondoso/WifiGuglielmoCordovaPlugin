var exec = require('cordova/exec');

var WifiSDKPlugin = {

    /**
     * Initialize the Guglielmo Connect SDK
     * @param {Object} options - { username: '...', password: '...' }
     * @param {Function} success - Success callback
     * @param {Function} error - Error callback
     */
    initialize: function (options, success, error) {
        exec(success, error, 'WifiSDKPlugin', 'initialize', [options]);
    },

    /**
     * Check if the Passpoint/OpenRoaming network profile is already added
     * @param {Function} success - Success callback with boolean (true if added)
     * @param {Function} error - Error callback
     */
    isNetworkAdded: function (success, error) {
        exec(success, error, 'WifiSDKPlugin', 'isNetworkAdded', []);
    },

    /**
     * Add the Passpoint/OpenRoaming network profile to the device
     * @param {Object} options - { userId: '...', additionalInfo: { key: 'value' } }
     * @param {Function} success - Success callback with boolean (true if added)
     * @param {Function} error - Error callback
     */
    addNetwork: function (options, success, error) {
        exec(success, error, 'WifiSDKPlugin', 'addNetwork', [options]);
    }

};

module.exports = WifiSDKPlugin;
