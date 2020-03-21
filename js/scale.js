'use strict';

(function () {
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadPreviewImg = uploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var imgScale = uploadOverlay.querySelector('.scale');
  var imgScaleInput = imgScale.querySelector('.scale__control--value');
  var buttonSmaller = imgScale.querySelector('.scale__control--smaller');
  var buttonBigger = imgScale.querySelector('.scale__control--bigger');
  var minScaleValue = 25;
  var maxScaleValue = 100;

  var switchImgSize = function () {
    imgScaleInput.value = window.scale.currentValue + '%';
    uploadPreviewImg.style.transform = 'scale(' + window.scale.currentValue / 100 + ')';
  };

  buttonSmaller.addEventListener('click', function () {
    if (window.scale.currentValue > minScaleValue) {
      window.scale.currentValue -= 25;
      switchImgSize();
    }
  });

  buttonBigger.addEventListener('click', function () {
    if (window.scale.currentValue < maxScaleValue) {
      window.scale.currentValue += 25;
      switchImgSize();
    }
  });

  window.scale = {
    maxValue: maxScaleValue,
    currentValue: maxScaleValue,
    switchImgSize: switchImgSize
  };
})();
