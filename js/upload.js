'use strict';

(function () {
  var EMPTY_SPACE_IN_EDGES_MATCH = /^\s+|\s+(?!.)/g;
  var URL = 'https://js.dump.academy/kekstagram';

  var uploadForm = document.querySelector('.img-upload__form');
  var hashTagInput = uploadForm.querySelector('.text__hashtags');
  var uploadButton = uploadForm.querySelector('#upload-submit');

  var successHandler = function () {
    window.uploadOverlay.close();
    uploadButton.textContent = 'Опубликовать';
    uploadButton.disabled = false;
  };

  var errorHandler = function (error) {
    console.log(error);
    uploadButton.textContent = 'Опубликовать';
    uploadButton.disabled = false;
  };

  var sendFormData = function (data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 5000;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          successHandler();
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + window.util.SPACE + xhr.statusText;
      }
      if (error) {
        errorHandler(error);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      var timeoutInSeconds = Math.floor(xhr.timeout / 1000);
      errorHandler('Запрос выполняется слишком долго (дольше ' + timeoutInSeconds + ' секунд)');
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
