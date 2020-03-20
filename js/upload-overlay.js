'use strict';

(function () {
  var uploadInput = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var overlayCloseButton = uploadOverlay.querySelector('#upload-cancel');
  var uploadPreviewImg = uploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var defaultFilter = uploadOverlay.querySelector('#effect-none');
  var buttonSmaller = uploadOverlay.querySelector('.scale__control--smaller');
  var hashTagInput = uploadOverlay.querySelector('.text__hashtags');
  var descriptionInput = uploadOverlay.querySelector('.text__description');
  var uploadInputPreviousValue;

  var setDefaultFilter = function (filter) {
    defaultFilter.checked = true;
    uploadPreviewImg.classList.remove(filter.imgClass);
    filter.imgClass = filter.DEFAULT_CLASS;
    uploadPreviewImg.classList.add(filter.imgClass);
    filter.refresh(filter);
  };

  var setDefaultImgScale = function (scale) {
    scale.currentValue = scale.maxValue;
    scale.switchImgSize();
  };

  var setDefaultUploadSettings = function () {
    if (!defaultFilter.checked) {
      setDefaultFilter(window.filters);
    }
    if (window.scale.currentValue !== window.scale.maxValue) {
      setDefaultImgScale(window.scale);
    }
    hashTagInput.value = '';
    descriptionInput.value = '';
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
    uploadInputPreviousValue = uploadInput.value;
    document.addEventListener('keydown', uploadOverlayEscPressHandler);
  };

  var closeUploadOverlay = function () {
    document.removeEventListener('keydown', uploadOverlayEscPressHandler);
    uploadOverlay.classList.add('hidden');
    window.util.setModalClosedMode();
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

  window.uploadOverlay = {
    close: function () {
      closeUploadOverlay();
    },
    setDefault: function () {
      setDefaultUploadSettings();
    }
  };
})();
