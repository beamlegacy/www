/*! overwriter.jquery v0.1.0 | created by Matthew Govaere */
(function($) {

  var overwriter = function(el, options, index, queue) {
    var self = this,
        defaults = {
          text: $(el).text().trim(),
          delay: 0.1,
          delayChar: 0,
          separate: true,
          async: true,
          onStart: false,
          onComplete: false,
        },
        count = 0,
        next = false,
        transitioning = false,
        originalText,
        originalLength,
        currentLength,
        newLength,
        maximum,
        minimum,
        ready = false,
        opts = {};

    this.init = function(options) {
      $(el).data('overwriter', self);

      this.load(options);

      return { el: el, self: self };
    };

    this.load = function(options, nexted) {
      if (typeof nexted !== 'undefined' && nexted === true) {
        next = false;
      }

      if (transitioning === false) {
        transitioning = true;
        opts = options;

        setup();

        if (opts.separate === true) {
          ready = true;
        } else {
          if (opts.async === true || index === 0) {
            ready = true;
          }
        }

        originalText = $(el).text().trim();
        originalLength = originalText.length;
        currentLength = ($('span', el).length > 0) ? $('span', el).length : originalLength;
        newLength = opts.text.length;
        maximum = (currentLength > newLength) ? currentLength : newLength;
        minimum = (currentLength > newLength) ? newLength : currentLength;

        if (opts.separate === true) {
          prepareText();
          loadText();
        } else {
          if (ready === true) {
            
            loadTextBasic();

          } else {
            $(el).html('');
            setTimeout(function() {
              self.start = loadTextBasic;
            }, opts.delay * 1000);
          }
        }
      } else {
        next = options;
      }
    };

    var setup = function() {
      opts = opts || {};

      for (var k in defaults) {
        if (typeof opts[k] === 'undefined') {
          opts[k] = defaults[k];
        }
      }
    };

    var createText = function($span, value, count, append, remove) {
      setTimeout(function() {
        $span.html(value);

        if (typeof append !== 'undefined' && append == true) {
          $(el).append($span);
        } else if (typeof remove !== 'undefined' && remove == true) {
          $span.remove();
        }

        if (count === maximum - 1) {
          transitioning = false;

          if (next !== false) {
            self.load(next, true);
          }
        }
      }, count * opts.delayChar * 1000);
    };

    var prepareText = function() {
        $(el).html('');

        for (var i = 0; i < originalText.length; i++) {
          if (opts.separate === true) {
            var value = (originalText[i] === ' ') ? '&nbsp;' : originalText[i],
                $span = $('<span>' + value + '</span>');
          } else {
            var value = (originalText[i] === ' ') ? '&nbsp;' : originalText[i],
                $span = $('<span>' + value + '</span>');
          }

          $(el).append($span);
        }
    };

    var loadText = function() {
      for (var i = 0; i < maximum; i++) {
        var $current,
            append = false,
            remove = false,
            value = (opts.text[i] === ' ') ? '&nbsp;' : opts.text[i];

        if (i < minimum) {
          if ($('span', el)[i]) {
            $current = $($('span', el)[i]);
          } else {
            $current = $('<span></span>');
            append = true;
          }
        } else {
          if ($('span', el)[i]) {
            $current = $($('span', el)[i]);
            remove = true;
          } else {
            $current = $('<span></span>');
            append = true;
          }
        }

        createText($current, value, i, append, remove);
      }
    };

    var loadTextBasic = function() {
      var text = '';

      $(el).html('');

      setTimeout(function() {
        if (opts.onStart !== false) {
          opts.onStart();
        }
        for (var i = 0; i < maximum; i++) {
          var $current,
              append = false,
              remove = false,
              value = (opts.text[i] === ' ') ? ' ' : opts.text[i];

          text += value;

          createTextBasic($current, text, i, append, remove, maximum);
        }
      }, opts.delay * 1000);
    };

    var createTextBasic = function($span, value, count, append, remove, maximum) {
      var totalTime = opts.time * 1000;

      setTimeout(function() {
        $(el).html(value);

        if (count === maximum - 1) {
          transitioning = false;

          if (next !== false) {
            self.load(next, true);
          }
        }

        if (count === maximum - 1) {
          if (opts.async === false) {
            if (index + 1 < queue.length) {
              queue[index+1].start();
            } else if (opts.onComplete !== false) {
              opts.onComplete();
            }
          } else {
            if (opts.onComplete !== false) {
              opts.onComplete();
            }
          }
        }
      }, count * ((totalTime / maximum)) );
    };

    return this.init(options);
  };

  $.fn.overwriter = function(opts) {
    var queue = [];

    return this.each(function(index) {
      var elOpts = $.extend({}, opts);

      if ($(this).data('overwriter')) {
        $(this).data('overwriter').load(elOpts);
      } else {
        var obj = new overwriter(this, elOpts, index, queue);
        queue.push(obj.self);
      }
    });
  };

})(jQuery);