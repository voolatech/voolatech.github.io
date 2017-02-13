//<script type="text/javascript" src="../jsLavaVpaid.js"></script>
 
var VPAID = window.LAVA.VPAID;

var videoTime = 15;
var autoTime = 15;

var percent25 = {track: false, value: 25};
var percent50 = {track: false, value: 50};
var percent75 = {track: false, value: 75};


var skip = document.getElementById('skip');
skip.style.display = 'none';
skip.addEventListener('click', onClickHandler);

var video = document.getElementById("videoBanner");
video.onloadedmetadata = function(evt) {
    autoTime = videoTime = Math.ceil(video.duration);    
    startAuto();
};

video.ontimeupdate = function(evt) {
  var is25 = checkPercent(video.currentTime, videoTime, percent25);
  var is50 = checkPercent(video.currentTime, videoTime, percent50);
  var is75 = checkPercent(video.currentTime, videoTime, percent75);

  if (is25) {
    VPAID.call('AdVideoFirstQuartile');
  }

  if (is50) {
    VPAID.call('AdVideoMidpoint');
  }

  if (is75) {
    VPAID.call('AdVideoThirdQuartile');
  }
};

video.onclick = function(evt) {

  if (video.paused) {
    video.play();
    VPAID.call('AdPlaying');
    startAuto();

  } else {
    video.pause();
    VPAID.call('AdPaused');
    stopAuto();
    
  }

  
  
}

function checkPercent(time, duration, percent) {
  if (percent.track || Math.ceil(100 * time / duration) < percent.value) {
    return false;
  }
  percent.track = true;
  return true;
}

var guide = document.getElementById('guide');
var ti;

function startAuto() {
  ti = setInterval(function() {
    guide.innerHTML = 'This ad will close automatically in ' + autoTime + ' seconds'

    if (autoTime == (videoTime - 5)) {
      skip.style.display = 'block';
    }

    if (autoTime == 0) {
      clearInterval(ti);
      VPAID.call('AdVideoComplete');
      VPAID.call('AdStopped');
    }

    autoTime --;
  
  }, 1000);
}

function stopAuto() {
  clearInterval(ti);
}


function onClickHandler(evt) {
  clearInterval(ti);
  VPAID.call('AdSkipped');
  VPAID.call('AdStopped');
}

function onClickAdHandler(evt) {
  clearInterval(ti);
  VPAID.call('AdClickThru', 'http://www.google.com');
  VPAID.call('AdStopped');
  
}

//start VPAID here
VPAID.configure();
VPAID.call("AdStarted");

VPAID.call("AdImpression");


