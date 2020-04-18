'use strict';

(function () {
  window.debounce = function (callback, interval) {
    var lastTimeout;
    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback.apply({}, parameters);
      }, interval);
    };
  };
})();
