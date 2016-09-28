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

        var title = document.createElement('img');
        title.src = objImage.title;
        title.style.position = 'absolute';
        title.style.cursor = 'pointer';
        top.appendChild(title);

        var mu = document.createElement('img');
        mu.src = objImage.mute;
        mu.style.position = 'absolute';
        mu.style.cursor = 'pointer';
        mu.style.right = '30px';
        mu.style.top = '1px';
        top.appendChild(mu);

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

        var img = document.createElement('img');
        img.src = objImage.banner;
        img.style.position = 'absolute';
        img.style.cursor = 'pointer';
        bottom.appendChild(img);
        

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
            console.log('04');
            collapseToSmall();

            //tracking(objVAST.pause);

            var win = window.open(objVAST.clickThrough, '_blank');
            win.focus();
        });

        mu.addEventListener('click', function(evt) {
            video.muted = !video.muted;
            mu.src = video.muted ?  objImage.mute : objImage.unmute;

            tracking(video.muted ? objVAST.mute : objVAST.unmute);

        });

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
                    console.log('click');
                    //bottom.addEventListener('click', onClickBanerHandler);   
                } else {
                    console.log('touchend');
                    
                    window.removeEventListener('touchend', onTouchEndHandler);
                    expandToLarge();
                }                
            }    
            
        };

        function onClickBanerHandler(evt) {
           
            if (state == 1) {
                console.log('01');
                collapseToSmall();
                tracking(objVAST.pause);
            }
                    
            var win = window.open(objVAST.clickThrough, '_blank');
            win.focus();
        }

        ex.addEventListener('click', onClickEXHandler);

        function onClickEXHandler(evt) {
            console.log('02');
            collapseToSmall();
        }
      
        function onVideoEndedHandler(evt) {
            tracking(objVAST.complete);

            console.log('03');
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

                    bottom.addEventListener('click', onClickBanerHandler);             
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
            tracking(objVAST.resume);
            video.play();
        }

        function tracking(url) {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, true);
            xhttp.send();
        }
    };
};
