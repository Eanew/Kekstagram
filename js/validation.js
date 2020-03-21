'use strict';

(function () {
  var VALID_HASH_TAG_MATCH = /^#[A-Za-zА-Яа-я0-9]+/;
  var HASH_TAG_MAX_LENGTH = 20;
  var COMMENT_MAX_LENGTH = 140;

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var uploadText = uploadOverlay.querySelector('.img-upload__text');
  var hashTagInput = uploadText.querySelector('.text__hashtags');
  var descriptionInput = uploadText.querySelector('.text__description');

  var checkHashTagsValidity = function () {
    var hashTagsLimit = 5;
    var isHashTagValid;
    var isSimilarityFinded;
    var hashTags;
    var customValidityConstructor = '';
    hashTagInput.setCustomValidity(customValidityConstructor);
    hashTags = hashTagInput.value.split(window.util.EMPTY_SPACE_MATCH);
    if (hashTags[0] === '') {
      hashTagsLimit++;
    }
    if (hashTags[hashTags.length - 1] === '') {
      hashTagsLimit++;
    }
    if (hashTags.length > hashTagsLimit) {
      customValidityConstructor += 'Максимальное число хэш-тегов - 5. Хэш-тэги разделяются пробелами. ';
    }
    hashTags.forEach(function (hashTag, i) {
      isHashTagValid = !hashTag.replace(VALID_HASH_TAG_MATCH, '');
      if (!isHashTagValid) {
        customValidityConstructor += 'Хэш-тег начинается с решётки (#) и состоит из цифр и букв, в т.ч. заглавных. ';
      }
      if (hashTag.length > HASH_TAG_MAX_LENGTH) {
        customValidityConstructor += 'Максимальное количество символов в хэш-теге - 20. ';
      }
      if (!isSimilarityFinded) {
        for (var j = i + 1; j < hashTags.length; j++) {
          if (hashTags[j] === hashTags[i] && hashTags[j] !== '') {
            isSimilarityFinded = true;
            customValidityConstructor += 'Один и тот же хэш-тег нельзя использовать дважды. ';
            break;
          }
        }
      }
    });
    hashTagInput.setCustomValidity(customValidityConstructor);
  };

  hashTagInput.addEventListener('input', function () {
    checkHashTagsValidity();
  });

  var checkDescriptionValidity = function () {
    descriptionInput.setCustomValidity('');
    if (descriptionInput.value.length > COMMENT_MAX_LENGTH) {
      descriptionInput.setCustomValidity('Максимальная длина комментария - 140 символов.');
    }
  };

  descriptionInput.addEventListener('input', function () {
    checkDescriptionValidity();
  });

  uploadText.addEventListener('keydown', function (evt) {
    if (evt.key === window.util.ESC_KEY) {
      evt.stopPropagation();
      evt.target.blur();
    }
  });
})();
