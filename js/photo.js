'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var ERROR_MESSAGE_TIMEOUT = 2500;

  var insertPhoto = function (evt, image, input, label, successHandler) {
    var file = evt.target.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      window.util.disableInput(input, label);
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        window.util.enableInput(input, label);
        image.src = reader.result;
        successHandler();
      });
      reader.readAsDataURL(file);
    } else {
      window.util.showAlert('Выбран неподходящий формат изображения', 'orange', ERROR_MESSAGE_TIMEOUT);
    }
  };

  window.photo = {
    insert: insertPhoto
  };
})();
