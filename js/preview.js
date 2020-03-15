'use strict';

(function () {
  var ESC_KEY = window.util.ESC_KEY;
  var NUMBERS_DISMATCH = window.util.NUMBERS_DISMATCH;
  var photos = window.data.photos;

  var pictures = document.querySelector('.pictures');
  var previewPictures = pictures.querySelectorAll('.picture');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancelButton = bigPicture.querySelector('.big-picture__cancel');
  var commentsList = bigPicture.querySelector('.social__comments');
  var comments = commentsList.querySelectorAll('.social__comment');
  var selectedPicture;
  var pictureIndex;

  var constructBigPicture = function () {
    bigPicture.querySelector('.big-picture__img').querySelector('img').src = photos[pictureIndex].url;
    bigPicture.querySelector('.social__caption').textContent = photos[pictureIndex].description;
    bigPicture.querySelector('.comments-count').textContent = photos[pictureIndex].comments.length;
    bigPicture.querySelector('.likes-count').textContent = photos[pictureIndex].likes;

    for (var i = 0; i < comments.length; i++) {
      comments[i].querySelector('.social__picture').src = photos[pictureIndex].comments[i].avatar;
      comments[i].querySelector('.social__picture').alt = photos[pictureIndex].comments[i].name;
      comments[i].querySelector('.social__text').textContent = photos[pictureIndex].comments[i].message;
    }
  };

  var previewPictureClickHandler = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    selectedPicture = evt.currentTarget;
    pictureIndex = selectedPicture.querySelector('.picture__img').getAttribute('src').replace(NUMBERS_DISMATCH, '') - 1;
    constructBigPicture();
    bigPicture.classList.remove('hidden');
    bigPictureCancelButton.focus();
    window.util.addModalOpen();
    document.addEventListener('keydown', bigPictureEscPressHandler);
  };

  previewPictures.forEach(function (previewPicture) {
    previewPicture.addEventListener('click', previewPictureClickHandler);
  });

  bigPictureCancelButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeBigPicture();
  });

  var bigPictureEscPressHandler = function (evt) {
    if (evt.key === ESC_KEY) {
      closeBigPicture();
    }
  };

  var closeBigPicture = function () {
    document.removeEventListener('keydown', bigPictureEscPressHandler);
    bigPicture.classList.add('hidden');
    selectedPicture.focus();
    window.util.removeModalOpen();
  };

  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');
})();
