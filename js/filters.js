'use strict';

(function () {
  var DEFAULT_FILTER_CLASS = 'effects__preview--none';
  var PREVIEW_CLASS_TEMPLATE = 'effects__preview--';
  var EFFECT_ID_TEMPLATE = 'effect-';

  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadPreviewImg = uploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var effectsList = uploadOverlay.querySelector('.effects__list');
  var effectLevel = uploadOverlay.querySelector('.effect-level');
  var effectLine = effectLevel.querySelector('.effect-level__line');
  var effectPin = effectLine.querySelector('.effect-level__pin');
  var currentFilter = {};

  var setCurrentFilter = function () {
    currentFilter.attributeString = getComputedStyle(uploadPreviewImg).filter;
    currentFilter.defaultValue = currentFilter.attributeString.replace(window.util.NUMBERS_DISMATCH, '');
    currentFilter.calculableValue = currentFilter.defaultValue / 100;
  };

  var refreshCurrentFilter = function (filter) {
    uploadPreviewImg.style.filter = '';
    uploadPreviewImg.style.WebkitFilter = '';
    if (filter.imgClass !== DEFAULT_FILTER_CLASS) {
      setCurrentFilter();
      effectLevel.classList.remove('hidden');
      currentFilter.effectLineWidth = +getComputedStyle(effectLine).width.replace('px', '');
      effectPin.style.left = currentFilter.effectLineWidth + 'px';
      window.effectLevel.setValue();
    } else {
      effectLevel.classList.add('hidden');
    }
  };

  var effectsListChangeHandler = function (evt) {
    if (evt.target && evt.target.matches('input[type="radio"]')) {
      uploadPreviewImg.classList.remove(window.filters.imgClass);
      window.filters.imgClass = evt.target.id.replace(EFFECT_ID_TEMPLATE, PREVIEW_CLASS_TEMPLATE);
      uploadPreviewImg.classList.add(window.filters.imgClass);
      refreshCurrentFilter(window.filters);
    }
  };

  effectsList.addEventListener('change', effectsListChangeHandler);

  window.filters = {
    DEFAULT_CLASS: DEFAULT_FILTER_CLASS,
    data: currentFilter,
    refresh: function (filter) {
      refreshCurrentFilter(filter);
    }
  };
})();
