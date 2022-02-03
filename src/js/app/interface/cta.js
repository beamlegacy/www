import gsap from 'gsap';

export default function(config) {

  var self = this,
      $el = $('.cta'),
      $message = $('.cta-message', $el),
      $form = $('.cta-form', $el),
      $input = $('input', $form),
      $success = $('.cta-success', $el),
      $error = $('.cta-error', $el),
      $actionClose = $('.action.btn-close', $el),
      $actionSubmit = $('.action.btn-submit', $el),
      $actionLoading = $('.action.loader', $el),
      $signin = $('.signin'),
      currentStep = 'message',
      previousStep = false,
      currentAction = 'close',
      shaking = false,
      steps = {
        'message': $message,
        'form': $form,
        'success': $success,
        'error': $error,
      },
      actions = {
        'close': $actionClose,
        'submit': $actionSubmit,
        'loading': $actionLoading,
      };

  function init() {
    bind();
    resize();
  }

  function bind() {
    $('.btn-join', $el).on('click', function() {
      toggleStep('form');
    });

    $('.btn-close', $el).on('click', function() {
      toggleStep('message');
    });

    $('.btn-submit', $el).on('click', function() {
      submitForm();
    });

    $input.on('keyup', function(e) {
      var validEmail = validate($input.val());

      if (validEmail && currentAction === 'close') {
        toggleAction('submit');
        $('.input', $el).addClass('is-active');
      } else if (!validEmail && currentAction === 'submit') {
        toggleAction('close');
        $('.input', $el).removeClass('is-active');
      }

      if (e.keyCode === 13) {
        submitForm();
      } else if (e.keyCode === 27) {
        toggleStep('message', reset);
      }
    });

    $(window).on('resize', resize);
  }

  function toggleStep(step, callback) {
    if (step !== currentStep) {
      var $nextStep = steps[step],
          $prevStep = steps[currentStep];

      previousStep = currentStep;
      currentStep = step;

      if (previousStep === 'message') {
        if (config.breakpoint.current === 'mini') {
          $('.cell-body .cta').height($('.cell-body .cta .cta-message').height());
        }
      }

      gsap.set($nextStep, {
        y: 10,
        opacity: 0,
        rotateX: '25deg',
      });

      // $prevStep.css('position', 'absolute');

      gsap.to($prevStep, 0.4, {
        y: -10,
        rotateX: '25deg',
        ease: config.ease.cubic.back,
        onComplete: function() {
          gsap.set($prevStep, {
            y: 10,
            opacity: 0,
            rotateX: 0,
            ease: 'expo.out',
            onComplete: function() {
              $prevStep.hide();
            }
          });

          // $nextStep.css('position', 'absolute');
          $nextStep.show();

          // Should the button be inline, this code animates its position to account
          // for the form step width
          // ---
          // const distance = $nextStep.width() - $prevStep.width()
          // gsap.set($signin, {
          //   x: distance,
          //   ease: config.ease.back.out,
          //   onComplete: function() {
          //     gsap.to($signin, 0.4, {
          //       x: 0,
          //       ease: config.ease.back.out
          //     });
          //   }
          // });

          gsap.to($nextStep, 0.4, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            ease: config.ease.back.out,
            onComplete: function() {
              // $nextStep.css('position', '');

              if (typeof callback !== 'undefined') {
                callback();
              }
            }
          });
        }
      });
    }
  }

  function toggleAction(action) {
    if (action !== currentAction) {
      var $nextAction = actions[action],
          $prevAction = actions[currentAction];

      currentAction = action;

      gsap.set($nextAction, {
        y: 10,
        opacity: 0,
        rotateX: '25deg',
      });

      $prevAction.css('position', 'absolute');

      gsap.to($prevAction, 0.4, {
        y: -10,
        rotateX: '25deg',
        ease: config.ease.cubic.back,
        onComplete: function() {
          gsap.set($prevAction, {
            y: 10,
            opacity: 0,
            rotateX: 0,
            ease: 'expo.out',
            onComplete: function() {
              $prevAction.hide();
            }
          });

          $nextAction.css('position', 'absolute');
          $nextAction.show();

          gsap.to($nextAction, 0.4, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            ease: config.ease.back.out,
            onComplete: function() {
              $nextAction.css('position', '');
            }
          });
        }
      });
    }
  }

  function submitForm() {
    var email = $input.val();

    if (email === '' || !validate(email)) {
      if (shaking === false) {
        shaking = true;

        $input.shake({
          distance: 2,
          callback: function() {
            shaking = false;
          }
        });
      }
    } else {
      toggleAction('loading');

      setTimeout(function() {
        if (config.env === 'production') {
          sendRequest(email);
        } else if (config.env === 'staging') {
          sendRequest(email);
        } else {
          success();
        }
      }, 1500);
    }
  }

  function sendRequest(email) {
    $.ajax({
      url: 'https://api.beamapp.co/api/v1/emails',
      type: 'POST',
      data: JSON.stringify({
        email: email,
      }),
      dataType: 'json',
      contentType: 'application/json',
      crossDomain: true,
      success: function(data, textStatus, jQxhr) {
        success();
      },
      error: function(jqXhr, textStatus, errorThrown) {
        error();
      }
    });

    generateSecureSubscribeLink(email);
  }

  function generateSecureSubscribeLink(email) {
    return fetch('https://createsend.com//t/getsecuresubscribelink', {
      method: 'POST',
      body: new URLSearchParams({
        email: email,
        data: '2BE4EF332AA2E32596E38B640E90561943B7209F892F8B9FEEDA29EC0ADCD1A97FB4D140E71DAED8BD8055A91B5C943EF17A6DA263A0A43CA53C175E28C9C6CF',
      }),
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
    .then(function(response) {
      return response.text();
    })
    .then(function (url) {
      submitEmail(url, email);
    })
    .catch(function(error) {

    });
  }

  function submitEmail(secureUrl, email) {
    return fetch(secureUrl, {
      method: 'POST',
      body: new URLSearchParams({
        'cm-ykdjjuh-ykdjjuh': email,
      }),
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
    .then(function(response) {

    })
    .catch(function(error) {

    });
  }

  function success() {
    toggleStep('success');

    setTimeout(function() {
      toggleStep('message', reset);
    }, 4000);
  }

  function error() {
    toggleStep('error');

    setTimeout(function() {
      toggleStep('message', reset);
    }, 4000);
  }

  function reset() {
    $input.val('');
    $('.input', $el).removeClass('is-active');
    toggleAction('close');
  }

  function validate(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function resize() {
    if (config.breakpoint.current === 'mini') {
      if ($('.cell-header .signin').length === 1) {
        $('.cell-header .signin').prependTo($('.cell-footer'));
      }
      if ($('.cell-header .cta').length === 1) {
        $('.cell-header .cta').prependTo($('.cell-footer'));
      }
    } else {
      if ($('.cell-footer .cta').length === 1) {
        $('.cell-footer .cta').appendTo($('.cell-header .cell-cta'));
      }
      if ($('.cell-footer .signin').length === 1) {
        $('.cell-footer .signin').appendTo($('.cell-header .cell-cta'));
      }
    }

    if (config.breakpoint.current === 'mini') {
      $el.height($('.cell-footer .cta .cta-message').height());
    } else {
      $el.css('height', '');
    }
  }

  return init();

}