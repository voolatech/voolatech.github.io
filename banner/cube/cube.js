function Cube(options) {

  var faces = document.querySelectorAll('.face'), 
  nunOfFace = 6, 
  styles = [], 
  isDrag = false, 
  currentPoint, 
  currentAngle, 
  upAngle, 
  perspective = 'perspective(800px) ',
  rotateTween = null,

  width = 300, 
  height = 250, 
  isVertical = false, 
  autoRotate = true,
  autoRotateDelay = 5,
  autoRotateTime = 2,
  autoRotateLeft = true,
  autoRotateTop = true,
  links;
  
  var cube = document.getElementById('banner');

  parse(options);
  init();
  addEvents();

  if (autoRotate) {
    rotate(0);
  }

  function parse(options) {
    width = options.width;
    height = options.height;
    isVertical = options.vertical;
    autoRotate = options.autoRotate;
    autoRotateDelay = options.autoRotateDelay;
    autoRotateTime = options.autoRotateTime;
    autoRotateLeft = options.autoRotateLeft,
    autoRotateTop = options.autoRotateTop,
    links = options.faces;
  }

  function init() {
    
    var transform;
    styles = [];
    for (var i = 0; i < nunOfFace; i++) {
      transform = i < 4 ? 'rotateY(' + i * 90 + 'deg)' : 'rotateX(' + Math.pow(-1, i) * 90 + 'deg)';
      if (i == 2) {
        transform = isVertical ? 'rotateX(180deg) rotateY(0deg)' : 'rotateX(0deg) rotateY(180deg)';
      }
      transform = transform + ' translateZ(' + (i < 4 ? width / 2 : height / 2) + 'px)';
      faces[i].style.marginLeft = -width / 2 + 'px';
      faces[i].style.marginTop = -(i < 4 ? height / 2 : width / 2) + 'px';
      faces[i].style.width = width + 'px';
      faces[i].style.height = (i < 4 ? height : width) + 'px';
      faces[i].style.transform = faces[i].style.webkitTransform = perspective + transform;
      styles.push(transform);
    }

    for (var i = 0; i < links.length; i ++) {
      setFaceData(links[i]);
    }
  }

  function setFaceData(objFace) {
    var face = objFace.face;

    var divFace = document.querySelectorAll('.' + face)[0];
    divFace.setAttribute('data-clickTag', objFace.clickTag);
    divFace.setAttribute('data-type', objFace.type);

    var banner;
    if (objFace.type.toLowerCase() == 'banner') {
      banner = document.createElement('iframe');
    }
    else if (objFace.type.toLowerCase() == 'video') {
      banner = document.createElement('video');
    } 
    else {
      banner = document.createElement('img');
    }  
    banner.setAttribute('src', objFace.link);
    banner.setAttribute('width', parseInt(divFace.style.width));
    banner.setAttribute('height', parseInt(divFace.style.height));
    divFace.insertBefore(banner, divFace.childNodes[0]);
  }

  function resetFaces() {
    var transform;
    for (var i = 0; i < nunOfFace; i++) {
      transform = faces[i].style.transform || faces[i].style.webkitTransform;
      styles[i] = transform.replace(perspective, '');
    }    
  }

  function updateFaces(angle) {
    var transform;
    for (var i = 0; i < nunOfFace; i++) {
      transform = (isVertical ? 'rotateX(' + angle + 'deg)' : 'rotateY(' + angle + 'deg)') + styles[i];
      faces[i].style.transform = faces[i].style.webkitTransform = perspective + transform;
    }
  }

  function addEvents() {

    cube.addEventListener('touchstart', function(evt){
      isDrag = true;

      var touch = evt.targetTouches[0];
      currentPoint = {'x': touch.clientX, 'y': touch.clientY};

      window.addEventListener('touchmove', onTouchMoveHandler, false);
    }, false);
      
    cube.addEventListener('mousedown', function (evt) {
      if (rotateTween) {
        rotateTween.kill();
        rotateTween = null;
      }

      isDrag = true;
      currentPoint = {'x': evt.clientX, 'y': evt.clientY};

      window.addEventListener('mousemove', onMouseMoveHandler, false);
    }, false);

    cube.addEventListener('click', function (evt) {
      onClickCubeHandler(evt.clientX, evt.clientY, evt.path);
    }, false);

    window.addEventListener('mouseup', onMouseUpHandler, false);
    window.addEventListener('touchend', onTouchEndHandler, false);
  }

  function onMouseUpHandler(evt) {
    window.removeEventListener('mousemove', onMouseMoveHandler, false);
    onUpHandler(evt.clientX, evt.clientY);
  }

  function onTouchEndHandler(evt) {
    window.removeEventListener('touchmove', onTouchMoveHandler, false);
    var touch = evt.changedTouches[0];
    onUpHandler(touch.clientX, touch.clientY);
  }

  function onUpHandler(x, y) {
    if (currentPoint.x == x && currentPoint.y == y) {
      isDrag = false;
      return;
    }

    if (isDrag && currentAngle != upAngle) {
      var obj = { angle: currentAngle };
      TweenMax.to(obj, 0.3, {
        angle: upAngle,
        onUpdate: function () {
          updateFaces(obj.angle);
        },
        onComplete: function () {
          resetFaces();
        }
      });
    }
    isDrag = false;
  }

  function onMouseMoveHandler(evt) {
    onMoveHandler(evt.clientX, evt.clientY);
  };

  function onTouchMoveHandler(evt) {
    var touch = evt.targetTouches[0];
    onMoveHandler(touch.clientX, touch.clientY);
  };

  function onMoveHandler(x, y) {
    var nextPoint = {
      'x': x - currentPoint.x,
      'y': y - currentPoint.y
    };
    var angle = {
      'x': -nextPoint.y / 2,
      'y': nextPoint.x / 2
    };
    updateFaces(isVertical ? angle.x : angle.y);
    currentAngle = isVertical ? angle.x : angle.y;
    var piece = currentAngle % 90;
    if (Math.abs(piece) >= 45) {
      upAngle = piece > 0 ? currentAngle + 90 - piece : currentAngle - 90 - piece;
    } else {
      upAngle = currentAngle - piece;
    }
  };

  function onClickCubeHandler(x, y, path) {
    if (currentPoint.x == x && currentPoint.y == y) {

      var face;
      for (var i = 0; i < path.length; i ++) {
        face = path[i];
        if (face.className.indexOf('face') != -1) {
          
          var clickTag = face.getAttribute('data-clickTag');
          var type = face.getAttribute('data-type');
          
          if (type.toLowerCase() == 'video') {
            var video;
            var children = face.children;

            for(var i = 0; i < children.length; i++){
              if (children[i].tagName.toLowerCase() == "video") {
                  video = children[i];
                  break;
              }
            } 

            if (video) {
              
              var isPlay = face.getAttribute('data-play');

              if (isPlay) {
                if (clickTag) {
                  window.open(clickTag, '_blank');
                }
              } else {
                face.setAttribute('data-play', true);
                video.play();
                
              }
              return;
            }
          }


          if (clickTag) {
            window.open(clickTag, '_blank');
          }

          return;
        }
      }
    }
  };

  function rotate(fromAngle) {
    var obj = { angle: fromAngle };

    var toAngle = fromAngle;

    if (!isVertical) {
      toAngle = autoRotateLeft ? toAngle + 90 : toAngle - 90;
    } else {
      toAngle = autoRotateTop ? toAngle - 90 : toAngle + 90;
    }

    rotateTween = TweenMax.to(obj, autoRotateTime, {
      delay: autoRotateDelay,
      angle: toAngle,
      onUpdate: function () {
        updateFaces(obj.angle);
      },
      onComplete: function () {
        //resetFaces();
        rotate(toAngle);
      }
    });
  }
}
