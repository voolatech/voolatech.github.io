//<script type="text/javascript" src="../jsLavaVpaid.js"></script>
 
var VPAID = window.LAVA.VPAID;

var eventSelect = document.getElementById('eventSelect');
eventSelect.addEventListener('change', eventSelected_);

var triggerEvent = document.getElementById('triggerEvent');
triggerEvent.addEventListener('click', triggerEvent_);

function eventSelected_(evt) {
	var clickThruParams = document.getElementById('AdClickThruOptions');
	var adErrorParams = document.getElementById('AdErrorOptions');
	var adLogParams = document.getElementById('AdLogOptions');
	var adInteractionParams = document.getElementById('AdInteractionOptions');
	  
	clickThruParams.style.display = 'none';
  	adErrorParams.style.display = 'none';
  	adLogParams.style.display = 'none';
  	adInteractionParams.style.display = 'none';

  	var value = eventSelect.value;
  	if (value == 'AdClickThru') {
    	clickThruParams.style.display = 'inline';
  	} else if (value == 'AdError') {
    	adErrorParams.style.display = 'inline';
  	} else if (value == 'AdLog') {
    	adLogParams.style.display = 'inline';
  	} else if (value == 'AdInteraction') {
    	adInteractionParams.style.display = 'inline';
  	}
}

function triggerEvent_(evt) {
	var value = eventSelect.value;
  	if (value == 'AdClickThru') {
    	adClickThruHandler_();
  	} else if (value == 'AdError') {
   	 	adErrorHandler_();
  	} else if (value == 'AdLog') {
    	adLogHandler_();
  	} else if (value == 'AdInteraction') {
    	adInteractionHandler_();
  	} else {
    	VPAID.call(value);
  	}
}

function adClickThruHandler_() {
  var clickThruUrl = document.getElementById('clickThruUrl').value;
  var clickThruId = document.getElementById('clickThruId').value;
  var clickThruPlayerHandles = document.getElementById('clickThruPlayerHandels').value;
  
  VPAID.call("AdClickThru", clickThruUrl, clickThruId, clickThruPlayerHandles);
};

function adErrorHandler_() {
 	var adError = document.getElementById('adErrorMsg').value;
 	VPAID.call('AdError', adError);
};


function adLogHandler_() {
  	var adLogMsg = document.getElementById('adLogMsg').value;
  	VPAID.call('AdLog', adLogMsg);
};


function adInteractionHandler_() {
  var adInteraction = document.getElementById('adInteractionId').value;
  VPAID.call('AdInteraction', adInteraction);
};


//start VPAID here
VPAID.configure();
VPAID.call("AdStarted");
