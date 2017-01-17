var LavaVpaid = function() {

}

LavaVpaid.prototype.configure = function(options) {
	console.log('configure');
}

LavaVpaid.prototype.call = function(eventName, ...params) {
	window.postMessage('{"eventName" : "' + eventName+ '", "params": "' + params.toString() + '"}', "http://cuongtran3001.github.io/");
	//window.postMessage('{"eventName" : "' + eventName+ '", "params": "' + params.toString() + '"}', "http://libs.lavanetwork.net");

}

window.LAVA = {};
window.LAVA.VPAID = new LavaVpaid();
