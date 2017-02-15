(function() {

function LavaVpaidPlayer() {

  this.video = null;
  this.VPAID = null;

  this.videoTime = 0;
  this.autoTime = 0;
  this.timeout = 0;

  this.percent25 = {track: false, value: 25};
  this.percent50 = {track: false, value: 50};
  this.percent75 = {track: false, value: 75};
}

LavaVpaidPlayer.prototype.connect = function(video, VPAID) {
  this.video = video;
  this.VPAID = VPAID;

  //this.video.addEventListener('loadedmetadata', onLoadedMetaData);
  this.video.addEventListener('timeupdate', onTimeUpdate);

  var that = this;

  //function onLoadedMetaData(evt) {
  //  that.autoTime = that.videoTime = Math.ceil(that.video.duration);
    //startAuto();
  //};

  function onTimeUpdate(evt) {
    if (that.autoTime == 0 && that.video.duration) {
        that.autoTime = that.videoTime = Math.ceil(that.video.duration);
    }
    
    var is25 = checkPercent(that.video.currentTime, that.videoTime, that.percent25);
    var is50 = checkPercent(that.video.currentTime, that.videoTime, that.percent50);
    var is75 = checkPercent(that.video.currentTime, that.videoTime, that.percent75);

    if (is25) {
      that.VPAID.call('AdVideoFirstQuartile');
    }

    if (is50) {
      that.VPAID.call('AdVideoMidpoint');
    }

    if (is75) {
      that.VPAID.call('AdVideoThirdQuartile');
    }

    if (Math.round(that.video.currentTime) == Math.round(that.video.duration)) {
      that.VPAID.call('AdVideoComplete');
      that.VPAID.call('AdStopped');
    }
  }

  function checkPercent(time, duration, percent) {
    if (percent.track || Math.ceil(100 * time / duration) < percent.value) {
      return false;
    }
    percent.track = true;
    return true;
  }
}  

  
LavaVpaidPlayer.prototype.play = function() {
  this.video.play();
};

LavaVpaidPlayer.prototype.pause = function() {
  this.video.pause();
  this.VPAID.call('AdPaused');
};

LavaVpaidPlayer.prototype.resume = function() {
  this.video.play();
};

LavaVpaidPlayer.prototype.stop = function() {
  this.video.pause();
};

LavaVpaidPlayer.prototype.muted = function() {
  this.video.muted = true;
  this.VPAID.call('AdVolumeChange');
};


LavaVpaidPlayer.prototype.unmuted = function() {
  this.video.muted = false;
  this.VPAID.call('AdVolumeChange');
};


window.LAVA = window.LAVA ? window.LAVA : {};
window.LAVA.VPaidPlayer = LavaVpaidPlayer;

})();
