var Voola = {};

Voola.VideoInPage = function(bg, videoURL, clicktag, arrow, close, mute, unmute) {

    var state = 0;

    window.addEventListener('load', function(evt) {
        init();
    });

    function init() {
        /*
    	var body = document.body,
            html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight, 
                               html.clientHeight, html.scrollHeight, html.offsetHeight );

        */

        var container = document.createElement('div');
        container.className = 'voola-vip-container';
        container.style.position = 'fixed';
        container.style.width = '160px';
        container.style.height = '90px';
        //container.style.background = 'black';
        //container.style.border = '1px solid black';
        container.style.left = 0;
        container.style.top = '300px';
        container.style.zIndex = 1000;

		document.body.appendChild(container);

        var wrapper = document.createElement('div');
        wrapper.className = 'voola-vip-wrapper';
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.position = 'relative';
        wrapper.style.marginLeft = '-160px';
		container.appendChild(wrapper);

		var bg = document.createElement('div');
        bg.className = 'voola-vip-bg';
		wrapper.appendChild(bg);

        var video = document.createElement('video');
        video.className = 'voola-vip-video';
        video.setAttribute('src', videoURL);
        video.setAttribute('width', '100%');
        video.setAttribute('height', '100%');
        //video.setAttribute('autoPlay', true);
        wrapper.appendChild(video);

        var ex = document.createElement('img');
        ex.src = arrow;
        ex.style.position = 'absolute';
        ex.style.right = '-30px';
        ex.style.top = '0px';
        wrapper.appendChild(ex);

        /*
        var mu = document.createElement('img');
        mu.src = 'images/mute.png';
        mu.style.position = 'absolute';
        mu.style.left = '160px';
        mu.style.top = '50px';
        wrapper.appendChild(mu);
        */

        video.addEventListener('click', function(evt) {
            if (state == 1) {
                expandToLarge();
            }

            else if (state == 2) {
                remove();

                var win = window.open(clicktag, '_blank');
                win.focus();
            }
        });

        ex.addEventListener('click', function(evt) {
            if (state == 0) {
                expandToMedium();
            }

            else {
                remove();
            }
        });

        window.addEventListener('scroll', onScrollHandler);
        
        function onScrollHandler(evt) {
            if (document.body.scrollTop > 500) {
                expandToMedium();
            }
        }

        function expandToMedium() {
            window.removeEventListener('scroll', onScrollHandler);
            state = 1;

            var marginLeft = -160;
            var interval = setInterval(function(evt) {
                marginLeft += 5;
                marginLeft = marginLeft >= 0 ? 0 : marginLeft;
                wrapper.style.marginLeft = marginLeft + 'px';

                if (marginLeft >= 0) {
                    clearInterval(interval);
                    video.play();
                    ex.src = close;
                }
            }, 17); 
        }

        function expandToLarge() {
            state = 2;

            var ratio = 1;
            var width = 160;
            var height = 90;

            var interval = setInterval(function(evt) {
                ratio += 0.1;
                
                container.style.width = width * ratio + 'px';
                container.style.height = height * ratio + 'px';

                if (ratio >= 2) {
                    clearInterval(interval);
                }
            }, 17);
        }

        function remove() {
            video.pause();
            container.parentNode.removeChild(container);
        }

        /*
        <!--div class="mini-pop-container">
            <div id="mini-pop-wrapper" style="margin-left: -312px;">
                <div class="mini-pop-bg"></div>
                <video id="mini-pop-vid" src="http://cdn-video.adspruce.com/website/video-in-page-diesel.mp4" style="display: none;"></video>
                <div id="mini-pop-tab" style="background-image: url(&quot;http://32808eb254d4d3a338bf-2b96655e783eed0674def440d206be58.r48.cf3.rackcdn.com/new-assets/collapse.png&quot;);"></div>
                <div id="mini-pop-mute" style="display: none; background-image: url(&quot;http://32808eb254d4d3a338bf-2b96655e783eed0674def440d206be58.r48.cf3.rackcdn.com/new-assets/mute.png&quot;);"></div>
            </div>
        </div-->
        */
    };
};
