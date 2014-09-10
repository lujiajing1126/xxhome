define(function(require, exports, module) {

    var ua = window.navigator.userAgent.toLowerCase(),
        _DEBUG = false,
        _iOS = ua.match(/^mozilla/i) == "mozilla" && ua.indexOf('mobile') != -1 && (ua.indexOf('ipod') != -1 || ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1),
        _Android = ua.match(/^mozilla/i) == "mozilla" && ua.indexOf("linux") != -1 && ua.indexOf('android'),
        _WX = ua.indexOf('micromessenger') != -1;

    exports.bowser = {
        ios: _iOS,
        android: _Android,
        wx: _WX
    };
});