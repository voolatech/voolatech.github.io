var admanager, core,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

admanager = this.admanager || {};

admanager.controller = this.admanager.controller || {};

admanager.event = this.admanager.event || {};

admanager.model = this.admanager.model || {};

admanager.view = this.admanager.view || {};

core = this.core || {};

core.common = this.core.common || {};

core.event = this.core.event || {};

core.model = this.core.model || {};

admanager.event.Event = (function() {
  function Event() {}

  Event.PLUGIN_READY = "pluginReady";

  Event.PLUGIN_ERROR = "pluginError";

  Event.DATA_LOAD_COMPLETE = "dataLoadComplete";

  Event.AD_COMPLETE = "adComplete";

  Event.AD_REPORTED = "adReported";

  Event.AD_STARTED = "adStarted";

  Event.AD_STOPPED = "adStopped";

  return Event;

})();

admanager.controller.Controller = (function() {
  var Event;

  Event = admanager.event.Event;

  function Controller(manager) {
    this.manager = manager;
    this._onAdDataLoadComplete = bind(this._onAdDataLoadComplete, this);
    this.manager.models.on(Event.DATA_LOAD_COMPLETE, this._onAdDataLoadComplete);
  }

  Controller.prototype._onAdDataLoadComplete = function() {
    var data;
    data = this.manager.models.getData();
    if (data.length > 0) {
      this.manager.views.populate(data);
    }
    return this.manager.emit(Event.PLUGIN_READY);
  };

  return Controller;

})();

core.common.Utils = (function() {
  function Utils() {}

  Utils.setCookie = function(name, value) {
    return document.cookie = name + "=" + value;
  };

  Utils.getCookie = function(name) {
    var end, start, val;
    if (document.cookie.indexOf(name + "=") === -1) {
      return void 0;
    }
    start = void 0;
    end = void 0;
    if (document.cookie.length > 0) {
      start = document.cookie.indexOf(name + "=");
    }
    if (start !== -1) {
      start = start + name.length + 1;
      end = document.cookie.indexOf(";", start);
      if (end === -1) {
        end = document.cookie.length;
      }
      val = unescape(document.cookie.substring(start, end));
      if (val === "true") {
        val = true;
      }
      if (val === "false") {
        val = false;
      }
      if (val === "undefined") {
        val = void 0;
      }
      if (val === "undefined") {
        val = null;
      }
      return val;
    }
    return void 0;
  };

  Utils.clearCookie = function(key) {
    return document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  Utils.clearCookies = function() {
    var cookie, cookies, j, key, len, pos, results1;
    cookies = document.cookie.split(";");
    results1 = [];
    for (j = 0, len = cookies.length; j < len; j++) {
      cookie = cookies[j];
      pos = cookie.indexOf("=");
      key = pos > -1 ? cookie.substr(0, pos) : cookie;
      results1.push(document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT");
    }
    return results1;
  };

  Utils.getQuery = function(name) {
    var regex, results;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return (results == null ? void 0 : decodeURIComponent(results[1].replace(/\+/g, " ")));
  };

  Utils.searchify = function(obj) {
    var a, key, value;
    a = [];
    for (key in obj) {
      key = encodeURIComponent(key);
      value = encodeURIComponent(obj[key]);
      a.push(key + "=" + value);
    }
    return a.join("&");
  };

  Utils.on = function(obj, type, fn) {
    if (obj.addEventListener) {
      return obj.addEventListener(type, fn, false);
    } else if (obj.attachEvent) {
      obj["e" + type + fn] = fn;
      return obj[type + fn] = function() {
        return obj["e" + type + fn](window.event);
      };
    }
  };

  Utils.off = function(obj, type, fn) {
    if (obj.removeEventListener) {
      return obj.removeEventListener(type, fn, false);
    } else if (obj.detachEvent) {
      obj.detachEvent("on" + type, obj[type + fn]);
      obj[type + fn] = null;
      return obj["e" + type + fn] = null;
    }
  };

  Utils.domLoaded = function() {
    return document.readyState === "complete" || document.readyState === "interactive";
  };

  Utils.request = function(url, callback) {
    var req;
    req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = function() {
      if (req.readyState !== 4) {
        return;
      }
      if (req.status !== 200 && req.status !== 304) {
        return typeof callback === "function" ? callback({
          error: true
        }) : void 0;
      } else {
        return typeof callback === "function" ? callback({
          data: req.responseText
        }) : void 0;
      }
    };
    return req.send();
  };

  Utils["typeof"] = function(obj) {
    var str;
    if (obj == null) {
      return false;
    }
    str = obj.constructor.toString();
    str = str.split("()")[0];
    str = str.replace("function ", "");
    str = str.trim();
    if (str.length > 0) {
      return str;
    } else {
      return false;
    }
  };

  Utils.loadScript = function(url, callback) {
    var head, script;
    script = document.createElement("script");
    script.src = url;
    script.onload = callback;
    head = document.getElementsByTagName("head")[0];
    head.appendChild(script);
    return script;
  };

  Utils.getPosition = function(el) {
    var x, y;
    x = 0;
    y = 0;
    while (el) {
      x += el.offsetLeft - el.scrollLeft + el.clientLeft;
      y += el.offsetTop - el.scrollTop + el.clientTop;
      el = el.offsetParent;
    }
    return {
      x: x,
      y: y
    };
  };

  Utils.isMobile = function() {
    var exp, matches;
    exp = /(Android)|(iPhone)|(webOS)|(iPad)|(iPod)|(BlackBerry)|(Windows Phone)/i;
    matches = navigator.userAgent.match(exp);
    return Boolean(matches);
  };

  Utils.getScreenSize = function() {
    var ratio;
    ratio = window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
    return {
      width: screen.width / ratio({
        height: screen.height / ratio
      })
    };
  };

  return Utils;

})();

admanager.model.AdModel = (function() {
  var Utils;

  Utils = core.common.Utils;

  function AdModel(_config) {
    this._config = _config;
    this._getRetVal = bind(this._getRetVal, this);
    this._getSkipOffset = bind(this._getSkipOffset, this);
    this._getCreativeNode = bind(this._getCreativeNode, this);
    this._getImpressions = bind(this._getImpressions, this);
    this._getType = bind(this._getType, this);
    this._getCompanion = bind(this._getCompanion, this);
    this._getClickUrl = bind(this._getClickUrl, this);
    this._getTracking = bind(this._getTracking, this);
    this._getVpaidCreative = bind(this._getVpaidCreative, this);
    this._getVastCreatives = bind(this._getVastCreatives, this);
    this._getCreatives = bind(this._getCreatives, this);
    this._getFormat = bind(this._getFormat, this);
    this._getOffset = bind(this._getOffset, this);
    this._getNode = bind(this._getNode, this);
    if (Utils["typeof"](this._config.data) !== "String") {
      return;
    }
    this._node = this._getNode();
    this.data = this._config.data;
    this.url = this._config.url;
    this.format = this._getFormat();
    this.type = this._getType();
    this.creatives = this._getCreatives();
    if (!this.creatives) {
      return;
    }
    this.companion = this._getCompanion();
    this.impressions = this._getImpressions();
    this.offset = this._getOffset();
    this.skipOffset = this._getSkipOffset();
    return this._getRetVal();
  }

  AdModel.prototype._getNode = function() {
    var node, parser;
    parser = new DOMParser();
    node = parser.parseFromString(this._config.data, "text/xml");
    return node;
  };

  AdModel.prototype._getOffset = function() {
    var offset;
    offset = this._config.offset;
    if (offset === "end") {
      return offset;
    }
    offset = Number(offset);
    if (isNaN(offset) || offset < 0) {
      offset = 0;
    }
    return offset;
  };

  AdModel.prototype._getFormat = function() {
    var format, name, node;
    node = this._node.getElementsByTagName("Linear")[0];
    if (!node) {
      node = this._node.getElementsByTagName("NonLinear")[0];
    }
    if (!node) {
      return;
    }
    name = node.nodeName;
    format = name === "Linear" ? "Linear" : "NonLinear";
    return format;
  };

  AdModel.prototype._getCreatives = function() {
    if (this.type === "VAST") {
      return this._getVastCreatives();
    }
    if (this.type === "VPAID") {
      return this._getVpaidCreative();
    }
  };

  AdModel.prototype._getVastCreatives = function() {
    var creatives, j, len, mediaNode, node, nodes;
    creatives = [];
    nodes = this._node.getElementsByTagName("Creative");
    for (j = 0, len = nodes.length; j < len; j++) {
      node = nodes[j];
      if (!node.getElementsByTagName("Linear")[0]) {
        continue;
      }
      mediaNode = node.getElementsByTagName("MediaFile")[0];
      creatives.push({
        type: mediaNode.getAttribute("type"),
        bitrate: Number(mediaNode.getAttribute("bitrate")),
        width: Number(mediaNode.getAttribute("width")),
        height: Number(mediaNode.getAttribute("height")),
        assetUrl: mediaNode.textContent,
        tracking: this._getTracking(node),
        clickUrl: this._getClickUrl(node)
      });
    }
    if (creatives.length > 0) {
      return creatives;
    }
  };

  AdModel.prototype._getVpaidCreative = function() {
    var adParams, mediaFile, mediaNode, node, paramsNode;
    node = this._node.getElementsByTagName(this.format)[0];
    if (!node) {
      return;
    }
    paramsNode = node.getElementsByTagName("AdParameters")[0];
    mediaNode = node.getElementsByTagName("MediaFile")[0];
    if (!(mediaNode && paramsNode)) {
      return;
    }
    adParams = paramsNode.textContent;
    mediaFile = {
      url: mediaNode.textContent,
      width: Number(mediaNode.getAttribute("width")),
      height: Number(mediaNode.getAttribute("height")),
      type: mediaNode.getAttribute("type"),
      tracking: this._getTracking(mediaNode)
    };
    return {
      mediaFile: mediaFile,
      adParams: adParams
    };
  };

  AdModel.prototype._getTracking = function(parent) {
    var j, len, node, nodes, tracking;
    tracking = [];
    nodes = parent.getElementsByTagName("Tracking");
    if (!nodes) {
      return;
    }
    for (j = 0, len = nodes.length; j < len; j++) {
      node = nodes[j];
      tracking.push({
        event: node.getAttribute("event"),
        url: node.textContent
      });
    }
    return tracking;
  };

  AdModel.prototype._getClickUrl = function(parent) {
    var click, node;
    node = parent.getElementsByTagName("ClickThrough")[0];
    if (!node) {
      return;
    }
    click = node.textContent;
    return click;
  };

  AdModel.prototype._getCompanion = function() {
    var data, matches, regex;
    regex = /<CompanionAds>([^)]+)<\/CompanionAds>/;
    matches = regex.exec(this._config.data);
    if (!matches) {
      return;
    }
    data = matches[0];
    if (Utils["typeof"](data) !== "String") {
      return;
    }
    if (data.length > 0) {
      return data;
    }
  };

  AdModel.prototype._getType = function() {
    var node, type;
    node = this._node.querySelectorAll("[apiFramework=VPAID]")[0];
    type = node ? "VPAID" : "VAST";
    return type;
  };

  AdModel.prototype._getImpressions = function() {
    var impressions, j, len, node, nodes;
    impressions = [];
    nodes = this._node.getElementsByTagName("Impression");
    for (j = 0, len = nodes.length; j < len; j++) {
      node = nodes[j];
      impressions.push({
        url: node.textContent
      });
    }
    return impressions;
  };

  AdModel.prototype._getCreativeNode = function() {
    var node;
    node = this._node.getElementsByTagName("Linear")[0];
    if (node) {
      return node;
    }
    return node = this._node.getElementsByTagName("NonLinear")[0];
  };

  AdModel.prototype._getSkipOffset = function(parent) {
    var mins, node, obj, parts, secs, value;
    obj = {};
    node = this._node.getElementsByTagName(this.format)[0];
    if (!node) {
      return;
    }
    value = node.getAttribute("skipoffset");
    if (value == null) {
      return;
    }
    if (value.indexOf(":") > -1) {
      obj.type = "seconds";
      parts = value.split(":");
      mins = Number(parts[1]);
      secs = Number(parts[2]);
      obj.value = mins * 60 + secs;
      return obj;
    }
    if (value.indexOf("%") > -1) {
      obj.type = "percent";
      obj.value = Number(value.replace("%", "")) * 0.01;
      return obj;
    }
  };

  AdModel.prototype._getRetVal = function() {
    return {
      data: this.data,
      url: this.url,
      format: this.format,
      type: this.type,
      creatives: this.creatives,
      companion: this.companion,
      impressions: this.impressions,
      offset: this.offset,
      skipOffset: this.skipOffset
    };
  };

  return AdModel;

})();

core.event.EventDispatcher = (function() {
  function EventDispatcher(listeners) {
    this.listeners = listeners != null ? listeners : [];
    this.dispatchEvent = bind(this.dispatchEvent, this);
    this.removeEventListener = bind(this.removeEventListener, this);
    this.addEventListener = bind(this.addEventListener, this);
    this.on = this.addEventListener;
    this.off = this.removeEventListener;
    this.emit = this.dispatchEvent;
  }

  EventDispatcher.prototype.addEventListener = function(type, callback) {
    var listener;
    listener = {
      type: type,
      callback: callback
    };
    return this.listeners.push(listener);
  };

  EventDispatcher.prototype.removeEventListener = function(type, callback) {
    var i, j, listener, ref, results1;
    results1 = [];
    for (i = j = ref = this.listeners.length - 1; ref <= 0 ? j < 0 : j > 0; i = ref <= 0 ? ++j : --j) {
      listener = this.listeners[i];
      if (listener.type === type && listener.callback === callback) {
        results1.push(this.listeners.splice(i, 1));
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };

  EventDispatcher.prototype.dispatchEvent = function(type, data) {
    var event, j, len, listener, ref, results1;
    if (data == null) {
      data = null;
    }
    event = {
      target: this,
      type: type,
      data: data
    };
    ref = this.listeners;
    results1 = [];
    for (j = 0, len = ref.length; j < len; j++) {
      listener = ref[j];
      if (listener.type === type) {
        results1.push(listener.callback(event));
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };

  return EventDispatcher;

})();

core.event.Event = (function() {
  function Event() {}

  Event.MODEL_CHANGED = "modelChanged";

  Event.READY = "ready";

  Event.RESIZE = "resize";

  return Event;

})();

core.model.Model = (function(superClass) {
  var Event, Utils;

  extend(Model, superClass);

  Utils = core.common.Utils;

  Event = core.event.Event;

  Model.prototype.data = {};

  function Model() {
    this._checkCookies = bind(this._checkCookies, this);
    this._checkQueries = bind(this._checkQueries, this);
    this.pullData = bind(this.pullData, this);
    this.getData = bind(this.getData, this);
    this.setData = bind(this.setData, this);
    Model.__super__.constructor.call(this);
    this.pullData();
  }

  Model.prototype.setData = function(key, value) {
    this.data[key] = value;
    return this.dispatchEvent(Event.MODEL_CHANGED, {
      key: key,
      value: value
    });
  };

  Model.prototype.getData = function(key) {
    if (key === void 0) {
      return this.data;
    } else {
      return this.data[key];
    }
  };

  Model.prototype.pullData = function() {};

  Model.prototype._checkQueries = function() {
    var key, results1, value;
    results1 = [];
    for (key in this.data) {
      value = Utils.getQuery(key);
      if (value === "true") {
        value = true;
      }
      if (value === "false") {
        value = false;
      }
      results1.push(this.data[key] = value != null ? value : this.data[key]);
    }
    return results1;
  };

  Model.prototype._checkCookies = function() {
    var key, results1, value;
    results1 = [];
    for (key in this.data) {
      value = Utils.getCookie(key);
      if (value === "true") {
        value = true;
      }
      if (value === "false") {
        value = false;
      }
      results1.push(this.data[key] = value != null ? value : this.data[key]);
    }
    return results1;
  };

  return Model;

})(core.event.EventDispatcher);

admanager.model.AdModels = (function(superClass) {
  var AdModel, Event, Model, Utils;

  extend(AdModels, superClass);

  Utils = core.common.Utils;

  Model = core.model.Model;

  AdModel = admanager.model.AdModel;

  Event = admanager.event.Event;

  AdModels.prototype.data = [];

  AdModels.prototype.loaded = 0;

  function AdModels(manager) {
    this.manager = manager;
    this._emitError = bind(this._emitError, this);
    this._emitReady = bind(this._emitReady, this);
    this._parseString = bind(this._parseString, this);
    this._requestAdData = bind(this._requestAdData, this);
    this._parseArray = bind(this._parseArray, this);
    this.pullData = bind(this.pullData, this);
    this.ads = this.manager.config.ads;
    AdModels.__super__.constructor.call(this);
  }

  AdModels.prototype.pullData = function() {
    switch (Utils["typeof"](this.ads)) {
      case "Array":
        return this._parseArray();
      case "String":
        return this._parseString();
      default:
        return this._emitError();
    }
  };

  AdModels.prototype._parseArray = function() {
    var config, j, len, ref, results1;
    if (this.ads.length === 0) {
      return this._emitReady();
    }
    ref = this.ads;
    results1 = [];
    for (j = 0, len = ref.length; j < len; j++) {
      config = ref[j];
      results1.push(this._requestAdData(config));
    }
    return results1;
  };

  AdModels.prototype._requestAdData = function(config) {
    return Utils.request(config.url, (function(_this) {
      return function(event) {
        var ad;
        config.data = event.data;
        ad = new AdModel(config);
        if (ad && ad.creatives) {
          _this.data.push(ad);
        }
        if (++_this.loaded === _this.ads.length) {
          return _this._emitReady();
        }
      };
    })(this));
  };

  AdModels.prototype._parseString = function() {
    console.log("_parseString");
    return this._emitReady();
  };

  AdModels.prototype._emitReady = function() {
    return setTimeout(((function(_this) {
      return function() {
        return _this.emit(Event.DATA_LOAD_COMPLETE);
      };
    })(this)), 1);
  };

  AdModels.prototype._emitError = function(message) {
    if (message == null) {
      message = "Error parsing ad configuration";
    }
    return this.emit(Event.PLUGIN_ERROR, {
      error: message
    });
  };

  return AdModels;

})(core.model.Model);

admanager.view.CountdownView = (function() {
  function CountdownView(parent1) {
    this.parent = parent1;
    this._css = bind(this._css, this);
    this.update = bind(this.update, this);
    this.node = document.createElement("div");
    this.node.style.cssText = this._css();
    this.node.innerHTML = "Advertisement";
    this.parent.appendChild(this.node);
  }

  CountdownView.prototype.update = function(currentTime, duration) {
    var time;
    time = parseInt(duration - currentTime);
    return this.node.innerHTML = "Remaining Time: " + time;
  };

  CountdownView.prototype._css = function() {
    return "padding: 5px; font-size: 85%; color: white; background-color: black; opacity: 0.6; text-align: center; border-bottom: 1px solid rgb(104, 104, 104);";
  };

  return CountdownView;

})();

admanager.view.ClickView = (function() {
  function ClickView(parent1) {
    this.parent = parent1;
    this._css = bind(this._css, this);
    this.node = document.createElement("node");
    this.node.style.cssText = this._css();
    this.parent.appendChild(this.node);
  }

  ClickView.prototype._css = function() {
    return "width: 100%; height: 100%; cursor: pointer; position: absolute; top: 0; left: 0;";
  };

  return ClickView;

})();

admanager.view.ResumeView = (function() {
  function ResumeView(parent1) {
    this.parent = parent1;
    this._graphicCss = bind(this._graphicCss, this);
    this._css = bind(this._css, this);
    this._getGraphic = bind(this._getGraphic, this);
    this._getNode = bind(this._getNode, this);
    this.hide = bind(this.hide, this);
    this.show = bind(this.show, this);
    this.width = 100;
    this.node = this._getNode();
    this.graphic = this._getGraphic();
    this.node.appendChild(this.graphic);
    this.parent.appendChild(this.node);
  }

  ResumeView.prototype.show = function() {
    return this.node.style.display = "block";
  };

  ResumeView.prototype.hide = function() {
    return this.node.style.display = "none";
  };

  ResumeView.prototype._getNode = function() {
    var node;
    node = document.createElement("node");
    node.style.cssText = this._css();
    return node;
  };

  ResumeView.prototype._getGraphic = function() {
    var ctx, node;
    node = document.createElement("canvas");
    node.width = this.width;
    node.height = this.width;
    node.style.cssText = this._graphicCss();
    ctx = node.getContext("2d");
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.width, this.width * 0.5);
    ctx.lineTo(0, this.width);
    ctx.lineTo(0, 0);
    ctx.fill();
    return node;
  };

  ResumeView.prototype._css = function() {
    return "width: 100%; height: 100%; cursor: pointer; position: absolute; top: 0; left: 0; background-color: black; opacity: 0.8; display: none;";
  };

  ResumeView.prototype._graphicCss = function() {
    return "position: absolute; left: 50%; top: 50%; margin-left: " + (-this.width * 0.5) + "px; margin-top: " + (-this.width * 0.5) + "px;";
  };

  return ResumeView;

})();

admanager.view.SkipView = (function() {
  SkipView.prototype.offset = null;

  SkipView.prototype.width = 100;

  SkipView.prototype.height = 25;

  function SkipView(parent1, config1) {
    this.parent = parent1;
    this.config = config1;
    this._css = bind(this._css, this);
    this.update = bind(this.update, this);
    if (!this.config) {
      return this;
    }
    this.node = document.createElement("div");
    if (this.config.type === "seconds") {
      this.offset = this.config.value;
    }
    this.node.style.cssText = this._css();
    this.node.innerHTML = "Skip &rarr;";
    this.parent.appendChild(this.node);
  }

  SkipView.prototype.update = function(currentTime, duration) {
    if (!this.config) {
      return;
    }
    if (this.node.style.display === "block") {
      return;
    }
    if (this.offset == null) {
      this.offset = duration * this.config.value;
    }
    if (currentTime >= this.offset) {
      return this.node.style.display = "block";
    }
  };

  SkipView.prototype._css = function() {
    return "font-size: 125%; color: white; opacity: 0.6; cursor: pointer; position: absolute; background-color: black; right: 0; padding: 8px 20px 8px 20px; margin-top: 5px; border: 1px solid rgb(104, 104, 104); border-right: 0; display: none;";
  };

  return SkipView;

})();

admanager.view.AdView = (function(superClass) {
  var Event, Utils;

  extend(AdView, superClass);

  Utils = core.common.Utils;

  Event = admanager.event.Event;

  AdView.prototype.error = true;

  AdView.prototype.timer = null;

  AdView.prototype.muted = false;

  AdView.prototype.prevVolume = 1;

  AdView.prototype.contentTime = 0;

  AdView.prototype.contentSrc = "";

  AdView.prototype.started = false;

  AdView.prototype.stopped = false;

  function AdView(manager, config1) {
    this.manager = manager;
    this.config = config1;
    this._getFsState = bind(this._getFsState, this);
    this._sendTracking = bind(this._sendTracking, this);
    this._sendImpressions = bind(this._sendImpressions, this);
    this._stopTimer = bind(this._stopTimer, this);
    this._sendAdRmainingTime = bind(this._sendAdRmainingTime, this);
    this._startTimer = bind(this._startTimer, this);
    this.stop = bind(this.stop, this);
    this.start = bind(this.start, this);
    this.resize = bind(this.resize, this);
    AdView.__super__.constructor.call(this);
  }

  AdView.prototype.resize = function(width, height) {};

  AdView.prototype.start = function() {
    var currDuration, currRemainingTime;
    this.started = true;
    this.contentSrc = this.video.currentSrc;
    this.contentTime = this.video.currentTime;
    this.prevVolume = this.video.volume;
    this.muted = this.video.muted;
    if (this.ad) {
      this.prevVolume = this.ad.getAdVolume().toFixed(2);
      this._sendTracking("getVolume", this.prevVolume);
      currDuration = this.ad.getAdDuration().toFixed(2);
      this._sendTracking("adDuration", currDuration);
      currRemainingTime = this.ad.getAdRemainingTime().toFixed(2);
      this._sendTracking("adRemainingTime", currRemainingTime);
      setInterval(this._sendAdRmainingTime, 1000);
    }
    this._startTimer();
    return this.manager.emit(Event.AD_STARTED, {
      ad: this.config
    });
  };

  AdView.prototype.stop = function() {
    this.stopped = true;
    this._stopTimer();
    this.manager.config.adContainer.innerHTML = "";
    return this.manager.emit(Event.AD_STOPPED);
  };

  AdView.prototype._startTimer = function() {
    if (this.timer == null) {
      return this.timer = setTimeout(this.stop, 15000);
    }
  };

  AdView.prototype._sendAdRmainingTime = function() {
    var currRemainingTime;
    currRemainingTime = this.ad.getAdRemainingTime().toFixed(2);
    return this._sendTracking("adRemainingTime", currRemainingTime);
  };

  AdView.prototype._stopTimer = function() {
    clearTimeout(this.timer);
    if (this.error) {
      return this._sendTracking("error");
    }
  };

  AdView.prototype._sendImpressions = function() {
    var impression, j, len, ref, results1;
    if (this.config.impressions) {
      ref = this.config.impressions;
      results1 = [];
      for (j = 0, len = ref.length; j < len; j++) {
        impression = ref[j];
        Utils.request(impression.url);
        results1.push(this.manager.emit(Event.AD_REPORTED, {
          type: "impression"
        }));
      }
      return results1;
    }
  };

  AdView.prototype._sendTracking = function(type, value) {
    var j, len, ref, track, url;
    if (this.creative && this.creative.tracking) {
      ref = this.creative.tracking;
      for (j = 0, len = ref.length; j < len; j++) {
        track = ref[j];
        if (track.event === type) {
          url = track.url;
        }
      }
    }
    if (url != null) {
      Utils.request(url);
    }
    return this.manager.emit(Event.AD_REPORTED, {
      type: type,
      value: value
    });
  };

  AdView.prototype._getFsState = function() {
    var fs;
    if (document.fullscreen != null) {
      fs = document.fullscreen;
    } else if (document.mozFullScreen != null) {
      fs = document.mozFullScreen;
    } else if (document.webkitIsFullScreen != null) {
      fs = document.webkitIsFullScreen;
    } else if (document.msFullscreenElement != null) {
      fs = document.msFullscreenElement !== null;
    }
    if (fs == null) {
      fs = false;
    }
    return fs;
  };

  return AdView;

})(core.event.EventDispatcher);

admanager.view.VastView = (function(superClass) {
  var ClickView, CountdownView, Event, ResumeView, SkipView, Utils;

  extend(VastView, superClass);

  Utils = core.common.Utils;

  Event = admanager.event.Event;

  SkipView = admanager.view.SkipView;

  ResumeView = admanager.view.ResumeView;

  ClickView = admanager.view.ClickView;

  CountdownView = admanager.view.CountdownView;

  VastView.prototype.hasPlayed = false;

  VastView.prototype.quartiles = {};

  VastView.prototype.viewed = 0;

  VastView.prototype.skipOffset = null;

  function VastView(manager, config1) {
    this.manager = manager;
    this.config = config1;
    this._onCreativeError = bind(this._onCreativeError, this);
    this._onCreativeSuccess = bind(this._onCreativeSuccess, this);
    this._getCreative = bind(this._getCreative, this);
    this._onClick = bind(this._onClick, this);
    this._onSkip = bind(this._onSkip, this);
    this._onResume = bind(this._onResume, this);
    this._onFullScreenChange = bind(this._onFullScreenChange, this);
    this._onError = bind(this._onError, this);
    this._onEnded = bind(this._onEnded, this);
    this._onVolumeChange = bind(this._onVolumeChange, this);
    this._checkQuartile = bind(this._checkQuartile, this);
    this._onSeeked = bind(this._onSeeked, this);
    this._onSeeking = bind(this._onSeeking, this);
    this._checkForReset = bind(this._checkForReset, this);
    this._onTimeUpdate = bind(this._onTimeUpdate, this);
    this._onPause = bind(this._onPause, this);
    this._onPlay = bind(this._onPlay, this);
    this._onContentMeta = bind(this._onContentMeta, this);
    this._display = bind(this._display, this);
    this.stop = bind(this.stop, this);
    this.start = bind(this.start, this);
    VastView.__super__.constructor.call(this, this.manager, this.config);
    this.video = this.manager.config.videoTag;
  }

  VastView.prototype.start = function() {
    if (this.started) {
      return;
    }
    VastView.__super__.start.call(this);
    this.click = new ClickView(this.manager.config.adContainer);
    this.resume = new ResumeView(this.manager.config.adContainer);
    this.countdown = new CountdownView(this.manager.config.adContainer);
    this.skip = new SkipView(this.manager.config.adContainer, this.config.skipOffset);
    if (this.skip.node) {
      this.skip.node.onclick = this._onSkip;
    }
    if (this.resume.node) {
      this.resume.node.onclick = this._onResume;
    }
    if (this.click.node) {
      this.click.node.onclick = this._onClick;
    }
    return this._getCreative();
  };

  VastView.prototype.stop = function() {
    if (this.stopped) {
      return;
    }
    VastView.__super__.stop.call(this);
    Utils.on(this.video, "loadedmetadata", this._onContentMeta);
    Utils.off(this.video, "play", this._onPlay);
    Utils.off(this.video, "pause", this._onPause);
    Utils.off(this.video, "timeupdate", this._onTimeUpdate);
    Utils.off(this.video, "seeking", this._onSeeking);
    Utils.off(this.video, "seeked", this._onSeeked);
    Utils.off(this.video, "volumechange", this._onVolumeChange);
    Utils.off(this.video, "ended", this._onEnded);
    Utils.off(this.video, "error", this._onError);
    Utils.off(document, "fullscreenchange", this._onFullScreenChange);
    Utils.off(document, "mozfullscreenchange", this._onFullScreenChange);
    Utils.off(document, "webkitfullscreenchange", this._onFullScreenChange);
    Utils.off(document, "msfullscreenchange", this._onFullScreenChange);
    this.video.src = this.contentSrc;
    return this.video.load();
  };

  VastView.prototype._display = function() {
    Utils.on(this.video, "play", this._onPlay);
    Utils.on(this.video, "pause", this._onPause);
    Utils.on(this.video, "timeupdate", this._onTimeUpdate);
    Utils.on(this.video, "seeking", this._onSeeking);
    Utils.on(this.video, "seeked", this._onSeeked);
    Utils.on(this.video, "volumechange", this._onVolumeChange);
    Utils.on(this.video, "ended", this._onEnded);
    Utils.on(document, "fullscreenchange", this._onFullScreenChange);
    Utils.on(document, "mozfullscreenchange", this._onFullScreenChange);
    Utils.on(document, "webkitfullscreenchange", this._onFullScreenChange);
    Utils.on(document, "msfullscreenchange", this._onFullScreenChange);
    this.error = false;
    this.quartiles.first = {
      reported: false,
      time: this.video.duration * 0.25,
      type: "firstQuartile"
    };
    this.quartiles.second = {
      reported: false,
      time: this.video.duration * 0.50,
      type: "midpoint"
    };
    this.quartiles.third = {
      reported: false,
      time: this.video.duration * 0.75,
      type: "thirdQuartile"
    };
    this._sendTracking("creativeView");
    this._sendImpressions();
    this._stopTimer();
    return this.video.play();
  };

  VastView.prototype._onContentMeta = function() {
    Utils.off(this.video, "loadedmetadata", this._onContentMeta);
    if (this.contentTime > 0) {
      this.video.currentTime = this.contentTime;
    }
    if (this.contentTime < this.video.duration) {
      this.video.play();
    }
    return this.emit(Event.AD_COMPLETE);
  };

  VastView.prototype._onPlay = function() {
    var type;
    type = this.hasPlayed ? "resume" : "start";
    this.hasPlayed = true;
    return this._sendTracking(type);
  };

  VastView.prototype._onPause = function() {
    if (!this.video.ended) {
      return this.manager.emit(Event.AD_REPORTED, {
        type: "pause"
      });
    }
  };

  VastView.prototype._onTimeUpdate = function() {
    if (this.seeking) {
      Utils.off(this.video, "play", this._onPlay);
      Utils.off(this.video, "ended", this._onEnded);
      Utils.off(this.video, "timeupdate", this._onTimeUpdate);
      Utils.on(this.video, "timeupdate", this._checkForReset);
      return;
    }
    this.manager.emit(Event.AD_REPORTED, {
      type: "progress"
    });
    this.countdown.update(this.video.currentTime, this.video.duration);
    this.skip.update(this.video.currentTime, this.video.duration);
    this._checkQuartile(this.quartiles.first);
    this._checkQuartile(this.quartiles.second);
    this._checkQuartile(this.quartiles.third);
    if (this.video.currentTime > this.viewed) {
      return this.viewed = this.video.currentTime;
    }
  };

  VastView.prototype._checkForReset = function() {
    if (this.seeking) {
      return;
    }
    if (this.video.currentTime > this.viewed && this.viewed < this.skipOffset) {
      this.video.currentTime = Math.floor(this.viewed) - 0.2;
      this.video.play();
      return;
    }
    Utils.on(this.video, "play", this._onPlay);
    Utils.on(this.video, "ended", this._onEnded);
    Utils.on(this.video, "timeupdate", this._onTimeUpdate);
    return Utils.off(this.video, "timeupdate", this._checkForReset);
  };

  VastView.prototype._onSeeking = function() {
    return this.seeking = true;
  };

  VastView.prototype._onSeeked = function() {
    return this.seeking = false;
  };

  VastView.prototype._checkQuartile = function(quartile) {
    if (quartile.reported || this.video.currentTime < quartile.time) {
      return;
    }
    this._sendTracking(quartile.type);
    return quartile.reported = true;
  };

  VastView.prototype._onVolumeChange = function() {
    if (this.video.muted || this.video.volume === 0) {
      this._sendTracking("mute");
    } else if (!this.video.muted && this.muted || this.video.volume > 0 && this.prevVolume === 0) {
      this._sendTracking("unmute");
    }
    this.prevVolume = this.video.volume;
    return this.muted = this.video.muted;
  };

  VastView.prototype._onEnded = function() {
    this._sendTracking("complete");
    return this.stop();
  };

  VastView.prototype._onError = function() {
    this._sendTracking("error");
    return this.stop();
  };

  VastView.prototype._onFullScreenChange = function() {
    var fs, type;
    fs = this._getFsState();
    type = fs ? "fullscreen" : "exitFullscreen";
    return this._sendTracking(type);
  };

  VastView.prototype._onResume = function() {
    this.resume.hide();
    return this.video.play();
  };

  VastView.prototype._onSkip = function() {
    this._sendTracking("skip");
    return this.stop();
  };

  VastView.prototype._onClick = function() {
    if (this.creative.clickUrl == null) {
      return;
    }
    this.resume.show();
    this.video.pause();
    this._sendTracking("clickTracking");
    return window.open(this.creative.clickUrl, "_blank");
  };

  VastView.prototype._getCreative = function() {
    var creative, j, len, ref;
    ref = this.config.creatives;
    for (j = 0, len = ref.length; j < len; j++) {
      creative = ref[j];
      if (creative.checked) {
        continue;
      }
      creative.checked = true;
      if (this.video.canPlayType(creative.type) === "") {
        continue;
      }
      Utils.on(this.video, "loadedmetadata", this._onCreativeSuccess);
      Utils.on(this.video, "error", this._onCreativeError);
      this.creative = creative;
      this.video.src = creative.assetUrl;
      this.video.load();
      return;
    }
    return this.stop();
  };

  VastView.prototype._onCreativeSuccess = function() {
    if (typeof this.config.skipOffset !== "undefined") {
      this.skipOffset = this.config.skipOffset.value;
    } else {
      this.skipOffset = this.video.duration;
    }
    Utils.off(this.video, "loadedmetadata", this._onCreativeSuccess);
    Utils.off(this.video, "error", this._onCreativeError);
    return this._display();
  };

  VastView.prototype._onCreativeError = function() {
    Utils.off(this.video, "loadedmetadata", this._onCreativeSuccess);
    Utils.off(this.video, "error", this._onCreativeError);
    this.creative = null;
    return this._getCreative();
  };

  return VastView;

})(admanager.view.AdView);

admanager.view.VpaidView = (function(superClass) {
  var Event, Utils;

  extend(VpaidView, superClass);

  Utils = core.common.Utils;

  Event = admanager.event.Event;

  VpaidView.prototype.loaded = false;

  VpaidView.prototype.ad = null;

  function VpaidView(manager, config1) {
    this.manager = manager;
    this.config = config1;
    this._getVpaidEvents = bind(this._getVpaidEvents, this);
    this._onAdLog = bind(this._onAdLog, this);
    this._onAdExpandedChange = bind(this._onAdExpandedChange, this);
    this._onAdDurationChange = bind(this._onAdDurationChange, this);
    this._onAdLinearChange = bind(this._onAdLinearChange, this);
    this._onAdSizeChange = bind(this._onAdSizeChange, this);
    this._onAdSkippableStateChange = bind(this._onAdSkippableStateChange, this);
    this._onAdError = bind(this._onAdError, this);
    this._onAdPlaying = bind(this._onAdPlaying, this);
    this._onAdPaused = bind(this._onAdPaused, this);
    this._onAdUserClose = bind(this._onAdUserClose, this);
    this._onAdUserMinimize = bind(this._onAdUserMinimize, this);
    this._onAdUserAcceptInvitation = bind(this._onAdUserAcceptInvitation, this);
    this._onAdInteraction = bind(this._onAdInteraction, this);
    this._onAdClickThru = bind(this._onAdClickThru, this);
    this._onAdVideoComplete = bind(this._onAdVideoComplete, this);
    this._onAdVideoThirdQuartile = bind(this._onAdVideoThirdQuartile, this);
    this._onAdVideoMidpoint = bind(this._onAdVideoMidpoint, this);
    this._onAdVideoFirstQuartile = bind(this._onAdVideoFirstQuartile, this);
    this._onAdVideoStart = bind(this._onAdVideoStart, this);
    this._onAdImpression = bind(this._onAdImpression, this);
    this._onAdVolumeChange = bind(this._onAdVolumeChange, this);
    this._onAdSkipped = bind(this._onAdSkipped, this);
    this._onAdStopped = bind(this._onAdStopped, this);
    this._onAdStarted = bind(this._onAdStarted, this);
    this._onAdLoaded = bind(this._onAdLoaded, this);
    this._removeListeners = bind(this._removeListeners, this);
    this._addListeners = bind(this._addListeners, this);
    this._getScript = bind(this._getScript, this);
    this._getNode = bind(this._getNode, this);
    this._getFrame = bind(this._getFrame, this);
    this._initAd = bind(this._initAd, this);
    this._onScriptLoaded = bind(this._onScriptLoaded, this);
    this._onFrameLoaded = bind(this._onFrameLoaded, this);
    this._loadScript = bind(this._loadScript, this);
    this._hide = bind(this._hide, this);
    this._show = bind(this._show, this);
    this._onContentMeta = bind(this._onContentMeta, this);
    this._resume = bind(this._resume, this);
    this._display = bind(this._display, this);
    this.resize = bind(this.resize, this);
    this.stop = bind(this.stop, this);
    this.start = bind(this.start, this);
    VpaidView.__super__.constructor.call(this, this.manager, this.config);
    this.video = this.manager.config.videoTag;
    this.container = this.manager.config.adContainer;
    this.creative = this.config.creatives;
    this.node = this._getNode();
    this.frame = this._getFrame();
    this.script = this._getScript();
    this._loadScript();
  }

  VpaidView.prototype.start = function() {
    if (this.started) {
      return;
    }
    VpaidView.__super__.start.call(this);
    if (this.loaded) {
      return this._display();
    }
  };

  VpaidView.prototype.stop = function() {
    if (this.stopped) {
      return;
    }
    VpaidView.__super__.stop.call(this);
    this._removeListeners();
    this._hide();
    return this._resume();
  };

  VpaidView.prototype.resize = function(width, height) {
    return this.ad.resizeAd(width, height);
  };

  VpaidView.prototype._display = function() {
    if (this.config.format === "Linear") {
      this.video.pause();
    }
    this._show();
    this._addListeners();
    return this._initAd();
  };

  VpaidView.prototype._resume = function() {
    Utils.on(this.video, "loadedmetadata", this._onContentMeta);
    this.video.src = this.contentSrc;
    return this.video.load();
  };

  VpaidView.prototype._onContentMeta = function() {
    Utils.off(this.video, "loadedmetadata", this._onContentMeta);
    if (this.contentTime > 0) {
      this.video.currentTime = this.contentTime;
    }
    if (this.contentTime < this.video.duration) {
      this.video.play();
    }
    return this.emit(Event.AD_COMPLETE);
  };

  VpaidView.prototype._show = function() {
    return this.container.appendChild(this.node);
  };

  VpaidView.prototype._hide = function() {
    if (this.node.parentNode) {
      this.node.parentNode.removeChild(this.node);
    }
    if (this.frame.parentNode) {
      return this.frame.parentNode.removeChild(this.frame);
    }
  };

  VpaidView.prototype._loadScript = function() {
    this.frame.onload = this._onFrameLoaded;
    return document.body.appendChild(this.frame);
  };

  VpaidView.prototype._onFrameLoaded = function() {
    this.script.onload = this._onScriptLoaded;
    return this.frame.contentDocument.body.appendChild(this.script);
  };

  VpaidView.prototype._onScriptLoaded = function() {
    if (!this.frame.contentWindow.getVPAIDAd) {
      this.stop();
      return;
    }
    this.ad = this.frame.contentWindow.getVPAIDAd();
    this.loaded = true;
    if (this.started) {
      return this._display();
    }
  };

  VpaidView.prototype._initAd = function() {
    var creativeData, desiredBitrate, environmentVars, height, viewMode, width;
    width = this.video.width;
    height = this.video.height;
    viewMode = this._getFsState() ? "fullscreen" : "normal";
    desiredBitrate = 300;
    creativeData = {
      AdParameters: this.config.creatives.adParams
    };
    environmentVars = {
      slot: this.node,
      videoSlot: this.video,
      videoSlotCanAutoPlay: true
    };
    this.ad.handshakeVersion("2.0");
    return this.ad.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
  };

  VpaidView.prototype._getFrame = function() {
    var node;
    node = document.createElement("iframe");
    node.width = 1;
    node.height = 1;
    node.style.opacity = 0;
    node.id = "SZMKPlayerIframeContainer";
    node.src = "about:blank";
    node.setAttribute("frameborder", "0");
    return node;
  };

  VpaidView.prototype._getNode = function() {
    var node;
    node = document.createElement("div");
    return node;
  };

  VpaidView.prototype._getScript = function() {
    var script;
    script = document.createElement("script");
    script.src = this.config.creatives.mediaFile.url;
    return script;
  };

  VpaidView.prototype._addListeners = function() {
    var event, events, method, results1;
    events = this._getVpaidEvents();
    results1 = [];
    for (event in events) {
      method = events[event];
      results1.push(this.ad.subscribe(method, event, this));
    }
    return results1;
  };

  VpaidView.prototype._removeListeners = function() {
    var event, events, method, results1;
    events = this._getVpaidEvents();
    results1 = [];
    for (event in events) {
      method = events[event];
      results1.push(this.ad.unsubscribe(method, event, this));
    }
    return results1;
  };

  VpaidView.prototype._onAdLoaded = function() {
    this.error = false;
    this._stopTimer();
    return this.ad.startAd();
  };

  VpaidView.prototype._onAdStarted = function() {
    return this._sendTracking("creativeView");
  };

  VpaidView.prototype._onAdStopped = function() {
    return this.stop();
  };

  VpaidView.prototype._onAdSkipped = function() {
    this._sendTracking("skip");
    return this.stop();
  };

  VpaidView.prototype._onAdVolumeChange = function(event) {
    var currVolume;
    if (this.video.volume !== this.prevVolume) {
      currVolume = this.ad.getAdVolume().toFixed(2);
      this._sendTracking("getVolume", currVolume);
    }
    if (this.video.muted || this.video.volume === 0) {
      this._sendTracking("mute");
    } else if (!this.video.muted && this.muted || this.video.volume > 0 && this.prevVolume === 0) {
      this._sendTracking("unmute");
    }
    this.prevVolume = this.video.volume;
    return this.muted = this.video.muted;
  };

  VpaidView.prototype._onAdImpression = function() {
    return this._sendImpressions();
  };

  VpaidView.prototype._onAdVideoStart = function() {
    return this._sendTracking("start");
  };

  VpaidView.prototype._onAdVideoFirstQuartile = function() {
    return this._sendTracking("firstQuartile");
  };

  VpaidView.prototype._onAdVideoMidpoint = function() {
    return this._sendTracking("midpoint");
  };

  VpaidView.prototype._onAdVideoThirdQuartile = function() {
    return this._sendTracking("thirdQuartile");
  };

  VpaidView.prototype._onAdVideoComplete = function() {
    return this._sendTracking("complete");
  };

  VpaidView.prototype._onAdClickThru = function() {
    return this._sendTracking("clickTracking");
  };

  VpaidView.prototype._onAdInteraction = function() {
    return this._sendTracking("interaction");
  };

  VpaidView.prototype._onAdUserAcceptInvitation = function() {
    return this._sendTracking("acceptInvitation");
  };

  VpaidView.prototype._onAdUserMinimize = function() {};

  VpaidView.prototype._onAdUserClose = function() {
    this._sendTracking("close");
    return this.stop();
  };

  VpaidView.prototype._onAdPaused = function() {
    return this._sendTracking("pause");
  };

  VpaidView.prototype._onAdPlaying = function() {
    return this._sendTracking("resume");
  };

  VpaidView.prototype._onAdError = function() {
    this._sendTracking("error");
    return this.stop();
  };

  VpaidView.prototype._onAdSkippableStateChange = function() {
    return this._sendTracking("skipStateChange");
  };

  VpaidView.prototype._onAdSizeChange = function() {};

  VpaidView.prototype._onAdLinearChange = function() {};

  VpaidView.prototype._onAdDurationChange = function() {
    var currDuration, currRemainingTime;
    this._sendTracking("adDurationChange");
    currDuration = this.ad.getAdDuration().toFixed(2);
    this._sendTracking("adDuration", currDuration);
    currRemainingTime = this.ad.getAdRemainingTime().toFixed(2);
    return this._sendTracking("adRemainingTime", currRemainingTime);
  };

  VpaidView.prototype._onAdExpandedChange = function() {};

  VpaidView.prototype._onAdLog = function() {};

  VpaidView.prototype._getVpaidEvents = function() {
    return {
      "AdLoaded": this._onAdLoaded,
      "AdStarted": this._onAdStarted,
      "AdStopped": this._onAdStopped,
      "AdSkipped": this._onAdSkipped,
      "AdSkippableStateChange": this._onAdSkippableStateChange,
      "AdSizeChange": this._onAdSizeChange,
      "AdLinearChange": this._onAdLinearChange,
      "AdDurationChange": this._onAdDurationChange,
      "AdExpandedChange": this._onAdExpandedChange,
      "AdVolumeChange": this._onAdVolumeChange,
      "AdImpression": this._onAdImpression,
      "AdVideoStart": this._onAdVideoStart,
      "AdVideoFirstQuartile": this._onAdVideoFirstQuartile,
      "AdVideoMidpoint": this._onAdVideoMidpoint,
      "AdVideoThirdQuartile": this._onAdVideoThirdQuartile,
      "AdVideoComplete": this._onAdVideoComplete,
      "AdClickThru": this._onAdClickThru,
      "AdInteraction": this._onAdInteraction,
      "AdUserAcceptInvitation": this._onAdUserAcceptInvitation,
      "AdUserMinimize": this._onAdUserMinimize,
      "AdUserClose": this._onAdUserClose,
      "AdPaused": this._onAdPaused,
      "AdPlaying": this._onAdPlaying,
      "AdLog": this._onAdLog,
      "AdError": this._onAdError
    };
  };

  return VpaidView;

})(admanager.view.AdView);

admanager.view.AdViews = (function(superClass) {
  var Event, Utils, VastView, VpaidView;

  extend(AdViews, superClass);

  Utils = core.common.Utils;

  Event = admanager.event.Event;

  VpaidView = admanager.view.VpaidView;

  VastView = admanager.view.VastView;

  AdViews.prototype.ads = [];

  AdViews.prototype.ad = null;

  AdViews.prototype.shown = 0;

  function AdViews(manager) {
    this.manager = manager;
    this._setupPostrolls = bind(this._setupPostrolls, this);
    this._onAdComplete = bind(this._onAdComplete, this);
    this._checkAdList = bind(this._checkAdList, this);
    this._onFirstPlay = bind(this._onFirstPlay, this);
    this.resume = bind(this.resume, this);
    this.resize = bind(this.resize, this);
    this.populate = bind(this.populate, this);
    this.video = this.manager.config.videoTag;
  }

  AdViews.prototype.populate = function(data1) {
    var IOS10C, View, data, j, len, ref, view;
    this.data = data1;
    ref = this.data;
    for (j = 0, len = ref.length; j < len; j++) {
      data = ref[j];
      if (!data.creatives) {
        this.manager.emit(Event.AD_REPORTED, {
          type: "error"
        });
        continue;
      }
      View = data.type === "VAST" ? VastView : VpaidView;
      view = new View(this.manager, data);
      this.ads.push(view);
    }
    IOS10C = navigator.userAgent.match(/(iPhone|Ipad).*([1-3]\d).*(CriOS)\/(\d*)/);
    if ((IOS10C && IOS10C.length > 3) && (IOS10C[2] > 9 && IOS10C[4] > 53)) {
      return Utils.on(this.video, "playing", this._onFirstPlay);
    }
    return Utils.on(this.video, "play", this._onFirstPlay);
  };

  AdViews.prototype.resize = function(width, height) {
    if (this.ad) {
      return this.ad.resize(width, height);
    }
  };

  AdViews.prototype.resume = function() {
    if (this.ad) {
      return this.ad.stop();
    }
  };

  AdViews.prototype._onFirstPlay = function() {
    var IOS10C;
    IOS10C = navigator.userAgent.match(/(iPhone|Ipad).*([1-3]\d).*(CriOS)\/(\d*)/);
    if ((IOS10C && IOS10C.length > 3) && (IOS10C[2] > 9 && IOS10C[4] > 53)) {
      Utils.off(this.video, "playing", this._onFirstPlay);
    } else {
      Utils.off(this.video, "play", this._onFirstPlay);
    }
    Utils.on(this.video, "timeupdate", this._checkAdList);
    this._setupPostrolls();
    return this._checkAdList();
  };

  AdViews.prototype._checkAdList = function() {
    var ad, j, len, ref, results1;
    ref = this.ads;
    results1 = [];
    for (j = 0, len = ref.length; j < len; j++) {
      ad = ref[j];
      if (ad.started || this.video.currentTime < ad.config.offset) {
        continue;
      }
      Utils.off(this.video, "timeupdate", this._checkAdList);
      Utils.off(this.video, "ended", this._onEnded);
      ad.on(Event.AD_COMPLETE, this._onAdComplete);
      ad.start();
      this.ad = ad;
      this.shown++;
      break;
    }
    return results1;
  };

  AdViews.prototype._onAdComplete = function() {
    this.ad = null;
    this._checkAdList();
    if (this.ad || this.shown === this.ads.length) {
      return;
    }
    return Utils.on(this.video, "timeupdate", this._checkAdList);
  };

  AdViews.prototype._setupPostrolls = function() {
    var ad, j, len, ref, results1;
    ref = this.ads;
    results1 = [];
    for (j = 0, len = ref.length; j < len; j++) {
      ad = ref[j];
      if (ad.config.offset === "end") {
        results1.push(ad.config.offset = this.video.duration);
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };

  return AdViews;

})(core.event.EventDispatcher);

admanager.AdManager = (function(superClass) {
  var AdModels, AdViews, Controller;

  extend(AdManager, superClass);

  AdViews = admanager.view.AdViews;

  AdModels = admanager.model.AdModels;

  Controller = admanager.controller.Controller;

  function AdManager(config1) {
    this.config = config1;
    this.resize = bind(this.resize, this);
    this.stop = bind(this.stop, this);
    AdManager.__super__.constructor.call(this);
    this.models = new AdModels(this);
    this.views = new AdViews(this);
    this.controller = new Controller(this);
  }

  AdManager.prototype.stop = function() {
    return this.views.resumeContent();
  };

  AdManager.prototype.resize = function(width, height) {
    return this.views.resize(width, height);
  };

  return AdManager;

})(core.event.EventDispatcher);

window.SizmekAdManager = admanager.AdManager;
