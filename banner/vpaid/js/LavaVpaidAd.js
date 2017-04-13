/**
 * @constructor
 */
var LavaVpaidAd = function() {
  // The slot is the div element on the main page that the ad is supposed to
  // occupy.
  this.slot_ = null;
  // The video slot is the video object that the creative can use to render the
  // video element it might have.
  this.videoSlot_ = null;
  // An object containing all registered events.  These events are all
  // callbacks from the vpaid ad.
  this.eventCallbacks_ = {};
  // A list of attributes getable and setable.
  this.attributes_ = {
    'companions' : '',
    'desiredBitrate' : 256,
    'duration' : 30,
    'expanded' : false,
    'height' : 0,
    'icons' : '',
    'linear' : true,
    'remainingTime' : 10,
    'skippableState' : false,
    'viewMode' : 'normal',
    'width' : 0,
    'volume' : 50
  };
};

/**
 * VPAID defined init ad, initializes all attributes in the ad.  Ad will
 * not start until startAd is called.
 *
 * @param {number} width The ad width.
 * @param {number} height The ad heigth.
 * @param {string} viewMode The ad view mode.
 * @param {number} desiredBitrate The desired bitrate.
 * @param {Object} creativeData Data associated with the creative.
 * @param {Object} environmentVars Variables associated with the creative like
 *     the slot and video slot.
 */
LavaVpaidAd.prototype.initAd = function(
    width,
    height,
    viewMode,
    desiredBitrate,
    creativeData,
    environmentVars) {

  // slot and videoSlot are passed as part of the environmentVars
  this.slot_ = environmentVars.slot;
  this.videoSlot_ = environmentVars.videoSlot;
  this.attributes_['width'] = width;
  this.attributes_['height'] = height;
  this.attributes_['viewMode'] = viewMode;
  this.attributes_['desiredBitrate'] = desiredBitrate;

  var AdParameters = JSON.parse(creativeData.AdParameters);
  var url = AdParameters && AdParameters.vpaidHTMLLink ? AdParameters.vpaidHTMLLink : "";
  var cus = AdParameters && AdParameters.vpaidCustomParametervpaidHTMLLink ? AdParameters.vpaidCustomParametervpaidHTMLLink : "";

  this.renderSlot_(url, cus);
};


/**
 * Populates the inner html of the slot.
 * @private
 */
LavaVpaidAd.prototype.renderSlot_ = function(url, customParameter) {
  var slotExists = this.slot_ && this.slot_.tagName === 'DIV';
  if (!slotExists) {
    this.slot_ = document.createElement('div');
    if (!document.body) {
      document.body = /**@type {HTMLDocument}*/ document.createElement('body');
    }
    document.body.appendChild(this.slot_);
  }

  var iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.scrolling = 'no';
  iframe.setAttribute('data-custom', customParameter);
  iframe.style.border = 'none';
  iframe.src = url;

  this.slot_.appendChild(iframe);

  var prefix = url.substr(0, url.indexOf('://') + 3);
  var suffix = url.substr(url.indexOf('://') + 3, url.length);
  suffix = suffix.indexOf('/') > 0 ? suffix.substr(0, suffix.indexOf('/')) : suffix;
  var domain = prefix + suffix;

  var that = this;
  window.addEventListener("message", receiveMessage, false);

  function receiveMessage(evt) {
   if (evt.origin !== domain)
      return;

    var data = JSON.parse(evt.data);
    var eventName = data.eventName;
    var params = data.params.split(',');

    if (eventName in that.eventCallbacks_) {
      that.eventCallbacks_[eventName](params);
    }  
  }
};

/**
 * Returns the versions of vpaid ad supported.
 * @param {string} version
 * @return {string}
 */
LavaVpaidAd.prototype.handshakeVersion = function(version) {
  return ('2.0');
};


/**
 * Called by the wrapper to start the ad.
 */
LavaVpaidAd.prototype.startAd = function() {
  if ('AdStart' in this.eventCallbacks_) {
    this.eventCallbacks_['AdStarted']();
  }
};


/**
 * Called by the wrapper to stop the ad.
 */
LavaVpaidAd.prototype.stopAd = function() {
  if ('AdStop' in this.eventCallbacks_) {
    this.eventCallbacks_['AdStopped']();
  }
};


/**
 * @param {number} value The volume in percentage.
 */
LavaVpaidAd.prototype.setAdVolume = function(value) {
  this.attributes_['volume'] = value;
  if ('AdVolumeChange' in this.eventCallbacks_) {
    this.eventCallbacks_['AdVolumeChange']();
  }
};


/**
 * @return {number} The volume of the ad.
 */
LavaVpaidAd.prototype.getAdVolume = function() {
  return this.attributes_['volume'];
};


/**
 * @param {number} width The new width.
 * @param {number} height A new height.
 * @param {string} viewMode A new view mode.
 */
LavaVpaidAd.prototype.resizeAd = function(width, height, viewMode) {
  this.attributes_['width'] = width;
  this.attributes_['height'] = height;
  this.attributes_['viewMode'] = viewMode;
  if ('AdSizeChange' in this.eventCallbacks_) {
    this.eventCallbacks_['AdSizeChange']();
  }
};


/**
 * Pauses the ad.
 */
LavaVpaidAd.prototype.pauseAd = function() {
  if ('AdPaused' in this.eventCallbacks_) {
    this.eventCallbacks_['AdPaused']();
  }
};


/**
 * Resumes the ad.
 */
LavaVpaidAd.prototype.resumeAd = function() {
  if ('AdResumed' in this.eventCallbacks_) {
    this.eventCallbacks_['AdResumed']();
  }
};


/**
 * Expands the ad.
 */
LavaVpaidAd.prototype.expandAd = function() {
  this.attributes_['expanded'] = true;
  if ('AdExpanded' in this.eventCallbacks_) {
    this.eventCallbacks_['AdExpanded']();
  }
};


/**
 * Returns true if the ad is expanded.
 *
 * @return {boolean}
 */
LavaVpaidAd.prototype.getAdExpanded = function() {
  return this.attributes_['expanded'];
};


/**
 * Returns the skippable state of the ad.
 *
 * @return {boolean}
 */
LavaVpaidAd.prototype.getAdSkippableState = function() {
  return this.attributes_['skippableState'];
};


/**
 * Collapses the ad.
 */
LavaVpaidAd.prototype.collapseAd = function() {
  this.attributes_['expanded'] = false;
};


/**
 * Skips the ad.
 */
LavaVpaidAd.prototype.skipAd = function() {
  var skippableState = this.attributes_['skippableState'];
  if (skippableState) {
    if ('AdSkipped' in this.eventCallbacks_) {
      this.eventCallbacks_['AdSkipped']();
    } else {
      this.log('Error: Invalid ad skip request.');
    }
  }
};


/**
 * Registers a callback for an event.
 * @param {Function} aCallback The callback function.
 * @param {string} eventName The callback type.
 * @param {Object} aContext The context for the callback.
 */
LavaVpaidAd.prototype.subscribe = function(aCallback, eventName, aContext) {
  var callBack = aCallback.bind(aContext);
  this.eventCallbacks_[eventName] = callBack;
};


/**
 * Removes a callback based on the eventName.
 *
 * @param {string} eventName The callback type.
 */
LavaVpaidAd.prototype.unsubscribe = function(eventName) {
  this.eventCallbacks_[eventName] = null;
};


/**
 * @return {number} The ad width.
 */
LavaVpaidAd.prototype.getAdWidth = function() {
  return this.attributes_['width'];
};


/**
 * @return {number} The ad height.
 */
LavaVpaidAd.prototype.getAdHeight = function() {
  return this.attributes_['height'];
};


/**
 * @return {number} The time remaining in the ad.
 */
LavaVpaidAd.prototype.getAdRemainingTime = function() {
  return this.attributes_['remainingTime'];
};


/**
 * @return {number} The duration of the ad.
 */
LavaVpaidAd.prototype.getAdDuration = function() {
  return this.attributes_['duration'];
};


/**
 * @return {string} List of companions in vast xml.
 */
LavaVpaidAd.prototype.getAdCompanions = function() {
  return this.attributes_['companions'];
};


/**
 * @return {string} A list of icons.
 */
LavaVpaidAd.prototype.getAdIcons = function() {
  return this.attributes_['icons'];
};


/**
 * @return {boolean} True if the ad is a linear, false for non linear.
 */
LavaVpaidAd.prototype.getAdLinear = function() {
  return this.attributes_['linear'];
};

/**
 * Main function called by wrapper to get the vpaid ad.
 *
 * @return {Object}
 */
var getVPAIDAd = function() {
  return new LavaVpaidAd();
};
