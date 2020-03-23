'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  window.photoInsert = function (evt, image, input, successHandler) {
    var file = evt.target.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      input.disabled = true;
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        input.disabled = false;
        image.src = reader.result;
        successHandler();
      });
      reader.readAsDataURL(file);
    } else {
      window.util.showErrorAlert('Выбран неподходящий формат файла');
    }
  };
})();
