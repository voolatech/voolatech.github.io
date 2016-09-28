function loadVIP(objVAST, objImage)  {

    var script = document.createElement('script');
    document.body.appendChild(script);

    script.onload = function(script) {
	   new Voola.VideoInPage(objVAST, objImage);
    }
    script.src = "./js/VideoInPage.js";
}

function loadVAST(url) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
    	   parseVAST(this);
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();

    function parseVAST(xml) {
        var xmlDoc = xml.responseXML;
        var InLine = xmlDoc.getElementsByTagName("InLine")[0];

        var Impression = getCDataByTagName(InLine, "Impression");

        var VideoClicks = InLine.getElementsByTagName("VideoClicks")[0];
        var ClickThrough = getCDataByTagName(VideoClicks, "ClickThrough");

        var MediaFiles = InLine.getElementsByTagName("MediaFiles")[0];
        var MediaFile = getCDataByTagName(MediaFiles, "MediaFile");

        var TrackingEvents = InLine.getElementsByTagName("TrackingEvents")[0];

        var objVAST = {
            impression: Impression,
            clickThrough: ClickThrough,
            mediaFile: MediaFile,
            start: getCDataValueByAttribute(TrackingEvents, 'Tracking', 'start'),
            firstQuartile: getCDataValueByAttribute(TrackingEvents, 'Tracking', 'firstQuartile'),
            midpoint: getCDataValueByAttribute(TrackingEvents, 'Tracking', 'midpoint'),
            thirdQuartile: getCDataValueByAttribute(TrackingEvents, 'Tracking', 'thirdQuartile'),
            complete: getCDataValueByAttribute(TrackingEvents, 'Tracking', 'complete'),
            mute: getCDataValueByAttribute(TrackingEvents, 'Tracking', 'mute'),
            unmute: getCDataValueByAttribute(TrackingEvents, 'Tracking', 'unmute'),
            resume: getCDataValueByAttribute(TrackingEvents, 'Tracking', 'resume'),
            pause: getCDataValueByAttribute(TrackingEvents, 'Tracking', 'pause')
        };

        var objImage = {
            banner: 'images/banner.png', 
            title: 'images/title.png',
            close: 'images/close.png',
            mute: 'images/mute.png',
            unmute: 'images/unmute.png'
        }

        loadVIP(objVAST, objImage);
    }

    function getCDataValueByAttribute(element, tagName, attr) {
        var elements = element.getElementsByTagName(tagName)
        for (var i = 0; i < elements.length; i ++) {
            if (elements[i].getAttribute('event') == attr) {
                return getCDataValue(elements[i]);
            }
        } 
        return null;
    }

    function getCDataByTagName(element, tagName) {
        var child = element.getElementsByTagName(tagName)[0];
        return getCDataValue(child);
    }

    function getCDataValue(element) {
        var length = element.childNodes.length;
        if (length > 1) {
            return element.childNodes[1].nodeValue.trim();
        } else {
            return element.childNodes[0].nodeValue.trim();
        }
    }
}

//start to load vast xml
loadVAST('xml/fc.xml');
