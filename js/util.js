'use strict';

(function () {
  var PERCENT_PROPORTION_COUNT = 100;
  var SPACE = ' ';

  var Key = {
    SPACE: ' ',
    ESC: 'Escape',
    ENTER: 'Enter',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight'
  };

  var Regular = {
    EXCEPT_NUMBERS: /(\D+)*[^.\d]/g,
    FIRST_NUMBER: /\d+/,
    EMPTY_SPACE: /\s+/g,
    EMPTY_SPACE_IN_EDGES: /^\s+|\s+(?!.)/g,
    VALID_HASH_TAG: /^#[A-Za-zА-Яа-я0-9]+/
  };

  var isEscEvent = function (evt, action) {
    if (evt.key === Key.ESC) {
      action();
    }
  };

  var setModalOpenedMode = function () {
    document.querySelector('body').classList.add('modal-open');
  };

  var setModalClosedMode = function () {
    document.querySelector('body').classList.remove('modal-open');
  };

  var disableInput = function (input, label) {
    input.disabled = true;
    label.style.opacity = '0.4';
  };

  var enableInput = function (input, label) {
    input.disabled = false;
    label.style.opacity = '';
  };

  var showAlert = function (alert, color, timeout) {
    var message = document.createElement('div');
    message.textContent = alert;
    message.style.background = color;
    message.style.position = 'absolute';
    message.style.fontSize = '20px';
    message.style.textAlign = 'center';
    message.style.padding = '15px';
    message.style.left = '0';
    message.style.right = '0';
    message.style.zIndex = '500';
    document.body.insertAdjacentElement('afterbegin', message);
    window.setTimeout(function () {
      message.remove();
    }, timeout);
  };

  window.util = {
    PERCENT_PROPORTION_COUNT: PERCENT_PROPORTION_COUNT,
    SPACE: SPACE,
    Key: Key,
    Regular: Regular,
    isEscEvent: isEscEvent,
    setModalOpenedMode: setModalOpenedMode,
    setModalClosedMode: setModalClosedMode,
    disableInput: disableInput,
    enableInput: enableInput,
    showAlert: showAlert
  };
})();
