'use strict';

(function () {
  var SPACE = ' ';
  var ESC_KEY = 'Escape';
  var ARROW_LEFT_KEY = 'ArrowLeft';
  var ARROW_RIGHT_KEY = 'ArrowRight';
  var NUMBERS_DISMATCH = /(\D+)*[^.\d]/g;

  var setModalOpenedMode = function () {
    document.querySelector('body').classList.add('modal-open');
  };

  var setModalClosedMode = function () {
    document.querySelector('body').classList.remove('modal-open');
  };

  window.util = {
    SPACE: SPACE,
    ESC_KEY: ESC_KEY,
    ARROW_LEFT_KEY: ARROW_LEFT_KEY,
    ARROW_RIGHT_KEY: ARROW_RIGHT_KEY,
    NUMBERS_DISMATCH: NUMBERS_DISMATCH,
    setModalOpenedMode: function () {
      setModalOpenedMode();
    },
    setModalClosedMode: function () {
      setModalClosedMode();
    }
  };
})();
