/*
var script = document.createElement('script');
document.body.appendChild(script);

script.onload = function(script) {

	var vip = Voola.VideoInPage('images/banner.jpg', 
								'http://www.w3schools.com/html/mov_bbb.mp4', 
								'http://www.google.com', 
								'images/expand.png',
								'images/close.png',
								'images/mute.png',
								'images/unmute.png');
}

script.src = "./js/VideoInPage.js";

*/

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	parseVAST(this);
    }
};

xhttp.open("GET", "xml/fc.xml", true);
xhttp.send();

function parseVAST(xml) {
    var xmlDoc = xml.responseXML;
    var InLine = xmlDoc.getElementsByTagName("InLine")[0];

    var Impression = InLine.getElementsByTagName("Impression")[0].childNodes[0].nodeValue;

    var VideoClicks = InLine.getElementsByTagName("VideoClicks")[0];
    var ClickThrough = VideoClicks.getElementsByTagName("ClickThrough")[0].childNodes[0].nodeValue;

    var MediaFiles = InLine.getElementsByTagName("MediaFiles")[0];
    var MediaFile = MediaFiles.getElementsByTagName("MediaFile")[0].childNodes[0].nodeValue;

    var TrackingEvents = InLine.getElementsByTagName("TrackingEvents")[0];
    var Tracking = TrackingEvents.getElementsByTagName("Tracking");

    function getElementByAttribute(list, attr) {
    	for (var i = 0; i < list.length; i ++) {
    		if (list[i].getAttribute('event') == attr) {
    			return list[i].childNodes[0].nodeValue;
    		}
    	} 
    	return null;
    }

    console.log(getElementByAttribute(Tracking, 'complete'));
}
