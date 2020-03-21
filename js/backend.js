'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram/data';
  var xhr = new XMLHttpRequest();

  xhr.responseType = 'json';
  xhr.timeout = 20000;

  var successHandler = function (response) {
    window.pictures.addToPage(response);
    window.preview.photos.data = response;
    window.preview.addClickHandler();
  };

  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      successHandler(xhr.response);
    }
  });

  xhr.open('GET', URL);
  xhr.send();
})();
