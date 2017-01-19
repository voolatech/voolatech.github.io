var LavaVpaid = function() {

}

LavaVpaid.prototype.configure = function(options) {
	console.log('configure');
}

LavaVpaid.prototype.call = function(eventName, ...params) {  
  window.parent.postMessage('{"eventName" : "' + eventName+ '", "params": "' + params.toString() + '"}', "*");
}

window.LAVA = {};
window.LAVA.VPAID = new LavaVpaid();
