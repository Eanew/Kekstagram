'use strict';

(function () {
  var ERROR_MESSAGE_TIMEOUT = 6000;
  var COMMENTS_DISPLAY_STEP = 5;

  var filters = document.querySelector('.img-filters');
  var pictures = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancelButton = bigPicture.querySelector('.big-picture__cancel');
  var commentTemplate = document.querySelector('#comment').content;
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var commentsList = bigPicture.querySelector('.social__comments');
  var commentsCount = bigPicture.querySelector('.social__comment-count');
  var displayedComments = commentsCount.querySelector('#comments-displayed');
  var selectedPicture = '';
  var photos = [];

  var collectCommentsFragment = function (photo, startIndex, commentsAmount) {
    var fragment = document.createDocumentFragment();

    for (var i = startIndex; i < commentsAmount; i++) {
      var comment = commentTemplate.cloneNode(true);
      comment.querySelector('.social__picture').src = photo.comments[i].avatar;
      comment.querySelector('.social__picture').alt = photo.comments[i].name;
      comment.querySelector('.social__text').textContent = photo.comments[i].message;

      fragment.appendChild(comment);
    }
    return fragment;
  };

  var currentPhoto = {};
  var commentsAmount = 0;
  var startIndex = 0;

  var commentsLoaderClickHandler = function () {
    if (currentPhoto.comments.length > (commentsAmount + COMMENTS_DISPLAY_STEP)) {
      commentsAmount += COMMENTS_DISPLAY_STEP;
    } else {
      commentsAmount = currentPhoto.comments.length;
      commentsLoader.classList.add('hidden');
      commentsLoader.removeEventListener('click', commentsLoaderClickHandler);
    }
    startIndex += COMMENTS_DISPLAY_STEP;
    displayedComments.textContent = displayedComments.textContent.replace(window.util.Regular.FIRST_NUMBER, commentsAmount);
    commentsList.appendChild(collectCommentsFragment(currentPhoto, startIndex, commentsAmount));
  };

  var addComments = function (photo) {
    currentPhoto = photo;
    commentsAmount = photo.comments.length;
    startIndex = 0;

    if (commentsAmount > COMMENTS_DISPLAY_STEP) {
      commentsAmount = COMMENTS_DISPLAY_STEP;
      commentsLoader.classList.remove('hidden');
      commentsLoader.addEventListener('click', commentsLoaderClickHandler);
    }
    displayedComments.textContent = displayedComments.textContent.replace(window.util.Regular.FIRST_NUMBER, commentsAmount);
    commentsList.appendChild(collectCommentsFragment(photo, startIndex, commentsAmount));
  };

  var constructBigPicture = function (photo) {
    bigPicture.querySelector('.big-picture__img').querySelector('img').src = photo.url;
    bigPicture.querySelector('.social__caption').textContent = photo.description;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;

    addComments(photo);
  };

  var previewPictureClickHandler = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    selectedPicture = evt.currentTarget;

    var picture = photos.filter(function (photo) {
      return photo.url === selectedPicture.querySelector('.picture__img').getAttribute('src');
    })[0];
    constructBigPicture(picture);

    bigPicture.classList.remove('hidden');
    bigPictureCancelButton.focus();
    window.util.setModalOpenedMode();
    document.addEventListener('keydown', bigPictureEscPressHandler);
  };

  var addPreviewClickHandler = function () {
    pictures.querySelectorAll('.picture').forEach(function (picture) {
      picture.addEventListener('click', previewPictureClickHandler);
    });
  };

  bigPictureCancelButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeBigPicture();
  });

  var bigPictureEscPressHandler = function (evt) {
    window.util.isEscEvent(evt, closeBigPicture);
  };

  var clearCommentList = function () {
    commentsLoader.classList.add('hidden');
    commentsLoader.removeEventListener('click', commentsLoaderClickHandler);
    commentsList.querySelectorAll('.social__comment')
    .forEach(function (comment) {
      comment.remove();
    });
  };

  var closeBigPicture = function () {
    document.removeEventListener('keydown', bigPictureEscPressHandler);
    bigPicture.classList.add('hidden');
    selectedPicture.focus();
    window.util.setModalClosedMode();
    clearCommentList();
  };

  var loadSuccessHandler = function (response) {
    window.pictures.addToPage(response);
    response.forEach(function (element) {
      photos.push(element);
    });
    addPreviewClickHandler();
    filters.classList.remove('img-filters--inactive');
  };

  var loadErrorHandler = function () {
    window.util.showAlert('Ошибка загрузки данных', 'orange', ERROR_MESSAGE_TIMEOUT);
  };

  window.backend.load(loadSuccessHandler, loadErrorHandler);

  window.preview = {
    photos: photos,
    addClickHandler: addPreviewClickHandler
  };
})();
