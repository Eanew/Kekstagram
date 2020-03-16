'use strict';

(function () {
  var maxScaleValue = window.scale.maxValue;

  var uploadInput = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var overlayCloseButton = uploadOverlay.querySelector('#upload-cancel');
  var uploadPreviewImg = uploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var defaultFilter = uploadOverlay.querySelector('#effect-none');
  var buttonSmaller = uploadOverlay.querySelector('.scale__control--smaller');
  var uploadInputPreviousValue;

  var setDefaultFilter = function () {
    defaultFilter.checked = true;
    uploadPreviewImg.classList.remove(window.filters.imgClass);
    window.filters.imgClass = window.filters.DEFAULT_CLASS;
    uploadPreviewImg.classList.add(window.filters.imgClass);
    window.filters.refreshCurrent();
  };

  var setDefaultImgScale = function () {
    window.scale.currentValue = maxScaleValue;
    window.scale.switchImgSize();
  };

  var setDefaultUploadSettings = function () {
    if (!defaultFilter.checked) {
      setDefaultFilter();
    }
    if (window.scale.currentValue !== maxScaleValue) {
      setDefaultImgScale();
    }
  };

  var uploadOverlayEscPressHandler = function (evt) {
    if (evt.key === window.util.ESC_KEY) {
      closeUploadOverlay();
    }
  };

  var openUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    buttonSmaller.focus();
    window.util.addModalOpen();
    uploadInputPreviousValue = uploadInput.value;
    document.addEventListener('keydown', uploadOverlayEscPressHandler);
  };

  var closeUploadOverlay = function () {
    document.removeEventListener('keydown', uploadOverlayEscPressHandler);
    uploadOverlay.classList.add('hidden');
    window.util.removeModalOpen();
    uploadInput.value = '';
  };

  uploadInput.addEventListener('change', function () {
    if (uploadInputPreviousValue && (uploadInput.value !== uploadInputPreviousValue)) {
      setDefaultUploadSettings();
    }
    openUploadOverlay();
  });

  overlayCloseButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeUploadOverlay();
  });
})();
