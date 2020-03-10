'use strict';

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
var AVATAR_URL_TEMPLATE = 'img/avatar-{{случайное число от 1 до 6}}.svg';
var COMMENTS_COUNT = 6;

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

var PHOTO_URL_TEMPLATE = 'photos/{{i}}.jpg';
var photosCount = 25;

var makePhotos = function () {
  var comments = makeComments();
  var commentsAmount = getRandomCount(2, COMMENTS_COUNT);
  var photos = [];

  for (i = 0; i < photosCount; i++) {
    photos[i] = {
      url: PHOTO_URL_TEMPLATE.replace('{{i}}', (i + 1)),
      description: 'Описание фотографии', // Не реализовано
      likes: getRandomCount(15, 200),
      comments: comments.slice(0, commentsAmount)
    };
    comments = makeComments(); // Обновляет случайные комментарии
    commentsAmount = getRandomCount(2, COMMENTS_COUNT); // Обновляет случайное количество случайных комментариев
  }

  return photos;
};

var photos = makePhotos();

var pictures = document.querySelector('.pictures');
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
  for (i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPicture(photos[i]));
  }

  return fragment;
};

pictures.appendChild(makePictures());

var bigPicture = document.querySelector('.big-picture');
// bigPicture.classList.remove('hidden');
bigPicture.querySelector('.big-picture__img').querySelector('img').src = photos[0].url;
bigPicture.querySelector('.likes-count').textContent = photos[0].likes;
bigPicture.querySelector('.comments-count').textContent = photos[0].comments.length;
bigPicture.querySelector('.social__caption').textContent = photos[0].description;

var commentsList = bigPicture.querySelector('.social__comments');
var comments = commentsList.querySelectorAll('.social__comment');

for (i = 0; i < comments.length; i++) {
  comments[i].querySelector('.social__picture').src = photos[0].comments[i].avatar;
  comments[i].querySelector('.social__picture').alt = photos[0].comments[i].name;
  comments[i].querySelector('.social__text').textContent = photos[0].comments[i].message;
}

var commentsCount = bigPicture.querySelector('.social__comment-count');
var commentsLoader = bigPicture.querySelector('.comments-loader');
commentsCount.classList.add('hidden');
commentsLoader.classList.add('hidden');

var addModalOpen = function () {
  document.querySelector('body').classList.add('modal-open');
};

var removeModalOpen = function () {
  document.querySelector('body').classList.remove('modal-open');
};

// addModalOpen();

var uploadForm = document.querySelector('.img-upload__form');
var uploadInput = uploadForm.querySelector('#upload-file');
var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
var overlayCloseButton = uploadOverlay.querySelector('#upload-cancel');

var ESC_KEY = 'Escape';

var uploadOverlayEscPressHandler = function (evt) {
  if (evt.key === ESC_KEY) {
    closeUploadOverlay();
  }
};

var openUploadOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  addModalOpen();
  document.addEventListener('keydown', uploadOverlayEscPressHandler);
};

var closeUploadOverlay = function () {
  uploadOverlay.classList.add('hidden');
  removeModalOpen();
  uploadInput.value = '';
  document.removeEventListener('keydown', uploadOverlayEscPressHandler);
};

uploadInput.addEventListener('change', function () {
  openUploadOverlay();
});

overlayCloseButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  closeUploadOverlay();
});

openUploadOverlay();

var uploadPreview = uploadOverlay.querySelector('.img-upload__preview');
var uploadPreviewImg = uploadPreview.querySelector('img');
var effectLevel = uploadOverlay.querySelector('.effect-level');
var effectLevelInput = effectLevel.querySelector('.effect-level__value');
var effectLine = effectLevel.querySelector('.effect-level__line');
var effectPin = effectLine.querySelector('.effect-level__pin');

var getPinPositionInPercent = function () {
  var effectLineWidth = getComputedStyle(effectLine).width.replace('px', '');
  var effectPinX = getComputedStyle(effectPin).left.replace('px', '');

  return Math.round(effectPinX / effectLineWidth * 100);
};


var fixedEffectValue;

var effectPinMouseupHandler = function () {
  effectLevelInput.value = getPinPositionInPercent();
  if (effectLevelInput.value !== fixedEffectValue) { // потому что я так и не понял, как правильно симулировать событие 'change' на input[type=number]
    getEffectLevel();
  }
};

effectPin.addEventListener('mouseup', effectPinMouseupHandler);

effectLevel.classList.add('hidden');
var defaultEffectLevel = 100;
var previewImgClass;
var filterTemplate = {};
// var NUMBERS_DISMATCH = /\D+/g;

var toggleEffectLevel = function () {
  if (previewImgClass !== 'effects__preview--none') {
    effectLevelInput.value = defaultEffectLevel;
    fixedEffectValue = effectLevelInput.value;
    effectLevel.classList.remove('hidden');
  } else {
    effectLevel.classList.add('hidden');
    uploadPreviewImg.style.filter = '';
    uploadPreviewImg.style.WebkitFilter = '';
  }
};

var totalValue;

// var getFilterDefaultSettings = function () {
//   filterTemplate.currentAttribute = getComputedStyle(uploadPreviewImg).filter;
//   filterTemplate.defaultValue = filterTemplate.currentAttribute.replace(NUMBERS_DISMATCH, '');
//   filterTemplate.calculableValue = filterTemplate.defaultValue / 100;
// };

var getFilterDefaultSettings = function () {
  for (i = 0; i < filters.length; i++) {
    if (filters[i].filterClass === previewImgClass) {
      filterTemplate.templateStart = filters[i].templateStart;
      filterTemplate.calculableValue = filters[i].defaultValue / 100;
      filterTemplate.templateEnd = filters[i].templateEnd;
      totalValue = filterTemplate.calculableValue * effectLevelInput.value;
      uploadPreviewImg.style.filter = filterTemplate.templateStart + totalValue + filterTemplate.templateEnd;
      uploadPreviewImg.style.WebkitFilter = filterTemplate.templateStart + totalValue + filterTemplate.templateEnd;
      return;
    }
  }
};

var getEffectLevel = function () {
  totalValue = filterTemplate.calculableValue * effectLevelInput.value;
  // uploadPreviewImg.style.filter = filterTemplate.currentAttribute.replace(filterTemplate.defaultValue, totalValue);
  uploadPreviewImg.style.filter = filterTemplate.templateStart + totalValue + filterTemplate.templateEnd;
  fixedEffectValue = effectLevelInput.value;
  console.log('значение input number изменилось');
};

var effectsListChangeHandler = function (evt) {
  var EFFECT_ID_TEMPLATE = 'effect-';
  var PREVIEW_CLASS_TEMPLATE = 'effects__preview--';

  if (evt.target && evt.target.matches('input[type="radio"]')) {
    uploadPreviewImg.classList.remove(previewImgClass);
    previewImgClass = evt.target.id.replace(EFFECT_ID_TEMPLATE, PREVIEW_CLASS_TEMPLATE);
    uploadPreviewImg.classList.add(previewImgClass);
    toggleEffectLevel();
    getFilterDefaultSettings();
    console.log(uploadPreviewImg.style.filter);
  }
};

var effectsList = uploadOverlay.querySelector('.effects__list');
effectsList.addEventListener('change', effectsListChangeHandler);

var filters = [{
  filterClass: 'effects__preview--chrome',
  templateStart: 'grayscale(',
  defaultValue: 1,
  templateEnd: ')'
},
{
  filterClass: 'effects__preview--sepia',
  templateStart: 'sepia(',
  defaultValue: 1,
  templateEnd: ')'
},
{
  filterClass: 'effects__preview--marvin',
  templateStart: 'invert(',
  defaultValue: 100,
  templateEnd: '%)'
},
{
  filterClass: 'effects__preview--phobos',
  templateStart: 'blur(',
  defaultValue: 3,
  templateEnd: 'px)'
},
{
  filterClass: 'effects__preview--heat',
  templateStart: 'brightness(',
  defaultValue: 3,
  templateEnd: ')'
}];

// меняется тип фильтра => запускается функция перебора фильтров и проверки соответствия объекта
// совпавший объект перезаписывает своими свойствами внешние переменные
// событие change на input.value вызывает функцию, которая подставляет в uploadPreviewImg.style.filter расчёт
// значений совпавшего объекта и значения input.value
// потом можно проверить изменение переключением фильтра (сброс value до 100%) и mouseup на слайдере (сброс value до 20)

// СДЕЛАЙ МАССИВ ОБЪЕКТОВ с нужными параметрами (свойствами) для каждого типа фильтра,
// потом можно будет сопоставить этот массив с коллекцией элементов списка effects__list или с чем-то вроде неё

