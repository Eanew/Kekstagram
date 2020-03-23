'use strict';

(function () {
  var PIN_STEP_REDUCING_COUNT = 50;
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadPreviewImg = uploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var effectLevel = uploadOverlay.querySelector('.effect-level');
  var effectLevelInput = effectLevel.querySelector('.effect-level__value');
  var effectLine = effectLevel.querySelector('.effect-level__line');
  var effectDepth = effectLine.querySelector('.effect-level__depth');
  var effectPin = effectLine.querySelector('.effect-level__pin');
  var effectLineWidth = 0;
  var effectPinX = 0;
  var fixedEffectValue = 0;
  var totalValue = 0;

  var getPinPositionInPercent = function () {
    effectPinX = effectPin.style.left.replace('px', '');
    return Math.round(effectPinX / effectLineWidth * window.util.PERCENT_PROPORTION_COUNT);
  };

  var setEffectSaturation = function (filter) {
    totalValue = filter.calculableValue * effectLevelInput.value;
    uploadPreviewImg.style.filter = filter.attributeString.replace(filter.defaultValue, totalValue);
    uploadPreviewImg.style.WebkitFilter = filter.attributeString.replace(filter.defaultValue, totalValue);
    fixedEffectValue = effectLevelInput.value;
  };

  var setEffectLevelValue = function () {
    effectDepth.style.width = effectPin.style.left;
    effectLineWidth = window.filters.data.effectLineWidth;
    effectLevelInput.value = getPinPositionInPercent();
    if (effectLevelInput.value !== fixedEffectValue) {
      setEffectSaturation(window.filters.data);
    }
  };

  effectLevel.addEventListener('mousedown', function (evt) {
    var startCoordX = '';
    var effectLineStart = effectLine.getBoundingClientRect().left;
    if ((evt.clientX - effectLineStart) >= 0 && evt.clientX <= (effectLineStart + effectLineWidth)) {
      startCoordX = evt.clientX;
    } else if ((evt.clientX - effectLineStart) < 0) {
      startCoordX = effectLineStart;
    } else {
      startCoordX = effectLineStart + effectLineWidth;
    }
    var effectPinNewPosition = startCoordX - effectLineStart;
    effectPin.style.left = effectPinNewPosition + 'px';
    setEffectLevelValue();

    var effectPinMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shiftX = moveEvt.clientX - startCoordX;
      var totalX = +effectPin.style.left.replace('px', '') + shiftX;
      if (totalX >= 0 && totalX <= effectLineWidth) {
        startCoordX = moveEvt.clientX;
      } else {
        totalX = totalX < 0 ? 0 : effectLineWidth;
      }
      effectPin.style.left = totalX + 'px';
      setEffectLevelValue();
    };

    var effectPinMouseupHandler = function (mouseUpEvt) {
      mouseUpEvt.preventDefault();
      document.removeEventListener('mousemove', effectPinMoveHandler);
      document.removeEventListener('mouseup', effectPinMouseupHandler);
    };
    document.addEventListener('mousemove', effectPinMoveHandler);
    document.addEventListener('mouseup', effectPinMouseupHandler);
  });

  effectLevel.addEventListener('keydown', function (evt) {
    var pinDirection = '';

    var movePin = function () {
      var pinStep = effectLineWidth / PIN_STEP_REDUCING_COUNT;
      var shiftX = pinDirection * pinStep;
      var totalX = +effectPin.style.left.replace('px', '') + shiftX;
      if (totalX < 0) {
        totalX = 0;
      }
      if (totalX > effectLineWidth) {
        totalX = effectLineWidth;
      }
      effectPin.style.left = totalX + 'px';
      setEffectLevelValue();
    };

    if (evt.key === window.util.Key.ARROW_LEFT) {
      pinDirection = -1;
      movePin();
    }
    if (evt.key === window.util.Key.ARROW_RIGHT) {
      pinDirection = 1;
      movePin();
    }
  });

  window.effectLevel = {
    setValue: setEffectLevelValue
  };
})();
