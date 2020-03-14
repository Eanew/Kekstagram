'use strict';

var SPACE = ' ';
var ESC_KEY = 'Escape';
var ARROW_LEFT_KEY = 'ArrowLeft';
var ARROW_RIGHT_KEY = 'ArrowRight';
var NUMBERS_DISMATCH = /(\D+)*[^.\d]/g;
var VALID_HASH_TAG_MATCH = /^#[A-Za-zА-Яа-я0-9]+/;
var EMPTY_SPACE = /\s+/g;
var PHOTO_URL_TEMPLATE = 'photos/{{i}}.jpg';
var EFFECT_ID_TEMPLATE = 'effect-';
var PREVIEW_CLASS_TEMPLATE = 'effects__preview--';
var DEFAULT_FILTER_CLASS = 'effects__preview--none';
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

// openUploadOverlay();
// addModalOpen();

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
    commentsAmount = getRandomCount(2, COMMENTS_COUNT);
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

var previewPictures = pictures.querySelectorAll('.picture');
var bigPicture = document.querySelector('.big-picture');
var bigPictureCancelButton = bigPicture.querySelector('.big-picture__cancel');
var commentsList = bigPicture.querySelector('.social__comments');
var comments = commentsList.querySelectorAll('.social__comment');
var selectedPicture;
var pictureIndex;

var constructBigPicture = function () {
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = photos[pictureIndex].url;
  bigPicture.querySelector('.likes-count').textContent = photos[pictureIndex].likes;
  bigPicture.querySelector('.comments-count').textContent = photos[pictureIndex].comments.length;
  bigPicture.querySelector('.social__caption').textContent = photos[pictureIndex].description;

  for (i = 0; i < comments.length; i++) {
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
  addModalOpen();
  document.addEventListener('keydown', bigPictureEscPressHandler);
};

for (i = 0; i < previewPictures.length; i++) {
  previewPictures[i].addEventListener('click', previewPictureClickHandler);
}

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
  removeModalOpen();
};

bigPicture.querySelector('.social__comment-count').classList.add('hidden');
bigPicture.querySelector('.comments-loader').classList.add('hidden');

var addModalOpen = function () {
  document.querySelector('body').classList.add('modal-open');
};

var removeModalOpen = function () {
  document.querySelector('body').classList.remove('modal-open');
};

var uploadForm = document.querySelector('.img-upload__form');
var uploadInput = uploadForm.querySelector('#upload-file');
var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
var overlayCloseButton = uploadOverlay.querySelector('#upload-cancel');
var effectsList = uploadOverlay.querySelector('.effects__list');
var defaultFilter = effectsList.querySelector('#effect-none');
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

var uploadOverlayEscPressHandler = function (evt) {
  if (evt.key === ESC_KEY) {
    closeUploadOverlay();
  }
};

var uploadInputPreviousValue;

var openUploadOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  buttonSmaller.focus();
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

var uploadPreview = uploadOverlay.querySelector('.img-upload__preview');
var uploadPreviewImg = uploadPreview.querySelector('img');
var effectLevel = uploadOverlay.querySelector('.effect-level');
var effectLevelInput = effectLevel.querySelector('.effect-level__value');
var effectLine = effectLevel.querySelector('.effect-level__line');
var effectDepth = effectLine.querySelector('.effect-level__depth');
var effectPin = effectLine.querySelector('.effect-level__pin');

var effectLineWidth;
var effectPinX;

var getPinPositionInPercent = function () {
  effectPinX = effectPin.style.left.replace('px', '');
  return Math.round(effectPinX / effectLineWidth * 100);
};

var fixedEffectValue;
var totalValue;

var setEffectSaturation = function () {
  totalValue = currentFilter.calculableValue * effectLevelInput.value;
  uploadPreviewImg.style.filter = currentFilter.attributeString.replace(currentFilter.defaultValue, totalValue);
  uploadPreviewImg.style.WebkitFilter = currentFilter.attributeString.replace(currentFilter.defaultValue, totalValue);
  fixedEffectValue = effectLevelInput.value;
};

var setEffectLevelValue = function () {
  effectDepth.style.width = effectPin.style.left;
  effectLevelInput.value = getPinPositionInPercent();
  if (effectLevelInput.value !== fixedEffectValue) {
    setEffectSaturation();
  }
};

effectPin.setAttribute('tabindex', '');
effectLevel.setAttribute('tabindex', '0');

effectLevel.addEventListener('mousedown', function (evt) {
  var startCoordX;
  var effectLineStart = effectLine.getBoundingClientRect().left;
  if ((evt.clientX - effectLineStart) >= 0 && evt.clientX <= (effectLineStart + effectLineWidth)) {
    startCoordX = evt.clientX;
  } else if ((evt.clientX - effectLineStart) < 0) {
    startCoordX = effectLineStart;
  } else {
    startCoordX = effectLineStart + effectLineWidth;
  }
  var effectPinNewPosition = startCoordX - effectLineStart;
  effectPin.style.left = effectPinNewPosition + 'px';
  setEffectLevelValue();

  var effectPinMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();
    var shiftX = moveEvt.clientX - startCoordX;
    var totalX = +effectPin.style.left.replace('px', '') + shiftX;
    if (totalX >= 0 && totalX <= effectLineWidth) {
      startCoordX = moveEvt.clientX;
    } else if (totalX < 0) {
      totalX = 0;
    } else {
      totalX = effectLineWidth;
    }
    effectPin.style.left = totalX + 'px';
    setEffectLevelValue();
  };

  var effectPinMouseupHandler = function (mouseUpEvt) {
    mouseUpEvt.preventDefault();
    document.removeEventListener('mousemove', effectPinMoveHandler);
    document.removeEventListener('mouseup', effectPinMouseupHandler);
  };
  document.addEventListener('mousemove', effectPinMoveHandler);
  document.addEventListener('mouseup', effectPinMouseupHandler);
});

effectLevel.addEventListener('keydown', function (evt) {
  var pinDirection;

  var movePin = function () {
    var pinStep = effectLineWidth / 50;
    var shiftX = pinDirection * pinStep;
    var totalX = +effectPin.style.left.replace('px', '') + shiftX;
    if (totalX < 0) {
      totalX = 0;
    }
    if (totalX > effectLineWidth) {
      totalX = effectLineWidth;
    }
    effectPin.style.left = totalX + 'px';
    setEffectLevelValue();
  };

  if (evt.key === ARROW_LEFT_KEY) {
    pinDirection = -1;
    movePin();
  }
  if (evt.key === ARROW_RIGHT_KEY) {
    pinDirection = 1;
    movePin();
  }
});

effectLevel.classList.add('hidden');

var currentFilter = {};

var refreshCurrentFilter = function () {
  uploadPreviewImg.style.filter = '';
  uploadPreviewImg.style.WebkitFilter = '';
  if (imgFilterClass !== DEFAULT_FILTER_CLASS) {
    currentFilter.attributeString = getComputedStyle(uploadPreviewImg).filter;
    currentFilter.defaultValue = currentFilter.attributeString.replace(NUMBERS_DISMATCH, '');
    currentFilter.calculableValue = currentFilter.defaultValue / 100;
    effectLevel.classList.remove('hidden');
    effectLineWidth = +getComputedStyle(effectLine).width.replace('px', '');
    effectPin.style.left = effectLineWidth + 'px';
    setEffectLevelValue();
  } else {
    effectLevel.classList.add('hidden');
  }
};

var effectsListChangeHandler = function (evt) {
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

var descriptionCommentMaxLength = 140;
var hashTagsMaxLength = 20;
var hashTagsMaxCount = 5;
var hashTags;
var isHashTagValid;

var checkHashTagsValidity = function () {
  var isSimilarityFinded;
  var customValidityConstructor = '';
  hashTagInput.setCustomValidity(customValidityConstructor);
  hashTagInput.value = hashTagInput.value.replace(EMPTY_SPACE, SPACE);
  hashTags = hashTagInput.value.split(SPACE);
  if (hashTags.length > hashTagsMaxCount) {
    customValidityConstructor += 'Максимальное число хэш-тегов - 5. Хэш-тэги разделяются пробелами. ';
  }
  for (i = 0; i < hashTags.length; i++) {
    isHashTagValid = !hashTags[i].replace(VALID_HASH_TAG_MATCH, '');
    if (!isHashTagValid) {
      customValidityConstructor += 'Хэш-тег начинается с решётки (#) и состоит из цифр и букв, в т.ч. заглавных. ';
    }
    if (hashTags[i].length > hashTagsMaxLength) {
      customValidityConstructor += 'Максимальное количество символов в хэш-теге - 20. ';
    }
    if (!isSimilarityFinded) {
      (function () {
        for (var j = i + 1; j < hashTags.length; j++) {
          if (hashTags[j] === hashTags[i]) {
            isSimilarityFinded = true;
            customValidityConstructor += 'Один и тот же хэш-тег нельзя использовать дважды. ';
            return;
          }
        }
      })();
    }
  }
  hashTagInput.setCustomValidity(customValidityConstructor);
};

hashTagInput.addEventListener('input', function () {
  checkHashTagsValidity();
});

var checkDescriptionValidity = function () {
  descriptionInput.setCustomValidity('');
  if (descriptionInput.value.length > descriptionCommentMaxLength) {
    descriptionInput.setCustomValidity('Максимальная длина комментария - 140 символов.');
  }
};

descriptionInput.addEventListener('input', function () {
  checkDescriptionValidity();
});

uploadText.addEventListener('keydown', function (evt) {
  if (evt.key === ESC_KEY) {
    evt.stopPropagation();
  }
});

uploadForm.setAttribute('action', 'https://js.dump.academy/kekstagram');
