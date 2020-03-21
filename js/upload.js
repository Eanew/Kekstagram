'use strict';

(function () {
  var EMPTY_SPACE_IN_EDGES_MATCH = /^\s+|\s+(?!.)/g;
  var URL = 'https://js.dump.academy/kekstagram';

  var pageMain = document.querySelector('main');
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var hashTagInput = uploadForm.querySelector('.text__hashtags');
  var successMessage = document.querySelector('#success').content.querySelector('.success');
  var errorMessage = document.querySelector('#error').content.querySelector('.error');
  var uploadingMessageTemplate = document.querySelector('#messages').content.querySelector('.img-upload__message');
  var uploadingMessage;

  var showUploadingMessage = function (xhr) {
    uploadingMessage = uploadingMessageTemplate.cloneNode(true);
    uploadingMessage.addEventListener('keydown', function (evt) {
      if (evt.key === window.util.ESC_KEY) {
        evt.stopPropagation();
        xhr.abort();
        uploadingMessage.remove();
        uploadOverlay.classList.remove('hidden');
      }
    });
    uploadOverlay.classList.add('hidden');
    pageMain.insertAdjacentElement('afterbegin', uploadingMessage);
    uploadingMessage.focus();
  };

  var showResultMessage = function (template) {
    var overlay = template.cloneNode(true);
    var inner = overlay.querySelector('div');
    var button = overlay.querySelector('button');

    var closeResultMessage = function () {
      document.removeEventListener('keydown', overlayEscPressHandler);
      overlay.remove();
      window.util.setModalClosedMode();
    };

    var overlayEscPressHandler = function (evt) {
      if (evt.key === window.util.ESC_KEY) {
        closeResultMessage();
      }
    };
    document.addEventListener('keydown', overlayEscPressHandler);

    inner.addEventListener('click', function (evt) {
      evt.stopPropagation();
    });

    overlay.addEventListener('click', function () {
      closeResultMessage();
    });

    button.addEventListener('click', function () {
      closeResultMessage();
    });

    window.uploadOverlay.close();
    window.util.setModalOpenedMode();
    overlay.style.zIndex = '1000';
    uploadingMessage.remove();
    pageMain.insertAdjacentElement('afterbegin', overlay);
    button.focus();
  };

  var sendFormData = function (data) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        showResultMessage(successMessage);
      } else {
        showResultMessage(errorMessage);
      }
    });

    xhr.addEventListener('error', function () {
      showResultMessage(errorMessage);
    });

    xhr.addEventListener('timeout', function () {
      showResultMessage(errorMessage);
    });

    xhr.open('POST', URL);
    xhr.send(data);
    showUploadingMessage(xhr);
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    hashTagInput.value = hashTagInput.value
    .replace(EMPTY_SPACE_IN_EDGES_MATCH, '')
    .replace(window.util.EMPTY_SPACE_MATCH, window.util.SPACE);
    sendFormData(new FormData(uploadForm));
  });
})();
