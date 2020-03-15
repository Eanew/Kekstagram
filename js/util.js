'use strict';

(function () {
  var SPACE = ' ';
  var ESC_KEY = 'Escape';
  var ARROW_LEFT_KEY = 'ArrowLeft';
  var ARROW_RIGHT_KEY = 'ArrowRight';
  var NUMBERS_DISMATCH = /(\D+)*[^.\d]/g;
  var VALID_HASH_TAG_MATCH = /^#[A-Za-zА-Яа-я0-9]+/;
  var EMPTY_SPACE_MATCH = /\s+/g;

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
    VALID_HASH_TAG_MATCH: VALID_HASH_TAG_MATCH,
    EMPTY_SPACE_MATCH: EMPTY_SPACE_MATCH,
    addModalOpen: function () {
      addModalOpen();
    },
    removeModalOpen: function () {
      removeModalOpen();
    }
  };
})();
