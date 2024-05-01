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
 * @return String.
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
  if(yearsDiff > 0){
    return `${yearsDiff} years ago`;
  }else if(monthsDiff > 0){
    return `${monthsDiff} months ago`;
  }else if(daysDiff > 0){
    return `${daysDiff} days ago`;
  }else if(hoursDiff > 0){
    return `${hoursDiff} hours ago`;
  }else{
    return `${minutesDiff} minutes ago`;
  }
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
export { getCookie, setCookieY, timeDiff, refreshFormErrInput, handleInvalidInput };