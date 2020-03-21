'use strict';

(function () {
  var pictures = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  var renderPicture = function (photo) {
    var picture = pictureTemplate.cloneNode(true);
    picture.querySelector('.picture__img').src = photo.url;
    picture.querySelector('.picture__likes').textContent = photo.likes;
    picture.querySelector('.picture__comments').textContent = photo.comments.length;

    return picture;
  };

  var makePictures = function (photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (photo) {
      fragment.appendChild(renderPicture(photo));
    });

    pictures.appendChild(fragment);
  };

  window.pictures = {
    addToPage: makePictures
  };
})();
