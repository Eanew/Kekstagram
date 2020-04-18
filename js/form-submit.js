'use strict';

(function () {
  var UPLOADING_MESSAGE_TIMEOUT = 100;
  var ERROR_DESCRIPTION_PREFIX = '<br><br><small>';
  var ERROR_DESCRIPTION_POSTFIX = '</small>';

  var pageMain = document.querySelector('main');
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadInput = uploadForm.querySelector('#upload-file');
  var uploadLabel = uploadForm.querySelector('.img-upload__label');
  var uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
  var hashTagInput = uploadForm.querySelector('.text__hashtags');
  var submitButton = uploadForm.querySelector('#upload-submit');
  var successMessage = document.querySelector('#success').content.querySelector('.success');
  var errorMessage = document.querySelector('#error').content.querySelector('.error');
  var uploadingMessageTemplate = document.querySelector('#messages').content.querySelector('.img-upload__message');
  var uploadingMessage = '';
  var isResultAlreadyReceived = false;

  var uploadingMessageClickHandler = function () {
    document.removeEventListener('click', uploadingMessageClickHandler);
    uploadingMessage.remove();
  };

  var showUploadingMessage = function (xhr) {
    uploadingMessage = uploadingMessageTemplate.cloneNode(true);

    uploadingMessage.addEventListener('click', function (evt) {
      evt.stopPropagation();
    });

    document.addEventListener('click', uploadingMessageClickHandler);

    uploadingMessage.addEventListener('keydown', function (evt) {
      if (evt.key === window.util.Key.ESC) {
        evt.stopPropagation();
        xhr.abort();
        uploadingMessage.remove();
        submitButton.disabled = false;
        window.util.enableInput(uploadInput, uploadLabel);
        uploadOverlay.classList.remove('hidden');
        document.removeEventListener('click', uploadingMessageClickHandler);
      }
    });

    window.setTimeout(function () {
      if (!isResultAlreadyReceived) {
        uploadOverlay.classList.add('hidden');
        pageMain.insertAdjacentElement('afterbegin', uploadingMessage);
        uploadingMessage.focus();
        window.util.disableInput(uploadInput, uploadLabel);
      }
    }, UPLOADING_MESSAGE_TIMEOUT);
  };

  var showResultMessage = function (template, error) {
    isResultAlreadyReceived = true;
    submitButton.disabled = false;
    window.util.enableInput(uploadInput, uploadLabel);
    var overlay = template.cloneNode(true);
    var inner = overlay.querySelector('div');
    var button = inner.querySelector('button');
    var message = inner.querySelector('h2');

    overlay.style.zIndex = '1000';
    if (error) {
      message.innerHTML += (ERROR_DESCRIPTION_PREFIX + error + ERROR_DESCRIPTION_POSTFIX);
    }

    var closeResultMessage = function () {
      overlay.remove();
      window.util.setModalClosedMode();
    };

    inner.addEventListener('click', function (evt) {
      evt.stopPropagation();
    });

    overlay.addEventListener('click', function () {
      closeResultMessage();
    });

    overlay.addEventListener('keydown', function (evt) {
      evt.stopPropagation();
      window.util.isEscEvent(evt, closeResultMessage);
    });

    button.addEventListener('click', function () {
      closeResultMessage();
    });

    window.uploadOverlay.close();
    window.util.setModalOpenedMode();
    uploadingMessage.remove();
    document.removeEventListener('click', uploadingMessageClickHandler);
    pageMain.insertAdjacentElement('afterbegin', overlay);
    button.focus();
  };

  var showSuccessMessage = function () {
    showResultMessage(successMessage);
  };

  var showErrorMessage = function (error) {
    showResultMessage(errorMessage, error);
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitButton.disabled = true;
    isResultAlreadyReceived = false;
    hashTagInput.value = hashTagInput.value
      .replace(window.util.Regular.EMPTY_SPACE_IN_EDGES, '')
      .replace(window.util.Regular.EMPTY_SPACE, window.util.SPACE);
    window.backend.save(showSuccessMessage, showErrorMessage, showUploadingMessage, new FormData(uploadForm));
  });
})();
