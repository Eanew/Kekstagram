'use strict';

(function () {
  var RequestStatus = {
    SUCCESS: 200
  };

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
})();

