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
