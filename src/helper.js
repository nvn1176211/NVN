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
 * @param Object input
 * @param Array ignoreInputs
 * @param Object ckFields
 * @return Void
 */
function handleInvalidInput(errors, input, ignoreInputs, ckFields) {
  let errInputObj = errors.errors;
  for (const key in errInputObj) {
    if (ignoreInputs && ignoreInputs.indexOf(key) != -1) continue;
    if (ckFields && ckFields[key]) {
      let ckCtnId = ckFields[key];
      document.querySelector(`#${ckCtnId} .ck-editor__main`).style.borderColor = 'red';
    };
    input[key].isInvalid = true;
    input[key].errMsg = errInputObj[key][0];
  }
}
export { getCookie, setCookieY, refreshFormErrInput, handleInvalidInput };