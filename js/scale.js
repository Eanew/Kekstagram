'use strict';

(function () {
  var uploadOverlay = window.openForm.uploadOverlay;
  var uploadPreviewImg = window.filters.uploadPreviewImg;

  var imgScale = uploadOverlay.querySelector('.scale');
  var buttonSmaller = imgScale.querySelector('.scale__control--smaller');
  var buttonBigger = imgScale.querySelector('.scale__control--bigger');
  var ImgScaleInput = imgScale.querySelector('.scale__control--value');
  var minScaleValue = 25;
  var maxScaleValue = 100;
  var currentScaleValue = maxScaleValue;

  var switchImgSize = function () {
    ImgScaleInput.value = currentScaleValue + '%';
    uploadPreviewImg.style.transform = 'scale(' + currentScaleValue / 100 + ')';
  };

  buttonSmaller.addEventListener('click', function () {
    if (currentScaleValue > minScaleValue) {
      currentScaleValue -= 25;
      switchImgSize();
    }
  });

  buttonBigger.addEventListener('click', function () {
    if (currentScaleValue < maxScaleValue) {
      currentScaleValue += 25;
      switchImgSize();
    }
  });

  window.scale = {
    buttonSmaller: buttonSmaller,
    currentScaleValue: currentScaleValue,
    maxScaleValue: maxScaleValue,
    switchImgSize: function () {
      switchImgSize();
    }
  };
})();
