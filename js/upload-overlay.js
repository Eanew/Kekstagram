'use strict';

(function () {
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var overlayCloseButton = uploadOverlay.querySelector('#upload-cancel');
  var uploadPreviewImg = uploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var buttonSmaller = uploadOverlay.querySelector('.scale__control--smaller');

  var setDefaultFilter = function (filter) {
    uploadPreviewImg.classList.remove(filter.imgClass);
    filter.imgClass = filter.DEFAULT_CLASS;
    uploadPreviewImg.classList.add(filter.imgClass);
    filter.refresh(filter);
  };

  var setDefaultScale = function (scale) {
    if (scale.currentValue !== scale.maxValue) {
      scale.currentValue = scale.maxValue;
      scale.switchImgSize();
    }
  };

  var setDefaultUploadSettings = function () {
    uploadForm.reset();
    setDefaultFilter(window.filters);
    setDefaultScale(window.scale);
  };

  var uploadOverlayEscPressHandler = function (evt) {
    if (evt.key === window.util.ESC_KEY) {
      closeUploadOverlay();
    }
  };

  var openUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    buttonSmaller.focus();
    window.util.setModalOpenedMode();
    document.addEventListener('keydown', uploadOverlayEscPressHandler);
  };

  var closeUploadOverlay = function () {
    document.removeEventListener('keydown', uploadOverlayEscPressHandler);
    uploadOverlay.classList.add('hidden');
    window.util.setModalClosedMode();
    setDefaultUploadSettings();
  };

  uploadInput.addEventListener('change', function () {
    openUploadOverlay();
  });

  overlayCloseButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeUploadOverlay();
  });

  window.uploadOverlay = {
    close: function () {
      closeUploadOverlay();
    }
  };
})();
