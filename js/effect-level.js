'use strict';

(function () {
  var ARROW_LEFT_KEY = window.util.ARROW_LEFT_KEY;
  var ARROW_RIGHT_KEY = window.util.ARROW_RIGHT_KEY;

  var effectPin = window.filters.effectPin;
  var currentFilter = window.filters.currentFilter;
  var effectLevelInput = window.filters.effectLevelInput;
  var uploadPreviewImg = window.filters.uploadPreviewImg;
  var effectDepth = window.filters.effectDepth;
  var effectLevel = window.filters.effectLevel;
  var effectLine = window.filters.effectLine;

  var effectLineWidth;
  var effectPinX;

  var getPinPositionInPercent = function () {
    effectPinX = effectPin.style.left.replace('px', '');
    return Math.round(effectPinX / effectLineWidth * 100);
  };

  var fixedEffectValue;
  var totalValue;

  var setEffectSaturation = function () {
    totalValue = currentFilter.calculableValue * effectLevelInput.value;
    uploadPreviewImg.style.filter = currentFilter.attributeString.replace(currentFilter.defaultValue, totalValue);
    uploadPreviewImg.style.WebkitFilter = currentFilter.attributeString.replace(currentFilter.defaultValue, totalValue);
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
      } else if (totalX < 0) {
        totalX = 0;
      } else {
        totalX = effectLineWidth;
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
      var pinStep = effectLineWidth / 50;
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

    if (evt.key === ARROW_LEFT_KEY) {
      pinDirection = -1;
      movePin();
    }
    if (evt.key === ARROW_RIGHT_KEY) {
      pinDirection = 1;
      movePin();
    }
  });

  window.effectLevel = {
    effectLineWidth: effectLineWidth,
    setValue: function () {
      setEffectLevelValue();
    }
  };
})();
