import gsap from 'gsap';

export default function(config, carousel) {

  var self = this;

  function init() {
    ready();
  }

  function ready() {
    animateHeading();
  }

  function animateHeading() {
    var delay = 2;

    $('.cell-icon').hide();
    $('.beta').hide();
    $('.cell-logo').css('opacity', 1)

    setTimeout(function() {
      $('.cell-icon').show();
    }, 1250);

    $('.cell-logo h1').overwriter({
      delay: delay,
      time: 0.35,
      separate: false,
      async: false,
      onStart: function() {
        $('.caret').addClass('is-typing');
      },
      onComplete: function() {
        setTimeout(function() {
          $('.beta').show();

          setTimeout(function() {
            setTimeout(function() {
              $('.caret').removeClass('is-typing');
            }, 250);

            setTimeout(function() {
              $('.caret').appendTo($('.cell-break-1 .cell-caret'));
              $('.caret').addClass('is-typing');

              setTimeout(function() {
                $('.caret').removeClass('is-typing');
              }, 500);
            }, 500);
          }, 250);
        }, 250);
      }
    });

    delay += 2;

    animateTagline(delay);
  }

  function animateTagline(delay) {
    $('.cell-phrase li.is-active .table-cell, .placeholder span').overwriter({
      delay: delay,
      time: 0.3,
      separate: false,
      async: true,
      onComplete: function() {
        $('.caret').appendTo($('.cell-break-2 .cell-caret'));
        $('.caret').removeClass('is-typing');
      }
    });

    carousel.refresh();

    delay += 1.5;

    $('.cell-suffix').overwriter({
      delay: delay,
      time: 1,
      separate: false,
      async: false,
      onStart: function() {
        $('.cell-space-2').show();
        carousel.setWidth($('.placeholder span').width());
        $('.placeholder').addClass('is-done');
        $('.caret').addClass('is-typing');
      },
      onComplete: function() {
        config.loaded = true;
        config.utils.refreshWidth();
        $('.caret').removeClass('is-typing');
        $('.caret').remove();
        animatePhrases()
      }
    });
  }

  function animatePhrases() {
    gsap.to($('.bar'), 1, {
      delay: 1,
      width: '100%',
      ease: 'power1.out',
      onComplete: function() {
        gsap.to($('.bar'), 0.4, {
          borderRadius: 0,
          ease: 'power1.out',
        });
      }
    });

    gsap.set($('.phrases li:not(.is-active) .table-cell'), {
      opacity: 0,
    });

    $('.phrases li').css('visibility', 'visible');

    $('.phrases li:not(.is-active)').each(function(index) {
      var $phrase = $(this);
      (function($phrase, index) {
        gsap.to($('.table-cell', $phrase), 0.3, {
          delay: (index * 0.1) + 1,
          opacity: 1,
          onComplete: function() {
            if (index === 0) {
              carousel.ready();

              setTimeout(function() {
                animateCTAs();
              }, 500);
            }
          }
        });
      })($phrase, index);
    });
  }

  function animateCTAs() {
    var delay = 0,
        ease = config.ease.back.out;

    gsap.set($('.soon, .btn-join, .footer'), {
      y: 10,
      opacity: 0,
      rotateX: '25deg',
    });

    $('.soon, .btn-join, .footer').css('visibility', 'visible');

    gsap.to($('.btn-join'), 0.6, {
      delay: delay,
      ease: ease,
      y: 0,
      opacity: 1,
      rotateX: 0,
    });

    delay += 0.2;

    gsap.to($('.footer'), 0.5, {
      delay: delay,
      ease: ease,
      y: 0,
      opacity: 1,
      rotateX: 0,
    });
  }

  return init();

}