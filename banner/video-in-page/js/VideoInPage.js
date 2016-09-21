/*! npm.im/iphone-inline-video */
//var makeVideoPlayableInline=function(){"use strict";function e(e){function r(t){n=requestAnimationFrame(r),e(t-(i||t)),i=t}var n,i;this.start=function(){n||r(0)},this.stop=function(){cancelAnimationFrame(n),n=null,i=0}}function r(e,r,n,i){function t(r){Boolean(e[n])===Boolean(i)&&r.stopImmediatePropagation(),delete e[n]}return e.addEventListener(r,t,!1),t}function n(e,r,n,i){function t(){return n[r]}function d(e){n[r]=e}i&&d(e[r]),Object.defineProperty(e,r,{get:t,set:d})}function i(e,r,n){n.addEventListener(r,function(){return e.dispatchEvent(new Event(r))})}function t(e,r){Promise.resolve().then(function(){e.dispatchEvent(new Event(r))})}function d(e){var r=new Audio;return i(e,"play",r),i(e,"playing",r),i(e,"pause",r),r.crossOrigin=e.crossOrigin,r.src=e.src||e.currentSrc||"data:",r}function a(e,r,n){(f||0)+200<Date.now()&&(e[h]=!0,f=Date.now()),n||(e.currentTime=r),T[++w%3]=100*r|0}function o(e){return e.driver.currentTime>=e.video.duration}function u(e){var r=this;r.video.readyState>=r.video.HAVE_FUTURE_DATA?(r.hasAudio||(r.driver.currentTime=r.video.currentTime+e*r.video.playbackRate/1e3,r.video.loop&&o(r)&&(r.driver.currentTime=0)),a(r.video,r.driver.currentTime)):r.video.networkState!==r.video.NETWORK_IDLE||r.video.buffered.length||r.video.load(),r.video.ended&&(delete r.video[h],r.video.pause(!0))}function s(){var e=this,r=e[g];return e.webkitDisplayingFullscreen?void e[b]():("data:"!==r.driver.src&&r.driver.src!==e.src&&(a(e,0,!0),r.driver.src=e.src),void(e.paused&&(r.paused=!1,e.buffered.length||e.load(),r.driver.play(),r.updater.start(),r.hasAudio||(t(e,"play"),r.video.readyState>=r.video.HAVE_ENOUGH_DATA&&t(e,"playing")))))}function c(e){var r=this,n=r[g];n.driver.pause(),n.updater.stop(),r.webkitDisplayingFullscreen&&r[E](),n.paused&&!e||(n.paused=!0,n.hasAudio||t(r,"pause"),r.ended&&(r[h]=!0,t(r,"ended")))}function v(r,n){var i=r[g]={};i.paused=!0,i.hasAudio=n,i.video=r,i.updater=new e(u.bind(i)),n?i.driver=d(r):(r.addEventListener("canplay",function(){r.paused||t(r,"playing")}),i.driver={src:r.src||r.currentSrc||"data:",muted:!0,paused:!0,pause:function(){i.driver.paused=!0},play:function(){i.driver.paused=!1,o(i)&&a(r,0)},get ended(){return o(i)}}),r.addEventListener("emptied",function(){var e=!i.driver.src||"data:"===i.driver.src;i.driver.src&&i.driver.src!==r.src&&(a(r,0,!0),i.driver.src=r.src,e?i.driver.play():i.updater.stop())},!1),r.addEventListener("webkitbeginfullscreen",function(){r.paused?n&&!i.driver.buffered.length&&i.driver.load():(r.pause(),r[b]())}),n&&(r.addEventListener("webkitendfullscreen",function(){i.driver.currentTime=r.currentTime}),r.addEventListener("seeking",function(){T.indexOf(100*r.currentTime|0)<0&&(i.driver.currentTime=r.currentTime)}))}function p(e){var i=e[g];e[b]=e.play,e[E]=e.pause,e.play=s,e.pause=c,n(e,"paused",i.driver),n(e,"muted",i.driver,!0),n(e,"playbackRate",i.driver,!0),n(e,"ended",i.driver),n(e,"loop",i.driver,!0),r(e,"seeking"),r(e,"seeked"),r(e,"timeupdate",h,!1),r(e,"ended",h,!1)}function l(e,r,n){void 0===r&&(r=!0),void 0===n&&(n=!0),n&&!y||e[g]||(v(e,r),p(e),e.classList.add("IIV"),!r&&e.autoplay&&e.play(),"MacIntel"!==navigator.platform&&"Windows"!==navigator.platform||console.warn("iphone-inline-video is not guaranteed to work in emulated environments"))}var f,m="undefined"==typeof Symbol?function(e){return"@"+(e||"@")+Math.random()}:Symbol,y=/iPhone|iPod/i.test(navigator.userAgent)&&void 0===document.head.style.grid,g=m(),h=m(),b=m("nativeplay"),E=m("nativepause"),T=[],w=0;return l.isWhitelisted=y,l}();

var Voola = {};

Voola.VideoInPage = function(bg, videoURL, clicktag, arrow, close, mute, unmute) {

    var state = 0;
    var isRunSkip = false;

    window.addEventListener('load', function(evt) {
        init();
    });

    function init() {
        
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
        video.setAttribute('src', videoURL);
        video.setAttribute('width', '100%');
        video.setAttribute('height', '100%');
        video.setAttribute('type', 'video/mp4');
        video.setAttribute('muted', true);
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('preload', 'auto');
        video.style.cursor = 'pointer';
        wrapper.appendChild(video);

        var ex = document.createElement('img');
        ex.src = arrow;
        ex.style.position = 'absolute';
        ex.style.right = '-30px';
        ex.style.top = '0px';
        ex.style.cursor = 'pointer';
        wrapper.appendChild(ex);

        var mu = document.createElement('img');
        mu.src = mute;
        mu.style.position = 'absolute';
        mu.style.right = '2px';
        mu.style.bottom = '2px';
        mu.style.cursor = 'pointer';
        wrapper.appendChild(mu);

        var skip = document.createElement('div');
        skip.innerHTML = 'Skip Ads After 5s';
        //skip.style.display = 'none';
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

        video.addEventListener('canplay', function(evt) {
            //window.alert(evt.type);
            skip.innerHTML = evt.type;
            video.play();
            
        });

        video.addEventListener('abort', function(evt) {
            skip.innerHTML = evt.type;
        });

        video.addEventListener('error', function(evt) {
            skip.innerHTML = evt.type;
        });

        video.addEventListener('click', function(evt) {
            if (state == 1) {
                expandToLarge();
            }

            else if (state == 2) {
                collapse();

                var win = window.open(clicktag, '_blank');
                win.focus();
            }
        });

        ex.addEventListener('click', function(evt) {
            if (state == 0) {
                expandToMedium();
            }

            else if (state == 1) {
                expandToLarge();
            }

            else {
                collapseToMedium();
            }
        });

        mu.addEventListener('click', function(evt) {
            video.muted = !video.muted;
            mu.src = video.muted ?  mute : unmute;
        });


        window.addEventListener('scroll', onScrollHandler);
        
        function onScrollHandler(evt) {
            if (state == 0) {
                video.load();
                expandToMedium();
            } 
            
            else if (state == 1) {
                window.removeEventListener('scroll', onScrollHandler);
                video.play();
            } 
        }

        function onVideoEndedHandler(evt) {
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
                    ex.src = arrow;
                }

            }, 17);
        }

        function expandToMedium() {
            //window.removeEventListener('scroll', onScrollHandler);
            state = 1;

            var marginLeft = -160;
            var interval = setInterval(function(evt) {
                marginLeft += 5;
                marginLeft = marginLeft >= 0 ? 0 : marginLeft;
                wrapper.style.marginLeft = marginLeft + 'px';

                if (marginLeft >= 0) {
                    clearInterval(interval);                    
                }
            }, 17); 

            video.addEventListener('ended', onVideoEndedHandler);
            //makeVideoPlayableInline(video);
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
                    ex.src = arrow;
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
                    ex.src = close;
                    
                }
            }, 17);

            video.addEventListener('ended', onVideoEndedHandler);
            //makeVideoPlayableInline(video);
            video.play();

            if (!isRunSkip) {
                isRunSkip = true;
                runSkip();
            }
        }

        function runSkip() {
            return;

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

        function remove() {
            //video.pause();
            //container.parentNode.removeChild(container);
        }
    };
};
