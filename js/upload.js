'use strict';

(function () {
  var EMPTY_SPACE_IN_EDGES_MATCH = /^\s+|\s+(?!.)/g;
  var URL = 'https://js.dump.academy/kekstagram';

  var uploadForm = document.querySelector('.img-upload__form');
  var hashTagInput = uploadForm.querySelector('.text__hashtags');
  var uploadButton = uploadForm.querySelector('#upload-submit');
  var pageMain = document.querySelector('main');
  var successMessage = document.querySelector('#success').content.querySelector('.success');
  var errorMessage = document.querySelector('#error').content.querySelector('.error');

  var showResultMessage = function (template) {
    var overlay = template.cloneNode(true);
    var message = overlay.querySelector('div');
    var button = overlay.querySelector('button');

    var overlayEscPressHandler = function (evt) {
      if (evt.key === window.util.ESC_KEY) {
        document.removeEventListener('keydown', overlayEscPressHandler);
        overlay.remove();
      }
    };
    document.addEventListener('keydown', overlayEscPressHandler);

    message.addEventListener('click', function (evt) {
      evt.stopPropagation();
    });

    overlay.addEventListener('click', function () {
      document.removeEventListener('keydown', overlayEscPressHandler);
      overlay.remove();
    });

    button.addEventListener('click', function () {
      document.removeEventListener('keydown', overlayEscPressHandler);
      overlay.remove();
    });

    pageMain.insertAdjacentElement('afterbegin', overlay);
    button.focus();
  };

  var getSubmitResult = function (messageTemplate) {
    showResultMessage(messageTemplate);
    window.uploadOverlay.close();
    uploadButton.textContent = 'Опубликовать';
    uploadButton.disabled = false;
  };

  var sendFormData = function (data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 5000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        getSubmitResult(successMessage);
      } else {
        getSubmitResult(errorMessage);
      }
    });

    xhr.addEventListener('error', function () {
      getSubmitResult(errorMessage);
    });

    xhr.addEventListener('timeout', function () {
      getSubmitResult(errorMessage);
    });

    xhr.open('POST', URL);
    xhr.send(data);
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    hashTagInput.value = hashTagInput.value
    .replace(EMPTY_SPACE_IN_EDGES_MATCH, '')
    .replace(window.util.EMPTY_SPACE_MATCH, window.util.SPACE);
    sendFormData(new FormData(uploadForm));
    uploadButton.textContent = 'Отправляем...';
    uploadButton.disabled = true;
  });
})();
