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
      input.disabled = true;
      label.style.opacity = '0.4';
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        input.disabled = false;
        label.style.opacity = '';
        image.src = reader.result;
        successHandler();
      });
      reader.readAsDataURL(file);
    } else {
      window.util.showAlert('Выбран неподходящий формат файла', 'orange', ERROR_MESSAGE_TIMEOUT);
    }
  };

  window.photo = {
    insert: insertPhoto
  };
})();
