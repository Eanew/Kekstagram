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

  var showResultMessage = function (template, errorDescription) {
    var overlay = template.cloneNode(true);
    var inner = overlay.querySelector('div');
    var button = overlay.querySelector('button');
    var message = overlay.querySelector('h2');

    if (errorDescription) {
      message.innerHTML += errorDescription;
    }

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
    var error;
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          error = '';
          showResultMessage(successMessage);
          break;
        case 400:
          error = ':<br><br><small>Неверный запрос</small>';
          break;
        case 401:
          error = ':<br><br><small>Пользователь не авторизован</small>';
          break;
        case 404:
          error = ':<br><br><small>По вашему запросу ничего не найдено</small>';
          break;
        default:
          error = '.<br><br><small>Статус ответа: ' + xhr.status + window.util.SPACE + xhr.statusText + '</small>';
      }
      if (error) {
        showResultMessage(errorMessage, error);
      }
    });

    xhr.addEventListener('error', function () {
      error = ':<br><br><small>Нет подключения к интернету</small>';
      showResultMessage(errorMessage, error);
    });

    xhr.addEventListener('timeout', function () {
      var timeoutInSeconds = Math.floor(xhr.timeout / 1000);
      error = ':<br><br><small>Превышено время выполнения (' + timeoutInSeconds + ' секунд)</small>';
      showResultMessage(errorMessage, error);
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
