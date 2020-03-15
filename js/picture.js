'use strict';

(function () {
  var pictures = window.preview.pictures;
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  var renderPicture = function (photo) {
    var picture = pictureTemplate.cloneNode(true);
    picture.querySelector('.picture__img').src = photo.url;
    picture.querySelector('.picture__likes').textContent = photo.likes;
    picture.querySelector('.picture__comments').textContent = photo.comments.length;

    return picture;
  };

  var makePictures = function () {
    var fragment = document.createDocumentFragment();
    window.data.photos.forEach(function (photo) {
      fragment.appendChild(renderPicture(photo));
    });

    return fragment;
  };

  pictures.appendChild(makePictures());
})();
