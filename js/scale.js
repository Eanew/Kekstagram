'use strict';

(function () {
  var SCALE_STEP = 25;
  var MIN_SCALE_VALUE = 25;
  var MAX_SCALE_VALUE = 100;

  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadPreviewImg = uploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var imgScale = uploadOverlay.querySelector('.scale');
  var imgScaleInput = imgScale.querySelector('.scale__control--value');
  var buttonSmaller = imgScale.querySelector('.scale__control--smaller');
  var buttonBigger = imgScale.querySelector('.scale__control--bigger');

  var switchImgSize = function () {
    imgScaleInput.value = window.scale.currentValue + '%';
    uploadPreviewImg.style.transform = 'scale(' + window.scale.currentValue / MAX_SCALE_VALUE + ')';
  };

  buttonSmaller.addEventListener('click', function () {
    if (window.scale.currentValue > MIN_SCALE_VALUE) {
      window.scale.currentValue -= SCALE_STEP;
      switchImgSize();
    }
  });

  buttonBigger.addEventListener('click', function () {
    if (window.scale.currentValue < MAX_SCALE_VALUE) {
      window.scale.currentValue += SCALE_STEP;
      switchImgSize();
    }
  });

  window.scale = {
    maxValue: MAX_SCALE_VALUE,
    currentValue: MAX_SCALE_VALUE,
    switchImgSize: switchImgSize
  };
})();
