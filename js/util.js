'use strict';

(function () {
  var SPACE = ' ';
  var ESC_KEY = 'Escape';
  var ARROW_LEFT_KEY = 'ArrowLeft';
  var ARROW_RIGHT_KEY = 'ArrowRight';
  var NUMBERS_DISMATCH = /(\D+)*[^.\d]/g;

  var addModalOpen = function () {
    document.querySelector('body').classList.add('modal-open');
  };

  var removeModalOpen = function () {
    document.querySelector('body').classList.remove('modal-open');
  };

  window.util = {
    SPACE: SPACE,
    ESC_KEY: ESC_KEY,
    ARROW_LEFT_KEY: ARROW_LEFT_KEY,
    ARROW_RIGHT_KEY: ARROW_RIGHT_KEY,
    NUMBERS_DISMATCH: NUMBERS_DISMATCH,
    addModalOpen: function () {
      addModalOpen();
    },
    removeModalOpen: function () {
      removeModalOpen();
    }
  };
})();
