/**
 * @param  String $name
 */
window.getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
/**
* @param  String $name
* @param  String $value
* @param  Interger $yearDuration
* @param  String $path
*/
window.setCookieY = (name, value, yearDuration, path) => {
  let expire = new Date();
  expire.setFullYear(expire.getFullYear() + yearDuration);
  document.cookie = `${name}=${value};expires=${expire};path=${path}`;
}
/**
* @param  Object $input
*/
window.refreshFormErrInput = (input) => {
  for (const key in input) {
    input[key].isInvalid = false;
  }
}
/**
* @param  Object $errors
* @param  Object $input
*/
window.handleInvalidInput = (errors, input) => {
  let errInputObj = errors.errors;
  for (const key in errInputObj) {
      input[key].isInvalid = true;
      input[key].errMsg = errInputObj[key][0];
  }
}
export default { getCookie, setCookieY, refreshFormErrInput, handleInvalidInput };