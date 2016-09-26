var Voola = {};

Voola.VideoInPage = function(objVAST, objImage) {

    var state = 0;
    var isRunSkip = false;

    window.addEventListener('load', function(evt) {
        init();
    });

    function init() {
        
        //tracking(objVAST.impression);

        var skipTime = 5;
        var skipInteral;

        var container = document.createElement('div');
        container.className = 'voola-vip-container';
        container.style.position = 'fixed';
        container.style.width = '320px';
        container.style.height = '50px';
        //container.style.background = 'black';
        //container.style.border = '1px solid black';
        container.style.left = (window.innerWidth - 320) / 2 + 'px';
        container.style.top = (window.innerHeight - 250) + 'px';
        container.style.zIndex = 1000;

		document.body.appendChild(container);
        
        var wrapper = document.createElement('div');
        wrapper.className = '';
        wrapper.style.width = '320px';
        wrapper.style.height = '200px';
        wrapper.style.position = 'absolute';
        //wrapper.style.background = 'black';
        wrapper.style.top = '250px';
		container.appendChild(wrapper);

        var top = document.createElement('div');
        top.className = '';
        top.style.width = '320px';
        top.style.height = '30px';
        top.style.position = 'relative';
        top.style.background = 'black';
        wrapper.appendChild(top);

        var ex = document.createElement('img');
        ex.src = objImage.close;
        ex.style.position = 'absolute';
        ex.style.right = '1px';
        ex.style.top = '1px';
        ex.style.cursor = 'pointer';
        top.appendChild(ex);

        var video = document.createElement('video');
        video.className = 'voola-vip-video';
        video.setAttribute('src', objVAST.mediaFile);
        video.setAttribute('width', '320px');
        video.setAttribute('height', '170px');
        video.setAttribute('type', 'video/mp4');
        video.setAttribute('muted', true);
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('preload', 'auto');
        video.style.cursor = 'pointer';
        wrapper.appendChild(video);


        var bottom =  document.createElement('div');
        bottom.className = '';
        bottom.style.width = '320px';
        bottom.style.height = '50px';
        bottom.style.position = 'absolute';
        bottom.style.top = '250px';
        bottom.style.background = 'black';
        container.appendChild(bottom);

        

        /*
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
        */

        video.addEventListener('click', function(evt) {
            collapseToSmall();

            //tracking(objVAST.pause);

            var win = window.open(objVAST.clickThrough, '_blank');
            win.focus();
        });

        /*
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
        */

        var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints;  
        var targetTouch = null;

        window.addEventListener('touchstart', onTouchStartHandler);
        function onTouchStartHandler(evt) {
            if (state == 0) {
                video.load();
            }

            else {
                window.removeEventListener('touchstart', onTouchStartHandler);
                targetTouch = evt.target;
            }
        };

        window.addEventListener('touchend', onTouchEndHandler);
        function onTouchEndHandler(evt) {

            if (state == 0) {
                expandToSmall();
            } else {
                

                if (evt.target == bottom) {
                    bottom.addEventListener('click', onClickBanerHandler);   
                } else {
                    window.removeEventListener('touchend', onTouchEndHandler);
                    expandToLarge();
                }                
            }    
            
        };

        function onClickBanerHandler(evt) {
           
            if (state == 1) {
                collapseToSmall();
                //tracking(objVAST.pause);
            }
                    
            var win = window.open(objVAST.clickThrough, '_blank');
            win.focus();
        }

        ex.addEventListener('click', onClickEXHandler);

        function onClickEXHandler(evt) {
            collapseToSmall();
        }
        
        /*
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
        */

        function onVideoEndedHandler(evt) {
            //tracking(objVAST.complete);

            collapseToSmall();
        }

        function collapseToSmall() {
            state = 0;

            var marginTop = 0;
            var interval = setInterval(function(evt) {
                marginTop += 10;
                marginTop = marginTop >= 250 ? 250 : marginTop;
                wrapper.style.top = marginTop + 'px';

                if (marginTop >= 250) {
                    clearInterval(interval);      
                    //ex.addEventListener('click', onClickEXHandler);              
                }
            }, 17); 

            video.removeEventListener('ended', onVideoEndedHandler);
        }

        /*
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
        */
        function expandToSmall() {
            state = 1;

            var marginTop = 250;
            var interval = setInterval(function(evt) {
                marginTop -= 2;
                marginTop = marginTop <= 200 ? 200 : marginTop;
                bottom.style.top = marginTop + 'px';

                if (marginTop <= 200) {
                    clearInterval(interval);      
                    //ex.addEventListener('click', onClickEXHandler); 

                    //bottom.addEventListener('click', onClickBanerHandler);             
                }
            }, 17); 

            //tracking(objVAST.resume);
            // /video.play();



        
        }

        function expandToLarge() {
            state = 1;

            var marginTop = 250;
            var interval = setInterval(function(evt) {
                marginTop -= 10;
                marginTop = marginTop <= 0 ? 0 : marginTop;
                wrapper.style.top = marginTop + 'px';

                if (marginTop <= 0) {
                    clearInterval(interval);      
                    //ex.addEventListener('click', onClickEXHandler);              
                }
            }, 17); 

            video.addEventListener('ended', onVideoEndedHandler);
            //tracking(objVAST.resume);
            video.play();
        }

        /*
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
        */
    };
};
