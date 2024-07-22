function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookieY(name, value, yearDuration, path) {
  let expire = new Date();
  expire.setFullYear(expire.getFullYear() + yearDuration);
  document.cookie = `${name}=${value};expires=${expire};path=${path}`;
}

/**
 * Returns dynamic time difference, minutes ago, hours ago...
 *
 * @param Date dateInput string.
 * @return Object.
 */
function timeDiff(inputDateStr) {
  let now = new Date();
  let inputDate = new Date(inputDateStr);
  let msTimeDiff = now - inputDate;
  let yearsDiff = Math.floor(msTimeDiff / 1000 / 60 / 60 / 24 / 30 / 12);
  let monthsDiff = Math.floor(msTimeDiff / 1000 / 60 / 60 / 24 / 30);
  let daysDiff = Math.floor(msTimeDiff / 1000 / 60 / 60 / 24);
  let hoursDiff = Math.floor(msTimeDiff / 1000 / 60 / 60);
  let minutesDiff = Math.floor(msTimeDiff / 1000 / 60);
  let timeDiff = {
    quantity: null,
    unit: null,
  };
  if (yearsDiff > 0) {
    timeDiff.quantity = yearsDiff;
    timeDiff.unit = 'years';
  } else if (monthsDiff > 0) {
    timeDiff.quantity = monthsDiff;
    timeDiff.unit = 'months';
  } else if (daysDiff > 0) {
    timeDiff.quantity = daysDiff;
    timeDiff.unit = 'days';
  } else if (hoursDiff > 0) {
    timeDiff.quantity = hoursDiff;
    timeDiff.unit = 'hours';
  } else {
    timeDiff.quantity = minutesDiff;
    timeDiff.unit = 'minutes';
  }
  return timeDiff;
}

async function download_img(imageUrl, imageName) {
  const response = await fetch(imageUrl);
  const blobImage = await response.blob();
  let imageType = blobImage.type.replace('image/', '');
  const href = URL.createObjectURL(blobImage);
  const anchorElement = document.createElement('a');
  anchorElement.href = href;
  anchorElement.download = imageName ? `${imageName}.${imageType}` : `image.${imageType}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  document.body.removeChild(anchorElement);
  URL.revokeObjectURL(href);
}

/**
 * @param Object inputs
 * @param Object ckFields
 * @return Void
 */
function refreshFormErrInput(inputs, ckFields) {
  for (const key in inputs) {
    inputs[key].isInvalid = false;
    if (ckFields && ckFields[key]) {
      let ckCtnId = ckFields[key];
      document.querySelector(`#${ckCtnId} .ck-editor__main`).style.borderColor = 'rgb(204, 206, 209)';
    };
  }
}

/**
 * @param Object errors
 * @param Object inputs
 * @param Array ignoreInputs
 * @param Object ckFields
 * @return Void
 */
function handleInvalidInput(errors, inputs, ignoreInputs, ckFields) {
  let errInputObj = errors.errors;
  for (const key in errInputObj) {
    if (ignoreInputs && ignoreInputs.indexOf(key) != -1) continue;
    if (ckFields && ckFields[key]) {
      let ckCtnId = ckFields[key];
      document.querySelector(`#${ckCtnId} .ck-editor__main`).style.borderColor = 'red';
    };
    inputs[key].isInvalid = true;
    inputs[key].errMsg = errInputObj[key][0];
  }
}

export { getCookie, setCookieY, timeDiff, download_img, refreshFormErrInput, handleInvalidInput };