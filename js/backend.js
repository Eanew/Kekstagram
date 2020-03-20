'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram/data';
  var xhr = new XMLHttpRequest();

  xhr.responseType = 'json';
  xhr.timeout = 10000;

  var successHandler = function (response) {
    window.pictures.addToPage(response);
    window.preview.photos.data = response;
    window.preview.addClickHandler();
  };

  var errorHandler = function (error) {
    // console.log(error);
  };

  xhr.addEventListener('load', function () {
    var error;
    switch (xhr.status) {
      case 200:
        successHandler(xhr.response);
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

  xhr.open('GET', URL);
  xhr.send();
})();
