(function($) {
  var _seed;
  var _name;
  var _alternative;
  var _bucket;
  var _dev;
  var _DEV_REGEX = /#!dev/;
  var _COOKIE_NAME = '_sparkab_seed';

  function _getBucket(buckets) {
    var seed;
    if (!_dev) {
      if (!_seed) {
        _seed = _makeSeed();
      }
      seed = _seed;
    } else {
      seed = Math.random() * 999;
    }
    return Math.floor(seed % buckets);
  }

  function _makeSeed() {
    var seed = _readCookie(_COOKIE_NAME);
    if (!seed) {
      seed = Math.random() * 999;
      _setCookie(_COOKIE_NAME, seed, 30);
    }
    return seed;
  }

  function _setCookie(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }

  /**
   * Reads a cookie.
   * @param {string} name The cookie's name.
   * @return {string|number} The cookie's value.
   * @private
   */
  function _readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  /**
   * Display the alternative.
   * @param {jQuery} $obj The jQuery object.
   * @private
   */
  function _display($obj) {
    if (_alternative['alternative']) {
      var alternative = _alternative['alternative'];
      if (typeof alternative === 'string') {
        // display the text alternative
        $obj.text(alternative);
      } else if (typeof alternative === 'function') {
        // execute the alternative function
        alternative($obj);
      }
    }
  }

  /**
   * Sets a Google Analytics' custom variable.
   * @param {string} slot The slot.
   * @param {string} name The name (or key) of the custom var.
   * @param {string} value The value of the custom var.
   * @param {Object} options Additional options.
   * @private
   */
  function _trackCustomVar(slot, name, value, options) {
    var scope = options['scope'] || 3;
    _setCookie(name, value, 30);
    _log(name + "<--" + value + "=+");
    window['_gaq'].push(['_setCustomVar',
        slot,
        name,
        value,
        scope
      ]);
  }

  /**
   * Sets a Google Analytics' event.
   * Please note that the default value of the event's parameter 'non interaction'
   * is usually false. Here, the default value is true because A/B tests should
   * not affect the bounce rate.
   * @param {string} category The category.
   * @param {string} action The action.
   * @param {Object} options Additional options.
   * @private
   */
  function _trackEvent(category, action, options) {
    var label = options['event-label'] || undefined,
        value = options['event-value'] || undefined,
        noninteraction = ['event-noninteraction'] || true;
    window['_gaq'].push(['_trackEvent',
        category,
        action,
        label,
        value,
        noninteraction
      ]);
  }

  /**
   * Logs a message.
   * @param {string} msg The message that will be logged.
   * @private
   */
  function _log(msg) {
    if (typeof window['console'] !== 'undefined'
      && typeof msg === 'string') {
      return window['console']['log'](msg);
    }
  }

  /**
   * Tracks the test using Google Analytics.
   * @param {Object} options The options.
   * @private
   */
  function _track(options) {
    // checks if the GA variable has been initialised
    if (typeof window['_gaq'] !== 'undefined') {
      var value = '',
          slot = options['slot'];
      if (_bucket !== 0) {
        // alternative
        value = _alternative['value'] || 'alternative' + _bucket;
      } else {
        // default
        value = options['default-value'] || 'default';
      }
      if (_dev) {
        // dev mode: only logs the information about the events or custom vars
        if (slot) {
          _log(_name + ' : ' + value + ' (custom var ' + slot + ')');
        } else {
          _log(_name + ' : ' + value + ' (event)');
        }
      } else if (slot) {
        // tracks a custom variable if a slot has been specified
        _trackCustomVar(slot, _name, value, options);
      } else {
        // tracks an event
       _trackEvent(_name, value, options);
      }
    }
  }

  /**
   * @param {Object} options The options.
   */
  $.fn.sparkab = function(options) {
    if (!options
        || typeof options !== 'object'
        || !navigator.cookieEnabled) {
      return this;
    } else {
      _name = options['name'];
      if (_name && options['alternatives']) {
          _dev = _DEV_REGEX.test(window.location);
          _bucket = _getBucket(options['alternatives'].length + 1);
          if (_bucket !== 0) {
            _alternative = options['alternatives'][_bucket - 1];
          }
          _track(options);
      }
      return this.each(function() {
        var $this = $(this);
        if (_bucket !== 0) {
          _display($this);
        }
      });
    }
  };
// works both with Zepto and jQuery !
})(window['jQuery'] || window['Zepto']);
