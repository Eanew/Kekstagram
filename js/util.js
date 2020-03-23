'use strict';

(function () {
  var SPACE = ' ';
  var ESC_KEY = 'Escape';
  var ARROW_LEFT_KEY = 'ArrowLeft';
  var ARROW_RIGHT_KEY = 'ArrowRight';
  var NUMBERS_DISMATCH = /(\D+)*[^.\d]/g;
  var EMPTY_SPACE_MATCH = /\s+/g;

  var setModalOpenedMode = function () {
    document.querySelector('body').classList.add('modal-open');
  };

  var setModalClosedMode = function () {
    document.querySelector('body').classList.remove('modal-open');
  };

  var showErrorAlert = function (alert) {
    var message = document.createElement('div');
    message.textContent = alert;
    message.style.position = 'absolute';
    message.style.background = 'orange';
    message.style.fontSize = '20px';
    message.style.textAlign = 'center';
    message.style.padding = '15px';
    message.style.left = '0';
    message.style.right = '0';
    message.style.zIndex = '500';
    document.body.insertAdjacentElement('afterbegin', message);
    window.setTimeout(function () {
      message.remove();
    }, 3000);
  };

  window.util = {
    SPACE: SPACE,
    ESC_KEY: ESC_KEY,
    ARROW_LEFT_KEY: ARROW_LEFT_KEY,
    ARROW_RIGHT_KEY: ARROW_RIGHT_KEY,
    NUMBERS_DISMATCH: NUMBERS_DISMATCH,
    EMPTY_SPACE_MATCH: EMPTY_SPACE_MATCH,
    setModalOpenedMode: setModalOpenedMode,
    setModalClosedMode: setModalClosedMode,
    showErrorAlert: showErrorAlert
  };
})();
