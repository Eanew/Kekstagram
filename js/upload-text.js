'use strict';

(function () {
  var SPACE = window.util.SPACE;
  var EMPTY_SPACE_MATCH = window.util.EMPTY_SPACE_MATCH;
  var VALID_HASH_TAG_MATCH = window.util.VALID_HASH_TAG_MATCH;

  var uploadOverlay = document.querySelector('.img-upload__overlay');
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
    hashTagInput.value = hashTagInput.value.replace(EMPTY_SPACE_MATCH, SPACE);
    hashTags = hashTagInput.value.split(SPACE);
    if (hashTags.length > hashTagsMaxCount) {
      customValidityConstructor += 'Максимальное число хэш-тегов - 5. Хэш-тэги разделяются пробелами. ';
    }
    for (var i = 0; i < hashTags.length; i++) {
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
    if (evt.key === window.util.ESC_KEY) {
      evt.stopPropagation();
    }
  });
})();
