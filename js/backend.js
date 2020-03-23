'use strict';

(function () {
  var EMPTY_SPACE_IN_EDGES_MATCH = /^\s+|\s+(?!.)/g;
  var UPLOADING_MESSAGE_TIMEOUT = 100;
  var RequestStatus = {
    SUCCESS: 200
  };

  var pageMain = document.querySelector('main');
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var hashTagInput = uploadForm.querySelector('.text__hashtags');
  var successMessage = document.querySelector('#success').content.querySelector('.success');
  var errorMessage = document.querySelector('#error').content.querySelector('.error');
  var uploadingMessageTemplate = document.querySelector('#messages').content.querySelector('.img-upload__message');
  var uploadingMessage = '';

  var createRequest = function (method, url, successHandler, errorHandler, loadingHandler, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RequestStatus.SUCCESS) {
        successHandler(xhr.response);
      } else {
        errorHandler('Статус ответа' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open(method, url);
    xhr.send(data);
    if (method === 'POST') {
      loadingHandler(xhr);
    }
  };

  window.backend = {
    load: function (successHandler, errorHandler) {
      var URL = 'https://js.dump.academy/kekstagram/data';
      createRequest('GET', URL, successHandler, errorHandler);
    },
    save: function (successHandler, errorHandler, loadingHandler, data) {
      var URL = 'https://js.dump.academy/kekstagram';
      createRequest('POST', URL, successHandler, errorHandler, loadingHandler, data);
    }
  };

  var isResultAlreadyReceived = false;

  var showUploadingMessage = function (xhr) {
    uploadOverlay.classList.add('hidden');
    uploadingMessage = uploadingMessageTemplate.cloneNode(true);
    uploadingMessage.addEventListener('keydown', function (evt) {
      if (evt.key === window.util.ESC_KEY) {
        evt.stopPropagation();
        xhr.abort();
        uploadingMessage.remove();
        uploadOverlay.classList.remove('hidden');
      }
    });
    window.setTimeout(function () {
      if (!isResultAlreadyReceived) {
        pageMain.insertAdjacentElement('afterbegin', uploadingMessage);
        uploadingMessage.focus();
      }
    }, UPLOADING_MESSAGE_TIMEOUT);
  };

  var showResultMessage = function (template) {
    isResultAlreadyReceived = true;
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

  var showSuccessMessage = function () {
    showResultMessage(successMessage);
  };

  var showErrorMessage = function () {
    showResultMessage(errorMessage);
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    isResultAlreadyReceived = false;
    hashTagInput.value = hashTagInput.value
    .replace(EMPTY_SPACE_IN_EDGES_MATCH, '')
    .replace(window.util.EMPTY_SPACE_MATCH, window.util.SPACE);
    window.backend.save(showSuccessMessage, showErrorMessage, showUploadingMessage, new FormData(uploadForm));
  });
})();

