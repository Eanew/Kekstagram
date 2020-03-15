'use strict';

(function () {
  var DEFAULT_FILTER_CLASS = 'effects__preview--none';
  var ESC_KEY = window.util.ESC_KEY;

  var buttonSmaller = window.scale.buttonSmaller;
  var currentScaleValue = window.scale.currentScaleValue;
  var maxScaleValue = window.scale.maxScaleValue;
  var uploadPreviewImg = window.filters.uploadPreviewImg;

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var overlayCloseButton = uploadOverlay.querySelector('#upload-cancel');
  var effectsList = uploadOverlay.querySelector('.effects__list');
  var defaultFilter = effectsList.querySelector('#effect-none');
  var imgFilterClass;

  var setDefaultFilter = function () {
    defaultFilter.checked = true;
    uploadPreviewImg.classList.remove(imgFilterClass);
    imgFilterClass = DEFAULT_FILTER_CLASS;
    uploadPreviewImg.classList.add(imgFilterClass);
    window.filterList.refreshCurrent();
  };

  var setDefaultImgScale = function () {
    currentScaleValue = maxScaleValue;
    window.scale.switchImgSize();
  };

  var setDefaultUploadSettings = function () {
    if (!defaultFilter.checked) {
      setDefaultFilter();
    }
    if (currentScaleValue !== maxScaleValue) {
      setDefaultImgScale();
    }
  };

  var uploadOverlayEscPressHandler = function (evt) {
    if (evt.key === ESC_KEY) {
      closeUploadOverlay();
    }
  };

  var uploadInputPreviousValue;

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

  window.openForm = {
    DEFAULT_FILTER_CLASS: DEFAULT_FILTER_CLASS,
    imgFilterClass: imgFilterClass,
    uploadOverlay: uploadOverlay,
    effectsList: effectsList
  };
})();
