import gsap from 'gsap';
import CustomEase from './../plugins/gsap.customease.js';

import moduleCta from './interface/cta';
import moduleCarousel from './interface/carousel';
import moduleIntro from './interface/intro';

export default function() {
  var self = this,
      config = {
        loaded: false,
        env: $('meta[name="app:env"]').attr('content'),
        mode: $('meta[name="app:mode"]').attr('content'),
        fixedWidth: true,
        breakpoint: {
          current: false,
          sizes: {
            mini: 568,
          }
        },
        ease: {
          cubic: {},
          back: {
            out: 'back.out(1.2)',
          }
        },
        utils: {},
      },
      cta,
      intro,
      carousel,
      timerResize;

  function init() {
    bind();
    prepare();
    resize();
    ready();

    return self;
  }

  function bind() {
    $(window).on('resize', resize);
  }

  function prepare() {
    gsap.registerPlugin(CustomEase)
    config.ease.cubic.back = CustomEase.create('custom', 'M0,0 C0.1,-0.5 1,-1 1,1');

    config.utils.refreshWidth = refreshWidth;
  }

  function ready() {
    cta = new moduleCta(config);
    carousel = new moduleCarousel(config);
    intro = new moduleIntro(config, carousel);
  }

  function resize() {
    getBreakpoint();

    clearInterval(timerResize);

    timerResize = setTimeout(function() {
      if (config.loaded === true) {
        refreshWidth();
      }
    }, 100);
  }

  function getBreakpoint() {
    for (var i in config.breakpoint.sizes) {
      if ($(window).width() <= config.breakpoint.sizes[i]) {
        config.breakpoint.current = i; return;
      }
    }

    config.breakpoint.current = false;
  }

  function refreshWidth() {
    if (config.fixedWidth === true) {
      var width = getWidth();

      if (config.breakpoint.current !== 'mini') {
        $('.carousel').css('width',width + 'px');
      } else {
        $('.carousel').css('width','');
      }
    }
  }

  function getWidth() {
    var elements = [
          // $('.carousel .cell-prefix'),
          // $('.carousel .cell-space-1'),
          $('.carousel .placeholder'),
          $('.carousel .cell-space-2'),
          $('.carousel .cell-suffix'),
          $('.carousel .cell-caret'),
        ],
        width = 0;

    for (var i in elements) {
      width += $(elements[i]).outerWidth();
    }

    return width;
  }

  return init();
};