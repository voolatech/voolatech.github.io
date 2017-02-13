(function() {



function LavaVpaid() {  
}

LavaVpaid.Event = {
  AdLoaded                : "AdLoaded",
  AdStarted               : "AdStarted",
  AdStopped               : "AdStopped",
  AdSkipped               : "AdSkipped",
  AdSkippableStateChange  : "AdSkippableStateChange",
  AdSizeChange            : "AdSizeChange",
  AdLinearChange          : "AdLinearChange",
  AdDurationChange        : "AdDurationChange",
  AdExpandedChange        : "AdExpandedChange",
  AdRemainingTimeChange   : "AdRemainingTimeChange",
  AdVolumeChange          : "AdVolumeChange",
  AdImpression            : "AdImpression",
  AdVideoFirstQuartile    : "AdVideoStart",
  AdVideoFirstQuartile    : "AdVideoFirstQuartile",
  AdVideoMidpoint         : "AdVideoMidpoint",
  AdVideoThirdQuartile    : "AdVideoThirdQuartile",
  AdVideoComplete         : "AdVideoComplete",
  AdClickThru             : "AdClickThru",
  AdInteraction           : "AdInteraction",
  AdUserAcceptInvitation  : "AdUserAcceptInvitation",
  AdUserMinimize          : "AdUserMinimize",
  AdUserClose             : "AdUserClose",
  AdPaused                : "AdPaused",
  AdPlaying               : "AdPlaying",
  AdLog                   : "AdLog",
  AdError                 : "AdError"
};

LavaVpaid.prototype.configure = function(options) {
	console.log('configure');
}

LavaVpaid.prototype.startAd = function() {
  this.call(LavaVpaid.Event.AdStarted);
  this.call(LavaVpaid.Event.AdImpression);
}

LavaVpaid.prototype.skipAd = function() {
  this.call(LavaVpaid.Event.AdSkipped);
  this.call(LavaVpaid.Event.AdStopped);
}

LavaVpaid.prototype.clickThruAd = function() {
  this.call(LavaVpaid.Event.AdClickThru);
}

LavaVpaid.prototype.call = function(eventName, ...params) {
	window.parent.postMessage('{"eventName" : "' + eventName+ '", "params": "' + params.toString() + '"}', "*");
}

window.LAVA = window.LAVA ? window.LAVA : {};
window.LAVA.LavaVpaid = LavaVpaid;

})();
