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
  photos.forEach(function (photo) {
    fragment.appendChild(renderPicture(photo));
  });

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
var effectsList = uploadOverlay.querySelector('.effects__list');
var defaultFilter = effectsList.querySelector('#effect-none');
var DEFAULT_FILTER_CLASS = 'effects__preview--none';
var imgFilterClass;

var setDefaultFilter = function () {
  defaultFilter.checked = true;
  uploadPreviewImg.classList.remove(imgFilterClass);
  imgFilterClass = DEFAULT_FILTER_CLASS;
  uploadPreviewImg.classList.add(imgFilterClass);
  refreshCurrentFilter();
};

var setDefaultImgScale = function () {
  currentScaleValue = maxScaleValue;
  switchImgSize();
};

var setDefaultUploadSettings = function () {
  if (!defaultFilter.checked) {
    setDefaultFilter();
  }
  if (currentScaleValue !== maxScaleValue) {
    setDefaultImgScale();
  }
};

var ESC_KEY = 'Escape';

var uploadOverlayEscPressHandler = function (evt) {
  if (evt.key === ESC_KEY) {
    closeUploadOverlay();
  }
};

var uploadInputPreviousValue;

var openUploadOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  addModalOpen();
  uploadInputPreviousValue = uploadInput.value;
  document.addEventListener('keydown', uploadOverlayEscPressHandler);
};

var closeUploadOverlay = function () {
  document.removeEventListener('keydown', uploadOverlayEscPressHandler);
  uploadOverlay.classList.add('hidden');
  removeModalOpen();
  uploadInput.value = '';
};

uploadInput.addEventListener('change', function () {
  if (uploadInputPreviousValue && (uploadInput.value !== uploadInputPreviousValue)) {
    setDefaultUploadSettings();
  }
  openUploadOverlay();
});

overlayCloseButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  closeUploadOverlay();
});

openUploadOverlay();
// временно для работы

var uploadPreview = uploadOverlay.querySelector('.img-upload__preview');
var uploadPreviewImg = uploadPreview.querySelector('img');
var effectLevel = uploadOverlay.querySelector('.effect-level');
var effectLevelInput = effectLevel.querySelector('.effect-level__value');
var effectLine = effectLevel.querySelector('.effect-level__line');
var effectPin = effectLine.querySelector('.effect-level__pin');

var effectLineWidth = getComputedStyle(effectLine).width.replace('px', '');
var effectPinX;

var getPinPositionInPercent = function () {
  effectPinX = getComputedStyle(effectPin).left.replace('px', '');
  return Math.round(effectPinX / effectLineWidth * 100);
};

var defaultEffectValue = 100;
var fixedEffectValue;
var totalValue;

var setEffectSaturation = function () {
  totalValue = currentFilter.calculableValue * effectLevelInput.value;
  uploadPreviewImg.style.filter = currentFilter.attributeString.replace(currentFilter.defaultValue, totalValue);
  uploadPreviewImg.style.WebkitFilter = currentFilter.attributeString.replace(currentFilter.defaultValue, totalValue);
  fixedEffectValue = effectLevelInput.value;
};

var effectPinMouseupHandler = function () {
  effectLevelInput.value = getPinPositionInPercent();
  if (effectLevelInput.value !== fixedEffectValue) { // имитация события 'change' для effectLevelInput, чтобы вызов setEffectSaturation срабатывал не чаще 100 раз за диапазон движения effectPin
    setEffectSaturation();
  }
};

effectPin.addEventListener('mouseup', effectPinMouseupHandler);
effectLevel.classList.add('hidden');

var NUMBERS_DISMATCH = /(\D+)*[^.\d]/g;
var currentFilter = {};

var refreshCurrentFilter = function () {
  uploadPreviewImg.style.filter = '';
  uploadPreviewImg.style.WebkitFilter = '';
  if (imgFilterClass !== DEFAULT_FILTER_CLASS) {
    currentFilter.attributeString = getComputedStyle(uploadPreviewImg).filter;
    currentFilter.defaultValue = currentFilter.attributeString.replace(NUMBERS_DISMATCH, '');
    currentFilter.calculableValue = currentFilter.defaultValue / 100;
    effectLevelInput.value = defaultEffectValue;
    setEffectSaturation();
    effectLevel.classList.remove('hidden');
  } else {
    effectLevel.classList.add('hidden');
  }
};

var effectsListChangeHandler = function (evt) {
  var EFFECT_ID_TEMPLATE = 'effect-';
  var PREVIEW_CLASS_TEMPLATE = 'effects__preview--';
  if (evt.target && evt.target.matches('input[type="radio"]')) {
    uploadPreviewImg.classList.remove(imgFilterClass);
    imgFilterClass = evt.target.id.replace(EFFECT_ID_TEMPLATE, PREVIEW_CLASS_TEMPLATE);
    uploadPreviewImg.classList.add(imgFilterClass);
    refreshCurrentFilter();
  }
};

effectsList.addEventListener('change', effectsListChangeHandler);

var imgScale = uploadOverlay.querySelector('.scale');
var buttonSmaller = imgScale.querySelector('.scale__control--smaller');
var buttonBigger = imgScale.querySelector('.scale__control--bigger');
var ImgScaleInput = imgScale.querySelector('.scale__control--value');
var minScaleValue = 25;
var maxScaleValue = 100;
var currentScaleValue = maxScaleValue;

var switchImgSize = function () {
  ImgScaleInput.value = currentScaleValue + '%';
  uploadPreviewImg.style.transform = 'scale(' + currentScaleValue / 100 + ')';
};
switchImgSize();

buttonSmaller.addEventListener('click', function () {
  if (currentScaleValue > minScaleValue) {
    currentScaleValue -= 25;
    switchImgSize();
  }
});

buttonBigger.addEventListener('click', function () {
  if (currentScaleValue < maxScaleValue) {
    currentScaleValue += 25;
    switchImgSize();
  }
});

var uploadText = uploadOverlay.querySelector('.img-upload__text');
var hashTagInput = uploadText.querySelector('.text__hashtags');
var descriptionInput = uploadText.querySelector('.text__description');

var SPACE = ' ';
var VALID_HASH_TAG_MATCH = /^#[A-Za-zА-Яа-я0-9]+/;
var descriptionCommentMaxLength = 140;
var isDescriptionInputValid = true;
var hashTagsMaxLength = 20;
var hashTagsMaxCount = 5;
var hashTags;
var isOkay = true;
var isHashTagValid;

var checkHashTagsValidity = function () {
  hashTagInput.setCustomValidity('');
  hashTags = hashTagInput.value.split(SPACE);
  isOkay = true;
  if (hashTags.length <= hashTagsMaxCount) { // 1 проверка
    for (i = 0; i < hashTags.length; i++) {
      isHashTagValid = !hashTags[i].replace(VALID_HASH_TAG_MATCH, ''); // это пока единственное, что пришло в голову
      if (hashTags[i].length <= hashTagsMaxLength && isHashTagValid) { // 2, 3
        for (var j = i + 1; j < hashTags.length; j++) {
          if (hashTags[j] === hashTags[i]) { // 4
            hashTagInput.setCustomValidity('Один и тот же хэш-тег нельзя использовать дважды. Гореть тебе в аду!');
            isOkay = false;
            return;
          }
        }
      } else {
        hashTagInput.setCustomValidity('В хэш-тег должна входить решётка и от 1 до 19 букв или чисел после неё. Например, #ХэшTag09. Хэш-теги разделяются пробелами.');
        isOkay = false;
        return;
      }
    }
  } else {
    hashTagInput.setCustomValidity('Максимальное число хэш-тегов - 5');
    isOkay = false;
    return;
  }
};

hashTagInput.addEventListener('change', function () {
  checkHashTagsValidity();
});

var checkDescriptionValidity = function () {
  descriptionInput.setCustomValidity('');
  isDescriptionInputValid = true;
  if (descriptionInput.value.length > descriptionCommentMaxLength) {
    descriptionInput.setCustomValidity('Максимальная длина комментария - 140 символов.');
    isDescriptionInputValid = false;
  }
};

descriptionInput.addEventListener('change', function () {
  checkDescriptionValidity();
});

uploadText.addEventListener('keydown', function (evt) {
  if (evt.key === ESC_KEY) {
    evt.stopPropagation();
  }
});

uploadForm.setAttribute('action', 'https://js.dump.academy/kekstagram');

uploadForm.addEventListener('submit', function () {
  if (isOkay && isDescriptionInputValid) {
    // console.log('its realy fine');
  }
});
