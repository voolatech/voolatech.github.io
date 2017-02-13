var VPAID = window.LAVA.VPAID;

var time = 15;

var skip = document.getElementById('skip');
skip.style.display = 'none';
skip.addEventListener('click', onClickHandler);

var img = document.getElementById('img');
img.addEventListener('click', onClickAdHandler);


var guide = document.getElementById('guide');
var ti = setInterval(function() {
  guide.innerHTML = 'This ad will close automatically in ' + time + ' seconds'

  if (time == 10) {
    skip.style.display = 'block';
  }

  if (time == 0) {
    clearInterval(ti);
    VPAID.call('AdStopped');
  }

  time --;
  
}, 1000);

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
