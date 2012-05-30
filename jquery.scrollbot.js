/**
 * Scrollbot jQuery plugin.
 *
 * @author Raphaël Benitte
 * @date   2012-05-24
 */

(function($) {

  $.Scrollbot = function($target, options) {
    this.$target = $target;
    this.init(options);
  };

  /**
   * default scrollbot options
   */
  $.Scrollbot.defaults = {
           debug: false,
    bottomOffset: 0
  };

  $.Scrollbot.prototype = {

    /**
     * Initialization
     *
     * @param options
     */
    init: function(options) {

      var self    = this,
          $window = $(window);

      this.options = $.extend(true, {}, $.Scrollbot.defaults, options);
      this.active  = true;

      if (this.options.debug === true) {
        console.log('* Scrollbot ---> Scrollbot.init()');
      }

      $window.bind('scroll', function(event) {

        var    targetHeight = self.$target.height(),
            targetTopOffset = self.$target.offset().top,
               windowHeight = $window.height(),
            windowTopScroll = $window.scrollTop(),
                  maxScroll = targetHeight + targetTopOffset - windowHeight - self.options.bottomOffset;

        if (self.options.debug === true) {
          var message = '* Scrollbot state ---> active: ' + (self.active ? 'YES' : 'NO') + ' | ';
          message += 'total height: ' + targetHeight + 'px | ';
          message += 'target y position: ' + targetTopOffset + 'px | ';
          message += 'visible area height: ' + windowHeight + 'px | ';
          message += 'visible area top scroll: ' + windowTopScroll + 'px | ';
          message += 'bottom offset: ' + self.options.bottomOffset + 'px | ';
          message += 'max scroll: ' + maxScroll + 'px';
          console.log(message);
        }

        if (self.active === true && (windowTopScroll >= maxScroll)) {
          if (self.options.debug === true) {
            console.log('* Scrollbot ---> scrollbot.reached event');
          }
          self.$target.trigger({
                 type: 'scrollbot.reached',
            scrollbot: self
          });
        }
      });
    },

    /**
     * Update options
     *
     * @param options
     */
    updateOptions: function(options) {
      this.options = $.extend(true, this.options, options);
    },

    /**
     * Activate scrollbot
     */
    activate: function() {
      if (this.options.debug === true) {
        console.info('* Scrollbot ---> Scrollbot.activate()');
      }
      this.active = true;
    },

    /**
     * Deactivate scrollbot
     */
    deactivate: function() {
      if (this.options.debug === true) {
        console.log('* Scrollbot ---> Scrollbot.deactivate()');
      }
      this.active = false;
    }
  };

  /**
   * @return jQuery object
   */
  $.fn.scrollbot = function(method, options) {

    var firstArgType = typeof method;

    switch (firstArgType) {

      // calling a scrollbot method
      case 'string':
        this.each(function() {
          var scrollbotInstance = $.data(this, 'scrollbot');
          if (scrollbotInstance) {
            if ($.isFunction(scrollbotInstance[method])) {
              scrollbotInstance[method].apply(scrollbotInstance, options);
            }
          } else {
            throw "Unable to find scrollbot attached to element";
          }
        });
        break;

      // init
      case 'object':
      default:
        this.each(function() {
          var scrollbotInstance = $.data(this, 'scrollbot');
          if (scrollbotInstance) {
            // just update object options
            scrollbotInstance.updateOptions(method);
          } else {
            // unable to find binded scrollbot, create one
            $.data(this, 'scrollbot', new $.Scrollbot($(this), method));
          }
        });
        break;
    }

    return this;
  };
})(jQuery);