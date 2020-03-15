'use strict';

(function () {
  var uploadOverlay = window.openForm.uploadOverlay;

  var uploadPreview = uploadOverlay.querySelector('.img-upload__preview');
  var uploadPreviewImg = uploadPreview.querySelector('img');
  var effectLevel = uploadOverlay.querySelector('.effect-level');
  var effectLevelInput = effectLevel.querySelector('.effect-level__value');
  var effectLine = effectLevel.querySelector('.effect-level__line');
  var effectDepth = effectLine.querySelector('.effect-level__depth');
  var effectPin = effectLine.querySelector('.effect-level__pin');
  var currentFilter = {};

  window.filters = {
    currentFilter: currentFilter,
    uploadPreviewImg: uploadPreviewImg,
    effectPin: effectPin,
    effectLevel: effectLevel,
    effectLevelInput: effectLevelInput,
    effectLine: effectLine,
    effectDepth: effectDepth
  };
})();
