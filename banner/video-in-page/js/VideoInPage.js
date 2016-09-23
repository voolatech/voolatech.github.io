var Voola = {};

Voola.VideoInPage = function(objVAST, objImage) {

    var state = 0;
    var isRunSkip = false;

    window.addEventListener('load', function(evt) {
        init();
    });

    function init() {
        
        tracking(objVAST.impression);

        var skipTime = 5;
        var skipInteral;

        var container = document.createElement('div');
        container.className = 'voola-vip-container';
        container.style.position = 'fixed';
        container.style.width = '160px';
        container.style.height = '90px';
        //container.style.background = 'black';
        //container.style.border = '1px solid black';
        container.style.left = 0;
        container.style.top = (window.innerHeight - 180)/2 + 'px';
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
        video.setAttribute('src', objVAST.mediaFile);
        video.setAttribute('width', '100%');
        video.setAttribute('height', '100%');
        video.setAttribute('type', 'video/mp4');
        video.setAttribute('muted', true);
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('preload', 'auto');
        video.style.cursor = 'pointer';
        wrapper.appendChild(video);

        var ex = document.createElement('img');
        ex.src = objImage.expand;
        ex.style.position = 'absolute';
        ex.style.right = '-30px';
        ex.style.top = '0px';
        ex.style.cursor = 'pointer';
        wrapper.appendChild(ex);

        var mu = document.createElement('img');
        mu.src = objImage.mute;
        mu.style.position = 'absolute';
        mu.style.right = '2px';
        mu.style.bottom = '2px';
        mu.style.cursor = 'pointer';
        wrapper.appendChild(mu);

        var skip = document.createElement('div');
        skip.innerHTML = 'Skip Ads After 5s';
        skip.style.display = 'none';
        skip.style.fontSize = '12px';
        skip.style.color = 'white';
        skip.style.width = '110px';
        skip.style.height = '20px';
        skip.style.background = 'black';
        skip.style.position = 'absolute';
        skip.style.left = '5px';
        skip.style.bottom = '5px';
        skip.style.textAlign = 'center';
        skip.style.cursor = 'pointer';
        wrapper.appendChild(skip);

        var trackingPercent =  false
        
        video.addEventListener('timeupdate', function(evt) {
            var np = Math.floor(100 * (video.currentTime / video.duration));

            if (np >= 22 && np <= 28 && trackingPercent == false) {
                trackingPercent = true;
                tracking(objVAST.firstQuartile);
            } else {
                trackingPercent = false;
            }

            if (np >= 47 && np <= 53 && trackingPercent == false) {
                trackingPercent = true;
                tracking(objVAST.midpoint);
            } else {
                trackingPercent = false;
            }

            if (np >= 72 && np <= 78 && trackingPercent == false) {
                trackingPercent = true;
                tracking(objVAST.thirdQuartile);
            } else {
                trackingPercent = false;
            }
        });

        video.addEventListener('click', function(evt) {
            if (state == 1) {
                expandToLarge();
            }

            else if (state == 2) {
                collapse();

                tracking(objVAST.pause);

                var win = window.open(objVAST.clickThrough, '_blank');
                win.focus();
            }
        });

        function onClickEXHandler(evt) {
            if (state == 0) {
                expandToMedium();
            }

            else if (state == 1) {
                expandToLarge();
            }

            else {
                collapseToMedium();
            }
        }

        mu.addEventListener('click', function(evt) {
            video.muted = !video.muted;
            mu.src = video.muted ?  objImage.mute : objImage.unmute;

            tracking(video.muted ? objVAST.mute : objVAST.unmute);

        });

        var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints;  

        window.addEventListener('touchstart', onTouchStartHandler);
        function onTouchStartHandler(evt) {
            window.removeEventListener('touchstart', onTouchStartHandler);
            video.load();
        };

        window.addEventListener('touchend', onTouchEndHandler);
        function onTouchEndHandler(evt) {
            window.removeEventListener('touchend', onTouchEndHandler);
           
            if (evt.target == ex) {
                ex.addEventListener('click', onClickEXHandler);
            } else {
                expandToMedium();
            }    
            
        };
        
        function onScrollHandler(evt) {
            if (state == 0) {
                expandToMedium();
            } 
            
            else if (state == 1) {
                window.removeEventListener('scroll', onScrollHandler);
                tracking(objVAST.resume);
                video.play();
            } 
        }

        function onVideoEndedHandler(evt) {
            tracking(objVAST.complete);

            collapse();
        }

        function collapse() {
            clearInterval(skipInteral);
            skip.style.display = 'none';
            skip.removeEventListener('click', onSkipAdsHandler);
            video.removeEventListener('ended', onVideoEndedHandler);

            var preState = state;

            state = 0;
            video.pause();

            var ratio = 10 * preState;
            var width = 160 * preState;
            var height = 90 * preState;

            var interval = setInterval(function(evt) {
                ratio -= 1;
                    
                container.style.width = width * ratio/(10 * preState) + 'px';
                container.style.height = height * ratio/(10 * preState) + 'px';

                if (ratio <= 0) {
                    clearInterval(interval);
                    wrapper.style.marginLeft = '-160px';
                    container.style.width = '160px';
                    container.style.height = '90px';
                    ex.src = objImage.expand;
                }

            }, 17);
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
                    ex.addEventListener('click', onClickEXHandler);              
                }
            }, 17); 

            video.addEventListener('ended', onVideoEndedHandler);
            tracking(objVAST.resume);
            video.play();
        }

        function collapseToMedium() {
            state = 1;

            var ratio = 20;
            var width = 320;
            var height = 180;

            var interval = setInterval(function(evt) {
                ratio -= 1;
                    
                container.style.width = width * ratio/20 + 'px';
                container.style.height = height * ratio/20 + 'px';

                if (ratio <= 10) {
                    clearInterval(interval);
                    ex.src = objImage.expand;
                }

            }, 17);
        }

        function expandToLarge() {
            state = 2;
            video.currentTime = 0;
            video.pause();

            var ratio = 1;
            var width = 160;
            var height = 90;

            var interval = setInterval(function(evt) {
                ratio += 0.1;
                
                container.style.width = width * ratio + 'px';
                container.style.height = height * ratio + 'px';

                if (ratio >= 2) {
                    clearInterval(interval);
                    ex.src = objImage.close;
                }
            }, 17);

            video.addEventListener('ended', onVideoEndedHandler);
            //tracking(objVAST.resume);
            video.play();

            if (!isRunSkip) {
                isRunSkip = true;
                runSkip();
            }
        }

        function runSkip() {
            skip.style.display = 'block';
            
            skipTime = 5;
            skip.innerHTML = 'Skip Ads After ' + skipTime + 's';

            skipInteral = setInterval(function() {
                skipTime --;
                skip.innerHTML = 'Skip Ads After ' + skipTime + 's';

                if (skipTime == 0) {
                    clearInterval(skipInteral);
                    skip.innerHTML = 'Skip Ads';
                    skip.addEventListener('click', onSkipAdsHandler);
                }
            }, 1000);

        };

        function onSkipAdsHandler(evt) {
            collapse();
        }

        function tracking(url) {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, true);
            xhttp.send();
        }
    };
};
