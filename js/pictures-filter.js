'use strict';

(function () {
  var RANDOM_PICTURES_COUNT = 10;
  var filters = document.querySelector('.img-filters');
  var form = filters.querySelector('.img-filters__form');
  var defaultFilter = form.querySelector('#filter-default');
  var randomFilter = form.querySelector('#filter-random');
  var discussedFilter = form.querySelector('#filter-discussed');
  var picturesContainer = document.querySelector('.pictures');

  var clearPictureList = function () {
    var pictures = picturesContainer.querySelectorAll('.picture');
    pictures.forEach(function (picture) {
      picture.remove();
    });
  };

  defaultFilter.addEventListener('click', function () {
    clearPictureList();
    window.backend.load(window.backend.refreshPictures);
  });

  var getRandomCount = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var getUniqueRandomItem = function (collection) {
    var randomCount = getRandomCount(0, collection.length - 1);
    return collection.splice(randomCount, 1)[0];
  };

  var setPicturesRandomFilter = function (response) {
    var randomPictures = [];
    for (var i = 0; i < RANDOM_PICTURES_COUNT; i++) {
      randomPictures.push(getUniqueRandomItem(response));
    }
    window.backend.refreshPictures(randomPictures);
  };

  randomFilter.addEventListener('click', function () {
    clearPictureList();
    window.backend.load(setPicturesRandomFilter);
  });

  var setPicturesDiscussedFilter = function (response) {
    var responseCloned = response.slice();
    responseCloned.sort(function (first, second) {
      if (first.comments.length < second.comments.length) {
        return 1;
      } else if (first.comments.length > second.comments.length) {
        return -1;
      } else {
        return 0;
      }
    });
    window.backend.refreshPictures(responseCloned);
  };

  discussedFilter.addEventListener('click', function () {
    clearPictureList();
    window.backend.load(setPicturesDiscussedFilter);
  });
})();
