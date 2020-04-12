'use strict';

(function () {
  var RequestStatus = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    NOT_AUTHORIZED: 401,
    NOT_FOUND: 404
  };

  var createRequest = function (method, url, successHandler, errorHandler, loadingHandler, data) {
    var error;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case RequestStatus.SUCCESS:
          error = '';
          successHandler(xhr.response);
          break;
        case RequestStatus.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case RequestStatus.NOT_AUTHORIZED:
          error = 'Пользователь не авторизован';
          break;
        case RequestStatus.NOT_FOUND:
          error = 'По вашему запросу ничего не найдено';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + window.util.SPACE + xhr.statusText;
      }
      if (error) {
        errorHandler(error);
      }
    });

    xhr.addEventListener('error', function () {
      error = 'Нет подключения к интернету';
      errorHandler(error);
    });

    xhr.addEventListener('timeout', function () {
      var timeoutInSeconds = Math.floor(xhr.timeout / 1000);
      error = 'Превышено время выполнения (' + timeoutInSeconds + ' секунд)';
      errorHandler(error);
    });

    xhr.timeout = 10000;

    xhr.open(method, url);
    xhr.send(data);
    if (method === 'POST') {
      loadingHandler(xhr);
    }
  };

  var loadData = function (successHandler, errorHandler) {
    var URL = 'https://javascript.pages.academy/kekstagram/data';
    createRequest('GET', URL, successHandler, errorHandler);
  };

  var saveData = function (successHandler, errorHandler, loadingHandler, data) {
    var URL = 'https://javascript.pages.academy/kekstagram';
    createRequest('POST', URL, successHandler, errorHandler, loadingHandler, data);
  };

  window.backend = {
    load: loadData,
    save: saveData
  };
})();

