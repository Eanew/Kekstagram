'use strict';

(function () {
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadPreviewImg = uploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var effectLevel = uploadOverlay.querySelector('.effect-level');
  var effectLevelInput = effectLevel.querySelector('.effect-level__value');
  var effectLine = effectLevel.querySelector('.effect-level__line');
  var effectDepth = effectLine.querySelector('.effect-level__depth');
  var effectPin = effectLine.querySelector('.effect-level__pin');
  var effectPinX;
  var fixedEffectValue;
  var totalValue;

  var getPinPositionInPercent = function () {
    effectPinX = effectPin.style.left.replace('px', '');
    return Math.round(effectPinX / window.filters.effectLineWidth * 100);
  };

  var setEffectSaturation = function () {
    totalValue = window.filters.current.calculableValue * effectLevelInput.value;
    uploadPreviewImg.style.filter = window.filters.current.attributeString.replace(window.filters.current.defaultValue, totalValue);
    uploadPreviewImg.style.WebkitFilter = window.filters.current.attributeString.replace(window.filters.current.defaultValue, totalValue);
    fixedEffectValue = effectLevelInput.value;
  };

  var setEffectLevelValue = function () {
    effectDepth.style.width = effectPin.style.left;
    effectLevelInput.value = getPinPositionInPercent();
    if (effectLevelInput.value !== fixedEffectValue) {
      setEffectSaturation();
    }
  };

  effectLevel.addEventListener('mousedown', function (evt) {
    var startCoordX;
    var effectLineStart = effectLine.getBoundingClientRect().left;
    if ((evt.clientX - effectLineStart) >= 0 && evt.clientX <= (effectLineStart + window.filters.effectLineWidth)) {
      startCoordX = evt.clientX;
    } else if ((evt.clientX - effectLineStart) < 0) {
      startCoordX = effectLineStart;
    } else {
      startCoordX = effectLineStart + window.filters.effectLineWidth;
    }
    var effectPinNewPosition = startCoordX - effectLineStart;
    effectPin.style.left = effectPinNewPosition + 'px';
    setEffectLevelValue();

    var effectPinMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shiftX = moveEvt.clientX - startCoordX;
      var totalX = +effectPin.style.left.replace('px', '') + shiftX;
      if (totalX >= 0 && totalX <= window.filters.effectLineWidth) {
        startCoordX = moveEvt.clientX;
      } else if (totalX < 0) {
        totalX = 0;
      } else {
        totalX = window.filters.effectLineWidth;
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
    var pinDirection;

    var movePin = function () {
      var pinStep = window.filters.effectLineWidth / 50;
      var shiftX = pinDirection * pinStep;
      var totalX = +effectPin.style.left.replace('px', '') + shiftX;
      if (totalX < 0) {
        totalX = 0;
      }
      if (totalX > window.filters.effectLineWidth) {
        totalX = window.filters.effectLineWidth;
      }
      effectPin.style.left = totalX + 'px';
      setEffectLevelValue();
    };

    if (evt.key === window.util.ARROW_LEFT_KEY) {
      pinDirection = -1;
      movePin();
    }
    if (evt.key === window.util.ARROW_RIGHT_KEY) {
      pinDirection = 1;
      movePin();
    }
  });

  window.effectLevel = {
    setValue: function () {
      setEffectLevelValue();
    }
  };
})();
