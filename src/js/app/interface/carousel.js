import gsap from 'gsap';

export default function(config) {

  var self = this,
      $el = $('.carousel'),
      $ul = $('ul', $el),
      current = $('li.is-active').index(),
      total = $('li', $el).length,
      ease = 'power1.out',
      positionMax = 4,
      previous = current - 1,
      speed = 1.65,
      direction = 'down'; // up | down

  function init() {
    bind();
    resize();

    return {
      ready: ready,
      rotate: rotate,
      refresh: refresh,
      setWidth: setWidth,
    };
  }

  function bind() {
    $(window).on('resize', resize);
  }

  function ready() {
    gsap.set(rotate, {
      delay: 0,
      onRepeat: rotate,
      repeat: -1,
      repeatDelay: speed
    });
  }

  function rotate() {
    rotatePhrase();
  }

  function rotatePhrase() {
    previous = current;

    if (direction === 'up') {
      if (current === total - 1) {
        previous = current;
        current = 0;
      } else {
        current++;
      }
    } else if (direction === 'down') {
      if (current === 0) {
        previous = current;
        current = total - 1;
      } else {
        current--;
      }
    }

    refresh();
  }

  function refresh() {
    var $phraseCurr = $('li', $ul).eq(current),
        $phrasePrev = $('li', $el).eq(previous),
        widthCurr = $('.table-cell', $phraseCurr).width(),
        widthPrev = $('.table-cell', $phrasePrev).width();

    animateWidth(widthCurr, widthPrev);

    gsap.to($phrasePrev, 0.4, {
      ease: config.ease.cubic.back,
      y: (direction === 'up') ? -10 : 10,
      rotateX: (direction === 'up') ? '45deg' : '-45deg',
      onComplete: function() {
        animatePhrases();
      }
    });
  }

  function animatePhrases() {
    $('li', $ul).each(function(index) {
      animatePhrase($(this), index);
    });
  }

  function animatePhrase($phrase, index, animate) {
    var position = (index - current), 
        y = position * parseInt($phrase.css('margin-bottom'), 10),
        opacity = 1 - (Math.abs(position) / positionMax),
        rotateX = (Math.abs(position) / positionMax),
        ease = config.ease.back.out,
        duration = 0.4;

    // console.log($phrase.text(), index, position, y);

    opacity = opacity !== 1 ? opacity * 0.25 : 1;
    rotateX = rotateX !== 1 ? (rotateX * 0.15) * 360 : 0;

    if (config.breakpoint.current === 'mini') {
      if (position > 0) {
        opacity = 0;
      }

      if (direction === 'down' && position === 1) {
        y = 10;
        duration = 0.2;
      }
    }

    if (typeof animate === 'undefined' || animate === true) {
      gsap.to($phrase, duration, {
        opacity: opacity,
        y: y,
        rotateX: 0,
        // rotateX: rotateX + 'deg',
        ease: (index === current) ? ease : 'expo.out',
        onComplete: function() {
          if (direction === 'up' && position === -positionMax) {
            shiftPhrase($phrase);
          } else if (direction === 'down' && position === positionMax) {
            shiftPhrase($phrase);
          }
        }
      });
    } else if (animate === false) {
      gsap.set($phrase, {
        opacity: opacity,
        y: y,
        rotateX: 0,
      });
    }
  }

  function animateWidth(widthCurr, widthPrev) {
    gsap.to($('.cell-phrase'), 0.5, {
      minWidth: widthCurr,
      ease:  widthCurr > widthPrev ? 'expo.out' : 'expo.in',
      delay: widthCurr > widthPrev ? 0 : 0.4,
    });
  }

  function setWidth(width) {
    gsap.set($('.cell-phrase'), {
      minWidth: width,
    });
  }

  function shiftPhrase($phrase) {
    var y;

    if (direction === 'up') {
      $phrase.appendTo($ul);

      y = ((total) - current) * parseInt($phrase.css('margin-bottom'), 10);
      current--;
    } else if (direction === 'down') {
      $phrase.prependTo($ul);

      y = -positionMax * parseInt($phrase.css('margin-bottom'), 10);
      current++;
    }

    gsap.set($phrase, {
      y: y,
    });
  }

  function resize() {
    if (config.breakpoint.current === 'mini') {
      positionMax = 4;
    } else {
      positionMax = 4;
    }

    if (config.loaded === true) {
      $('li', $ul).each(function(index) {
        animatePhrase($(this), index, false);
      });

      var $phraseCurr = $('li', $ul).eq(current),
          widthCurr = $('.table-cell', $phraseCurr).width();

      setWidth(widthCurr);
    }
  }

  return init();

};