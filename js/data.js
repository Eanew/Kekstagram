'use strict';

(function () {
  var MESSAGES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var NAMES = [];
  var AVATARS = [];
  var PHOTO_URL_TEMPLATE = 'photos/{{i}}.jpg';
  var AVATAR_URL_TEMPLATE = 'img/avatar-{{случайное число от 1 до 6}}.svg';
  var COMMENTS_COUNT = 6;
  var MIN_COMMENTS_COUNT = 2;

  for (var i = 0; i < COMMENTS_COUNT; i++) {
    AVATARS[i] = AVATAR_URL_TEMPLATE.replace('{{случайное число от 1 до 6}}', (i + 1));
    NAMES[i] = 'User ' + (i + 1);
  }

  var getRandomCount = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var getUniqueRandomItem = function (collection) {
    var randomCount = getRandomCount(0, collection.length - 1);
    return collection.splice(randomCount, 1)[0];
  };

  var makeComments = function () {
    var clonedMessages = MESSAGES.slice();
    var clonedNames = NAMES.slice();
    var clonedAvatars = AVATARS.slice();
    var comments = [];

    for (var j = 0; j < COMMENTS_COUNT; j++) {
      comments[j] = {
        avatar: getUniqueRandomItem(clonedAvatars),
        message: getUniqueRandomItem(clonedMessages),
        name: getUniqueRandomItem(clonedNames)
      };
    }

    return comments;
  };

  var photosCount = 25;

  var makePhotos = function () {
    var comments = makeComments();
    var commentsAmount = getRandomCount(2, COMMENTS_COUNT);
    var photos = [];

    for (i = 0; i < photosCount; i++) {
      photos[i] = {
        url: PHOTO_URL_TEMPLATE.replace('{{i}}', (i + 1)),
        description: 'Это фотография!',
        likes: getRandomCount(15, 200),
        comments: comments.slice(0, commentsAmount)
      };
      comments = makeComments();
      commentsAmount = getRandomCount(MIN_COMMENTS_COUNT, COMMENTS_COUNT);
    }

    return photos;
  };

  var photos = makePhotos();

  window.data = {
    photos: photos
  };
})();
