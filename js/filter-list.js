'use strict';

(function () {
  var NUMBERS_DISMATCH = window.util.NUMBERS_DISMATCH;
  var DEFAULT_FILTER_CLASS = window.openForm.DEFAULT_FILTER_CLASS;
  var EFFECT_ID_TEMPLATE = 'effect-';
  var PREVIEW_CLASS_TEMPLATE = 'effects__preview--';

  var imgFilterClass = window.openForm.imgFilterClass;
  var effectsList = window.openForm.effectsList;
  var currentFilter = window.filters.currentFilter;
  var uploadPreviewImg = window.filters.uploadPreviewImg;
  var effectLevel = window.filters.effectLevel;
  var effectLine = window.filters.effectLine;
  var effectPin = window.filters.effectPin;
  var effectLineWidth = window.effectLevel.effectLineWidth;

  var refreshCurrentFilter = function () {
    uploadPreviewImg.style.filter = '';
    uploadPreviewImg.style.WebkitFilter = '';
    if (imgFilterClass !== DEFAULT_FILTER_CLASS) {
      currentFilter.attributeString = getComputedStyle(uploadPreviewImg).filter;
      currentFilter.defaultValue = currentFilter.attributeString.replace(NUMBERS_DISMATCH, '');
      currentFilter.calculableValue = currentFilter.defaultValue / 100;
      effectLevel.classList.remove('hidden');
      effectLineWidth = +getComputedStyle(effectLine).width.replace('px', '');
      effectPin.style.left = effectLineWidth + 'px';
      window.effectLevel.setValue();
    } else {
      effectLevel.classList.add('hidden');
    }
  };

  var effectsListChangeHandler = function (evt) {
    if (evt.target && evt.target.matches('input[type="radio"]')) {
      uploadPreviewImg.classList.remove(imgFilterClass);
      imgFilterClass = evt.target.id.replace(EFFECT_ID_TEMPLATE, PREVIEW_CLASS_TEMPLATE);
      uploadPreviewImg.classList.add(imgFilterClass);
      refreshCurrentFilter();
    }
  };

  effectsList.addEventListener('change', effectsListChangeHandler);

  window.filterList = {
    refreshCurrent: function () {
      refreshCurrentFilter();
    }
  };
})();
