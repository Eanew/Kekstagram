'use strict';

var photosCount = 25;
var PHOTO_URL_TEMPLATE = 'photos/{{i}}.jpg';

var commentsCount = 6;
var messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var names = ['Морриган', 'Алистер', 'Лелиана', 'Стэн', 'Шейла', 'Зевран'];
var AVATAR_URL_TEMPLATE = 'img/avatar-{{случайное число от 1 до 6}}.svg';
var avatars = [];
var i;

for (i = 0; i < commentsCount; i++) {
  avatars[i] = AVATAR_URL_TEMPLATE.replace('{{случайное число от 1 до 6}}', (i + 1));
}

var getRandomCount = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getUniqueRandomItem = function (collection) {
  var randomCount = getRandomCount(0, collection.length - 1);
  return collection.splice(randomCount, 1)[0];
};

var makeComments = function () {
  var comments = [];

  for (i = 0; i < commentsCount; i++) {
    comments[i] = {
      avatar: getUniqueRandomItem(avatars),
      message: getUniqueRandomItem(messages),
      name: getUniqueRandomItem(names)
    };
  }

  return comments;
};

var makePhotos = function () {
  var photos = [];

  for (i = 0; i < photosCount; i++) {
    photos[i] = {
      url: PHOTO_URL_TEMPLATE.replace('{{i}}', (i + 1)),
      description: 'Описание фотографии', // Не реализовано
      likes: getRandomCount(15, 200),
      comments: makeComments.slice(0, getRandomCount(1, commentsCount))
    };
  }

  return photos;
};
