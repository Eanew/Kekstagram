'use strict';

(function () {
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var uploadLabel = uploadForm.querySelector('.img-upload__label');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var overlayCloseButton = uploadOverlay.querySelector('#upload-cancel');
  var uploadPreviewImg = uploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var buttonSmaller = uploadOverlay.querySelector('.scale__control--smaller');
  var hashTagInput = uploadOverlay.querySelector('.text__hashtags');
  var descriptionInput = uploadOverlay.querySelector('.text__description');

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

  var resetValidation = function () {
    hashTagInput.setCustomValidity('');
    descriptionInput.setCustomValidity('');
    window.validation.removeInvalidBorder(hashTagInput);
    window.validation.removeInvalidBorder(descriptionInput);
  };

  var setDefaultUploadSettings = function () {
    uploadForm.reset();
    uploadPreviewImg.src = '';
    setDefaultFilter(window.filters);
    setDefaultScale(window.scale);
    resetValidation();
  };

  var uploadOverlayEscPressHandler = function (evt) {
    window.util.isEscEvent(evt, closeUploadOverlay);
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

  uploadInput.addEventListener('change', function (evt) {
    window.photo.insert(evt, uploadPreviewImg, uploadInput, uploadLabel, openUploadOverlay);
  });

  overlayCloseButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeUploadOverlay();
  });

  window.uploadOverlay = {
    close: closeUploadOverlay
  };
})();
