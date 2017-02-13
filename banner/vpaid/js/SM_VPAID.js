var b, d = Object.defineProperty,
    f = Object.create;

function l() {
    this.ab = window.console || {
        log: function() {}
    }
}
l.prototype = f(l.prototype);
b = l.prototype;
b.constructor = l;
d(b, "showDebug", {
    set: function(a) {
        this.debug = a
    }
});
b.trace = function() {
    this.debug && this.ab.log("SZMK", this.className, Array.prototype.slice.call(arguments).join(" "))
};

function m(a, c) {
    this.type = a;
    this.data = c || {}
}
m.i = {
    pb: "AdLoaded",
    oa: "AdStarted",
    vb: "AdStopped",
    K: "AdSkipped",
    S: "AdSkippableStateChange",
    ub: "AdSizeChange",
    ob: "AdLinearChange",
    jb: "AdDurationChange",
    lb: "AdExpandedChange",
    tb: "AdRemainingTimeChange",
    Cb: "AdVolumeChange",
    mb: "AdImpression",
    C: "AdVideoStart",
    zb: "AdVideoFirstQuartile",
    Ab: "AdVideoMidpoint",
    Bb: "AdVideoThirdQuartile",
    yb: "AdVideoComplete",
    ib: "AdClickThru",
    nb: "AdInteraction",
    wb: "AdUserAcceptInvitation",
    xb: "AdUserMinimize",
    pa: "AdUserClose",
    rb: "AdPaused",
    sb: "AdPlaying",
    qb: "AdLog",
    kb: "AdError"
};
m.a = {
    sa: "CreativeLoaded",
    wa: "CreativeSkipped",
    ya: "CreativeUserClose",
    qa: "CreativeClickThru",
    ra: "CreativeInteraction",
    ua: "CreativePause",
    D: "BeforeCreativePlay",
    va: "CreativePlay",
    ta: "CreativeMute",
    xa: "CreativeUnmute",
    Ba: "UserEngaged",
    ic: "VideoData",
    G: "StopAd",
    R: "AdFinished",
    V: "CreativeStopped",
    K: "AdSkipped",
    W: "GetData",
    na: "AdData",
    Fb: "CreativeError",
    za: "SetVideoSrc",
    U: "CloseEnabled",
    Y: "SkipEnabled",
    Aa: "StartCountDown",
    Yb: "ScriptLoaded",
    Nb: "LoadError",
    Xb: "ScriptError",
    hc: "VendorReady",
    hb: "AdBlocked",
    Tb: "Release"
};
m.F = {
    T: "clientNotification",
    X: "sendCreativeMessage",
    Lb: "loadComplete",
    ec: "vpaidEvent",
    ac: "videoEvent",
    eb: "adEvent",
    kc: "winMessage",
    gb: "AdLoaded",
    fb: "AdFinished",
    $b: "UserEngaged",
    fc: "AdSizeChange AdLinearChange
    AdDurationChange AdExpandedChange AdRemainingTimeChange AdVolumeChange AdUserMinimize AdPaused AdPlaying "
    .split(" "),
    gc: "AdLoaded AdStarted AdStopped AdSkipped AdSkippableStateChange AdImpression AdVideoStart
    AdVideoFirstQuartile AdVideoMidpoint AdVideoThirdQuartile AdVideoComplete AdUserAcceptInvitation AdUserClose "
    .split(" "),
    dc: ["AdClickThru",
        "AdInteraction", "AdLog", "AdError"
    ]
};
m.bc = {
    cb: "abort",
    Db: "canplay",
    Eb: "canplaythrough",
    Gb: "durationchange",
    Hb: "emptied",
    Ib: "ended",
    Jb: "loadeddata",
    Kb: "loadedmetadata",
    Mb: "loadstart",
    Ob: "pause",
    Pb: "play",
    Qb: "playing",
    Rb: "progress",
    Sb: "ratechange",
    Ub: "seeked",
    Vb: "stalled",
    Wb: "suspend",
    Zb: "timeupdate",
    cc: "volumechange",
    ERROR: "error",
    jc: "waiting"
};
window.MMEvent = m;

function n() {
    this.message = {
        type: null,
        data: null
    };
    this.Va = '{"type": "JSON_ERROR"}'
}

function p(a, c, e) {
    a.message = new m(c, e);
    try {
        return JSON.stringify(a.message)
    } catch (g) {
        return a.Va
    }
}

function
q(a, c, e, g) {
    this.type = a;
    this.capture = e;
    c.handleEvent ? (this.callback = c.handleEvent, this.context = c) : (this
        .callback = c, this.context = g)
}
q.prototype.dispatchEvent = function(a) {
    var c = this.callback,
        e = this.context;
    "function" == typeof c && c.apply(e || this, [a])
};

function r() {
    this.g = {}
}
b = r.prototype;
b.Sa = function(a, c, e, g) {
    a && (this.g[a] || (this.g[a] = []), this.Ua(a, c, e, g) && this.g[a].push(new q(a, c, e, g)))
};
b.Ya = function(a, c, e, g) {
    if (a = this.g[a])
        for (var h, k = 0; k < a.length; k++)
            if (h = a[k], h.callback == c && h.capture ==
                e && h.context == g) {
                a.splice(k, 1);
                break
            }
};
b.Ua = function(a, c, e, g) {
    for (var h = this.g[a].slice(), k, v = !0; h
        .length;)
        if (k = h.pop(), k.type == a && k.callback == c && k.capture == e && k.context == g) {
            v = !1;
            break
        }
    return v
};
b.dispatchEvent = function(a) {
    var c = this.g[a.type];
    if (c)
        for (var c = c.slice(), e; c.length;) e = c.pop(), e.dispatchEvent(a)
};

function t() {
    l.call(this);
    this.g = new r
}
t.prototype = f(l.prototype);
t.prototype.constructor = t;
b = t.prototype;
b.addEventListener = function(a, c, e, g) {
    this.g || (this.g = new r);
    this
        .g.Sa(a, c, e, g)
};
b.removeEventListener = function(a, c, e, g) {
    this.g.Ya(a, c, e, g)
};
b.dispatchEvent = function(a) {
    this.g.dispatchEvent(a)
};

function u() {
    t.call(this);
    this.className = "WindowMessanger";
    this.sender;
    this
        .H;
    this.message = new n
}
u.prototype = f(t.prototype);
u.prototype.constructor = u;
b = u.prototype;
b.$a = function() {
    this.sender = window.parent
};
b.Za = function() {
    this.H = window;
    this.H.addEventListener("message", this.ja.bind(this), !1)
};
b.ja = function(a) {
    try {
        var c = JSON.parse(a.data);
        if (c.data) {
            var e = c.data.intName;
            if (e) switch (c.type) {
                case "ebclickthrough":
                    this.dispatchEvent(new m(m.a.qa));
                    break;
                case "ebCIUserActionCounter":
                case "ebCIAutomaticEventCounter":
                    this.dispatchEvent(new m(m.a.ra, {
                        name: e
                    }))
            } else this.dispatchEvent(new m(c.type, c.data))
        } else this.dispatchEvent(new m(c.type))
    } catch (g) {}
};
b.postMessage = function(a, c) {
    this.sender && this.sender.postMessage(p(this.message, a, c), "*")
};
b.mc = function() {
    this.H && this.H.removeEventListener("message", this.ja.bind(this), !1)
};

function w(a) {
    console.log("SZMK-BRIDGE
            PreviewPlayer constructor videoURL ",a.I);this.className="
            PreviewPlayer ";this.h=a;this.P()}
            w.prototype.P = function() {
                if (this.h.I) {
                    console.log("SZMK-BRIDGE PreviewPlayer init", this.h.I);
                    console
                        .log("SZMK-BRIDGE PreviewPlayer createVideoContainer");
                    var a = document.createElement("div");
                    a.style.width = "100%";
                    a.style.height = "100%";
                    a.style.backgroundColor = "#000000";
                    a.style.position = "absolute";
                    a.style.top = "0";
                    a.style.zIndex = "-1";
                    a.style.pointerEvents = "auto";
                    a.appendChild(x(this));
                    document.body.appendChild(a)
                }
            };

            function x(a) {
                console.log("SZMK-BRIDGE PreviewPlayer createVideoTag");
                a.video = document.createElement("video");
                a.video.src = a.h.I;
                a.video.poster = a.h.poster;
                a.video.autoplay = !0;
                a.video.setAttribute("autoplay", !0);
                a.video.style.position = "relative";
                a.h.s ? (a.video.style.width = a.h.s.width || "100%", a.video.style.height = a.h.s.height || "100%", a.h.s.top && (a.video.style.top = a.h.s.top), a.h.s.left && (a.video.style.left = a.h.s
                    .left)) : (a.video.style.width = "100%", a.video.style.height = "100%");
                a.video.style.pointerEvents =
                    "auto";
                return a.video
            }

            function y(a, c) {
                t.call(this);
                this.className = "AdVideoWrapper";
                this.trace("constructor", a);
                this.w = this
                    .B = this.N = this.j = this.o = null;
                this.$ = !1;
                a && (a.primaryVideo ? (this.w = (this.w = a.primaryVideo.source instanceof Array ? a.primaryVideo.source[0] : a.primaryVideo.source) || null, this.B = a.primaryVideo.poster ? a.primaryVideo
                    .poster : null, this.N = a.primaryVideo.designModeVideoUrl ? a.primaryVideo.designModeVideoUrl : null, this.$ = a
                    .primaryVideo.delayVideo ? a.primaryVideo.delayVideo : !1, this.o = a.primaryVideo.muted ? a.primaryVideo.muted :
                    null, a.primaryVideo.width && "100%" != a.primaryVideo.width && a.primaryVideo.height && "100%" != a.primaryVideo
                    .height && (this.j = {
                        width: a.primaryVideo.width,
                        height: a.primaryVideo.height,
                        top: a.primaryVideo.top ? a.primaryVideo
                            .top : null,
                        left: a.primaryVideo.left ? a.primaryVideo.left : null
                    })) : (this.w = a.primaryVideoId ? a.primaryVideoId :
                    null, this.N = a.designModeVideoUrl ? a.designModeVideoUrl : null, this.B = a.posterId ? a.posterId : null));
                this
                    .A = VPAID.la;
                this.controls = !1;
                this.M = 0;
                this.da;
                this.ca = this.ha = 0;
                this.defaultMuted = !1;
                this.playbackRate = this.defaultPlaybackRate = 1;
                this.error = {
                    code: 0
                };
                this.loop = !1;
                this.buffered = {};
                this.preload = "auto";
                this.textTracks = {
                    length: 0
                };
                this.O = 0;
                this.v = null;
                this.ba = 0;
                this.Ma = this.Oa = this.Fa = !1;
                this.J = c;
                this.P()
            }
            y.prototype = f(t.prototype); b = y.prototype; b.constructor = y; b.P = function() {
                this.Xa()
            }; b.ka = function(a) {
                this.M = a.data.currentTime;
                this.ba = a.data.duration;
                this.o = a.data.muted || 0 === a.data.volume;
                this.O = a.data.volume;
                if (!this.Ha) {
                    var c = new m("volumechange", {
                        volume: this.volume
                    });
                    this.Ha = !0;
                    this.dispatchEvent(c)
                }
                this.dispatchEvent(a)
            }; b.Xa = function() {
                this.trace("initVideo EB[_adConfigDefined]", EB._adConfigDefined);
                if (EB._adConfigDefined) {
                    for (var a = 0; a < this.A.length; a++) this.J.addEventListener(this.A[a], this.ka.bind(this), !1);
                    this.ma = new
                    EBG.VideoModule(this)
                } else a = {}, a.I = this.N, a.s = this.j, a.poster = this.B, this.video = (new w(a)).video, this
                    .Ta(this.video)
            }; b.Wa = function() {
                var a = {};
                null != this.w && (a.source = this.ia(this.w), this.v = a.source);
                null != this.B && (a.poster = this.ia(this.B));
                null != this.o && (a.muted = this.o);
                this.j && (a.width = this.j.width, a.height = this.j.height, null != this.j.top && (a.top = this.j.top), null != this.j.left && (a.left = this.j.left));
                return a
            }; b.Ta = function(a) {
                try {
                    for (var c in this.A) a.addEventListener(this.A[c], this.bb.bind(this), !1)
                } catch (e) {
                    this.trace("VIDEO
                        ACCESS ERROR ",e)}};
                        b.bb = function(a) {
                            var c = {};
                            c.type = a.type;
                            c.data = {};
                            c.data.duration = this.video.duration;
                            c.data.currentTime = this.video.currentTime;
                            c.data.volume = this.video.volume;
                            c.data.muted = this.video.muted;
                            this.ka(c);
                            this
                                .dispatchEvent(a)
                        }; b.ia = function(a) {
                            var c = a.toString().match(/^[0-9]+$/);
                            return c ? EB.getAssetUrl("ebMovie" +
                                c, c ? c[0] : 0) : EB.getAssetUrl(a)
                        }; b.canPlayType = function(a) {
                            this.trace("canPlayType", a);
                            return !0
                        }; b.load = function() {}; b.play = function() {
                            this.video && this.video.play();
                            this.J.postMessage(m.a.va)
                        }; b.pause = function() {
                            this.trace("pause()");
                            this.video && this.video.pause();
                            this.J.postMessage(m.a.ua)
                        }; b
                        .webkitEnterFullscreen = function() {}; b.webkitExitFullscreen = function() {}; b.appendChild = function() {}; d(b, "currentTime", {
                            get: function() {
                                return this.M
                            },
                            set: function(a) {
                                this.M = a
                            }
                        }); d(b, "mediaGroup", {
                            get: function() {
                                return this.da
                            },
                            set: function(a) {
                                this.da = a
                            }
                        }); d(b, "muted", {
                            get: function() {
                                return this.o
                            },
                            set: function(a) {
                                this.video && (this.video.muted = a);
                                this.o = a;
                                this.J.postMessage(this.o ? m.a.ta : m.a.xa)
                            }
                        }); d(b, "volume", {
                            get: function() {
                                return this.O
                            },
                            set: function(a) {
                                this.O = a
                            }
                        }); d(b, "src", {
                            get: function() {
                                return
                                this.v
                            },
                            set: function(a) {
                                this.trace("set src", this.v);
                                this.v || (this.v = a)
                            }
                        }); d(b, "currentSrc", {
                            get: function() {
                                return this.v
                            }
                        }); d(b, "width", {
                            get: function() {
                                return this.ha
                            },
                            set: function(a) {
                                this.ha = a
                            }
                        }); d(b, "height", {
                            get: function() {
                                return this.ca
                            },
                            set: function(a) {
                                this.ca = a
                            }
                        }); d(b, "poster", {
                            get: function() {
                                return this
                                    .Na
                            },
                            set: function(a) {
                                this.Na = a
                            }
                        }); d(b, "webkitSupportsFullscreen", {
                            get: function() {
                                return !1
                            }
                        }); d(b, "webkitDisplayingFullscreen", {
                            get: function() {
                                return !1
                            }
                        }); d(b, "duration", {
                            get: function() {
                                return this
                                    .ba
                            }
                        }); d(b, "ended", {
                            get: function() {
                                return this.Fa
                            }
                        }); d(b, "delayVideo", {
                            get: function() {
                                return this.$
                            }
                        }); d(b, "networkState", {
                            get: function() {
                                return 0
                            }
                        }); d(b, "paused", {
                            get: function() {
                                return this.Ma
                            }
                        }); d(b, "played", {
                            get: function() {
                                return {
                                    start: function() {
                                        return 0
                                    },
                                    end: function() {
                                        return 0
                                    },
                                    length: 0
                                }
                            }
                        }); d(b, "readyState", {
                            get: function() {
                                return 0
                            }
                        }); d(b, "seeking", {
                            get: function() {
                                return this.Oa
                            }
                        }); d(b, "seekable", {
                            get: function() {
                                return {
                                    start: function() {
                                        return 0
                                    },
                                    end: function() {
                                        return 0
                                    },
                                    length: 0
                                }
                            }
                        });

                        function z() {
                            t.call(this);
                            this.f = new u;
                            this.L = "btn-" + Date.now();
                            this.c = this.b = this.l = this.m = null;
                            this
                                .u = !1;
                            this.VIDEO_EVENTS = {
                                ABORT: "abort",
                                CAN_PLAY: "canplay",
                                CAN_PLAY_THROUGH: "canplaythrough",
                                DURATION_CHANGE: "durationchange",
                                EMPTIED: "emptied",
                                ENDED: "ended",
                                LOADED_DATA: "loadeddata",
                                LOADED_METADATA: "loadedmetadata",
                                LOAD_START: "loadstart",
                                PAUSE: "pause",
                                PLAY: "play",
                                PLAYING: "playing",
                                PROGRESS: "progress",
                                RATE_CHANGE: "ratechange",
                                SEEKED: "seeked",
                                STALLED: "stalled",
                                SUSPEND: "suspend",
                                TIME_UPDATE: "timeupdate",
                                VOLUME_CHANGE: "volumechange",
                                ERROR: "error",
                                WAITING: "waiting"
                            };
                            this.la = this.Pa()
                        }
                        z.prototype = f(t.prototype); b = z.prototype; b.constructor = z; b.configure = function(a) {
                            this.c || (this.c = a, this.b = new y(this.c, this.f), this.ea = !0, this.u = this.Ia(), a && (null != a.primaryVideo && "object" === typeof a.primaryVideo || 1 == a.primaryVideo ||
                                    !this.u) && (this.ea = !1), this.Da(), this.u || (this.Ra(), this.Ea(), this.Qa()), this.Ca(), this.Ja(), this.f
                                .postMessage(m.a.sa))
                        }; b.changeVidoeSize = function(a) {
                            this.c && (this.trace("changeVidoeSize()", a.width, a.height, a.x, a.y), this
                                .b.sizeObj = a)
                        }; b.setPrimaryVideo = function(a, c) {
                            if (this.c && !this.b.src) {
                                var e;
                                if ("string" === typeof a) {
                                    e = EB.getAssetUrl(a);
                                    this.b.src = a;
                                    var g = {};
                                    g.source = this.b.src;
                                    a = g
                                } else e = EB.getAssetUrl(a.source), this
                                    .b.src = a.source;
                                "" != e && (a.autoPlay = c || !1, this.b.ma._videoElement.src = this.b.src, this.b.ma._getAssetPath(e), this.f.postMessage(m.a.za, a))
                            }
                        }; b.setAndPlayPrimaryVideo = function(a) {
                            this.nc(a, !0)
                        }; b.startTimeBasedCountDown = function(a) {
                            data = {
                                remainingTime: a || null
                            };
                            this.f.postMessage(m.a.Aa, data)
                        }; b
                        .pause = function() {
                            this.c && (this.trace("pause()", this.b), this.b.pause())
                        }; b.play = function() {
                            this.c && (this
                                .trace("play()", this.b), this.b.play())
                        }; b.closeAd = function() {
                            this.c && this.Z()
                        }; b.skipAd = function() {
                            this
                                .c && this.fa()
                        }; b.disableAutoClose = function() {
                            this.ga()
                        }; b.getVideoCurrentTime = function() {
                            if (this.c) return
                            this.trace("getVideoCurrentTime", this.b), this.b.currentTime
                        }; b.getVideoDuration = function() {
                            if (this.c) return this.trace("getVideoDuration", this.b), this.b.duration
                        }; b.beforeCreativePlay = function(a) {
                            this.addEventListener(m.a.D, a)
                        }; b.onCloseEnabled = function(a) {
                            this
                                .addEventListener(m.a.U, a)
                        }; b.onSkipEnabled = function(a) {
                            this.addEventListener(m.a.Y, a)
                        }; b.onVideoStart = function(a) {
                            this.c && this.addEventListener(m.i.C, a)
                        }; b.onAdEnd = function(a) {
                            this.addEventListener(m.a
                                .G, a)
                        }; b.onAdStart = function(a) {
                            this.addEventListener(m.i.oa, a)
                        }; b.onVideoEvents = function(a, c) {
                            var e, g;
                            "function" == typeof a ? (e = this.la, g = a) : (e = a, g = c);
                            if ("function" == typeof a || a.constructor === Array)
                                for (var h = 0; h < e.length; h++) this.addEventListener(e[h], g);
                            else this.addEventListener(e, g)
                        }; d(b, "muted", {
                            get: function() {
                                return this.c ? this.b.muted : !1
                            },
                            set: function(a) {
                                this.c && (this.b.muted = a, this.trace("muted", this.b, a, this.b.muted))
                            }
                        }); d(b, "config", {
                            get: function() {
                                return this.c
                            }
                        }); b.lc = function() {
                            return {
                                ABORT: "abort",
                                CAN_PLAY: "canplay",
                                CAN_PLAY_THROUGH: "canplaythrough",
                                DURATION_CHANGE: "durationchange",
                                EMPTIED: "emptied",
                                ENDED: "ended",
                                LOADED_DATA: "loadeddata",
                                LOADED_METADATA: "loadedmetadata",
                                LOAD_START: "loadstart",
                                PAUSE: "pause",
                                PLAY: "play",
                                PLAYING: "playing",
                                PROGRESS: "progress",
                                RATE_CHANGE: "ratechange",
                                SEEKED: "seeked",
                                STALLED: "stalled",
                                SUSPEND: "suspend",
                                TIME_UPDATE: "timeupdate",
                                VOLUME_CHANGE: "volumechange",
                                ERROR: "error",
                                WAITING: "waiting"
                            }
                        }; b.Pa = function() {
                            var a = [],
                                c;
                            for (c in this.VIDEO_EVENTS) this.VIDEO_EVENTS.hasOwnProperty(c) && a.push(this
                                .VIDEO_EVENTS[c]);
                            return a
                        }; b.Ia = function() {
                            return "adkit" in window
                        }; b.Ra = function() {
                            var a = document.createElement("style");
                            a.appendChild(document.createTextNode(this.Ga()));
                            document.head.appendChild(a)
                        }; b.Ea = function() {
                            this.c.closeButton ? (this.m = this.c.closeButton, this.m.style.visibility = "hidden") : (this
                                .m = this.aa("CLOSE AD"), document.body.appendChild(this.m));
                            this.c.skipButton ? (this.l = this.c.skipButton, this.l.style.visibility = "hidden") : (this.l = this.aa("SKIP AD"), document.body.appendChild(this.l));
                            this
                                .m.addEventListener("click", this.Z.bind(this));
                            this.l.addEventListener("click", this.fa.bind(this))
                        };

                        b.Da = function() {
                            for (var a = [m.i.S, m.i.K, m.a.R, m.a.G, m.a.W, m.F.T, m.i.C, m.a.D, m.F.X], c = 0; c < a.length; c++) this.f.addEventListener(a[c], this.La.bind(this));
                            this.f.className = "AD_Messanger";
                            this.f.$a();
                            this.f
                                .Za()
                        }; b.Ca = function() {
                            for (var a in this.b.A) this.b.addEventListener(this.b.A[a], this.Ka.bind(this), !1)
                        }; b.Ja = function() {
                            EB._adConfigDefined || this.u || (this.m.style.visibility = "visible", this.l.style.visibility = "visible")
                        }; b.Qa = function() {
                            document.getElementsByTagName("body")[0].addEventListener("mousedown", this.ga.bind(this))
                        }; b.La = function(a) {
                            this.trace("onWindowEvent()", a.type);
                            switch (a.type) {
                                case m.a.W:
                                    a = this.b.Wa();
                                    a.delayVideo = this.b.delayVideo;
                                    a.noVideo = this.ea;
                                    a.browserData = EB._browserData;
                                    this.f.postMessage(m.a.na, a);
                                    break;
                                case m.i.S:
                                    this.dispatchEvent(new m(m.a.Y));
                                    this.u || (this.l.style.visibility = "visible");
                                    break;
                                case m
                                .a.R:
                                    this.dispatchEvent(new m(m.a.U));
                                    this.u || (this.m.style.visibility = "visible", this.l.style.visibility = "hidden");
                                    break;
                                case m.a.G:
                                    EBG.dispose && EBG.dispose();
                                    this.dispatchEvent(new m(m.a.G));
                                    this.trace("onWindowEvent
                                        () dispatching ",
                                        m.a.V);
                                    this.f.postMessage(m.a.V);
                                    break;
                                case m.F.X:
                                    this.dispatchEvent(new m(a.data.eventName));
                                    EB.notifyMessage(a.data);
                                    break;
                                case m.F.T:
                                    this.trace("SZMK: EB.notifyEvent", a.data);
                                    EB.notifyEvent(a.data);
                                    break;
                                case
                                m.i.C:
                                    this.dispatchEvent(new m(m.i.C));
                                    break;
                                case m.a.D:
                                    this.dispatchEvent(new m(m.a.D))
                            }
                        }; b.Ka = function(a) {
                            this.dispatchEvent(a)
                        }; b.aa = function(a) {
                            var c = document.createElement("div");
                            a = document.createTextNode(a);
                            c.className = this.L;
                            c.appendChild(a);
                            return c
                        }; b.fa = function() {
                            this.trace("skipAd()");
                            this.f.postMessage(m.a.wa);
                            this.f.postMessage(m.i.K)
                        }; b.Z = function() {
                            this.trace("closeAd()");
                            this.f.postMessage(m.a.ya);
                            this.f.postMessage(m.i.pa)
                        }; b.ga = function() {
                            this
                                .trace("userEngaged()");
                            this.f.postMessage(m.a.Ba)
                        }; b.Ga = function() {
                            var a = "color: white;background-color: rgba(46, 46, 46, 0.5);border: 1px solid rgba(255,
                                255, 255, 0.5); cursor: pointer; position: absolute; padding: 7 px; width: 107 px; visibility: hidden; left: auto; right: 15 px; top: 15 px; text - align: center ".split(";
                        "),c=["
                        border: 1 px solid white "],a=".
                        "+this
                        .L + "{" + a.join("; ") + "} ", c = "." + this.L + ":hover{" + c.join("; ") + "} ";
                        return a + c
                    };
                    window.VPAID = new z;
