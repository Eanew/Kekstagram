'use strict';

(function () {
  var pictures = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancelButton = bigPicture.querySelector('.big-picture__cancel');
  var commentsCount = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var commentsList = bigPicture.querySelector('.social__comments');
  var commentTemplate = document.querySelector('#comment').content;
  var selectedPicture;
  var photos = {};

  var collectCommentsFragment = function (photo, firstIndex, lastIndex) {
    var fragment = document.createDocumentFragment();

    for (var i = firstIndex; i < lastIndex; i++) {
      var comment = commentTemplate.cloneNode(true);
      comment.querySelector('.social__picture').src = photo.comments[i].avatar;
      comment.querySelector('.social__picture').alt = photo.comments[i].name;
      comment.querySelector('.social__text').textContent = photo.comments[i].message;

      fragment.appendChild(comment);
    }
    return fragment;
  };

  var addComments = function (photo) {
    var COMMENTS_DISPLAY_STEP = 5;
    var firstIndex = 0;
    var lastIndex = photo.comments.length;

    var commentsLoaderClickHandler = function (evt) {
      evt.preventDefault();
      firstIndex += COMMENTS_DISPLAY_STEP;
      if (photo.comments.length > (lastIndex + COMMENTS_DISPLAY_STEP)) {
        lastIndex += COMMENTS_DISPLAY_STEP;
      } else {
        lastIndex = photo.comments.length;
        commentsLoader.removeEventListener('click', commentsLoaderClickHandler);
        commentsLoader.classList.add('hidden');
      }
      commentsList.appendChild(collectCommentsFragment(photo, firstIndex, lastIndex));
    };

    if (lastIndex > COMMENTS_DISPLAY_STEP) {
      lastIndex = COMMENTS_DISPLAY_STEP;
      commentsLoader.classList.remove('hidden');
      commentsLoader.addEventListener('click', commentsLoaderClickHandler);
    }
    commentsList.appendChild(collectCommentsFragment(photo, firstIndex, lastIndex));
  };

  var constructBigPicture = function (photo) {
    bigPicture.querySelector('.big-picture__img').querySelector('img').src = photo.url;
    bigPicture.querySelector('.social__caption').textContent = photo.description;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;

    if (photo.comments) {
      addComments(photo);
    } else {
      commentsCount.classList.add('hidden');
      commentsList.classList.add('hidden');
    }
  };

  var previewPictureClickHandler = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    selectedPicture = evt.currentTarget;

    var picture = photos.data.filter(function (photo) {
      return photo.url === selectedPicture.querySelector('.picture__img').getAttribute('src');
    })[0];
    constructBigPicture(picture);

    bigPicture.classList.remove('hidden');
    bigPictureCancelButton.focus();
    window.util.setModalOpenedMode();
    document.addEventListener('keydown', bigPictureEscPressHandler);
  };

  var addClickHandler = function () {
    pictures.querySelectorAll('.picture').forEach(function (picture) {
      picture.addEventListener('click', previewPictureClickHandler);
    });
  };

  bigPictureCancelButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeBigPicture();
  });

  var bigPictureEscPressHandler = function (evt) {
    if (evt.key === window.util.ESC_KEY) {
      closeBigPicture();
    }
  };

  var clearComments = function () {
    commentsLoader.classList.add('hidden');
    commentsCount.classList.remove('hidden');
    commentsList.classList.remove('hidden');
    commentsList.querySelectorAll('.social__comment').forEach(function (comment) {
      comment.remove();
    });
  };

  var closeBigPicture = function () {
    document.removeEventListener('keydown', bigPictureEscPressHandler);
    bigPicture.classList.add('hidden');
    selectedPicture.focus();
    window.util.setModalClosedMode();
    clearComments();
  };

  // commentsCount.classList.add('hidden');
  // commentsLoader.classList.add('hidden');

  window.preview = {
    photos: photos,
    addClickHandler: function () {
      addClickHandler();
    }
  };
})();
