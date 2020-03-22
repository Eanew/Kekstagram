'use strict';

(function () {
  var FILTER_REFRESH_TIMEOUT = 500;
  var RANDOM_PICTURES_COUNT = 10;
  var ACTIVE_BUTTON_CLASS = 'img-filters__button--active';
  var filters = document.querySelector('.img-filters');
  var form = filters.querySelector('.img-filters__form');
  var defaultFilter = form.querySelector('#filter-default');
  var randomFilter = form.querySelector('#filter-random');
  var discussedFilter = form.querySelector('#filter-discussed');
  var pictures = document.querySelector('.pictures');

  var clearPictureList = function () {
    pictures.querySelectorAll('.picture').forEach(function (picture) {
      picture.remove();
    });
  };

  var renderPicturesTimeout;
  var renderNewPictures = function (photos) {
    if (renderPicturesTimeout) {
      window.clearTimeout(renderPicturesTimeout);
    }
    renderPicturesTimeout = window.setTimeout(function () {
      window.pictures.addToPage(photos);
      window.preview.addClickHandler();
    }, FILTER_REFRESH_TIMEOUT);
  };

  var setActiveButton = function (evt) {
    if (evt.target && !evt.target.classList.contains(ACTIVE_BUTTON_CLASS)) {
      form.querySelector('.' + ACTIVE_BUTTON_CLASS).classList.remove(ACTIVE_BUTTON_CLASS);
      evt.target.classList.add(ACTIVE_BUTTON_CLASS);
    }
  };

  defaultFilter.addEventListener('click', function (evt) {
    setActiveButton(evt);
    clearPictureList();
    renderNewPictures(window.preview.photos);
  });

  var getRandomCount = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var getUniqueRandomItem = function (collection) {
    var randomCount = getRandomCount(0, collection.length - 1);
    return collection.splice(randomCount, 1)[0];
  };

  randomFilter.addEventListener('click', function (evt) {
    setActiveButton(evt);
    var photos = window.preview.photos.slice();
    var randomPictures = [];
    for (var i = 0; i < RANDOM_PICTURES_COUNT; i++) {
      randomPictures.push(getUniqueRandomItem(photos));
    }
    clearPictureList();
    renderNewPictures(randomPictures);
  });

  discussedFilter.addEventListener('click', function (evt) {
    setActiveButton(evt);
    var photos = window.preview.photos.slice();
    photos.sort(function (first, second) {
      if (first.comments.length < second.comments.length) {
        return 1;
      } else if (first.comments.length > second.comments.length) {
        return -1;
      } else {
        return 0;
      }
    });
    clearPictureList();
    renderNewPictures(photos);
  });
})();
