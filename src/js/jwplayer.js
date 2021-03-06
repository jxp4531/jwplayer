define([
    'api/global-api',
    'utils/helpers',
    'polyfill/bind',
    'polyfill/eventlisteners',
    '../css/jwplayer.less'
], function (GlobalApi, utils) {
    /*global __webpack_public_path__:true*/
    __webpack_public_path__ = utils.getScriptPath('jwplayer.js');

    // This is necessary for plugins in an AMD setup
    if (typeof exports === 'object' || (typeof define === 'function' && define.amd)) {
        window.jwplayer = window.jwplayer || { registerPlugin : GlobalApi.registerPlugin};
    }

    return GlobalApi.selectPlayer;
});