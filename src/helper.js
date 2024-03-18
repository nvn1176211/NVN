window.helpers = {
  getCookie: (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  },
  setCookieY: (name, value, yearDuration, path) => {
    let expire = new Date();
    expire.setFullYear(expire.getFullYear() + yearDuration);
    document.cookie = `${name}=${value};expires=${expire};path=${path}`;
  },
  refreshFormErrInput: (input) => {
    for (const key in input) {
      input[key].isInvalid = false;
    }
  },
  /**
   * @param Object errors
   * @param Object input
   * @param Array ignoreInputs
   * @return Void
   */
  handleInvalidInput: (errors, input, ignoreInputs) => {
    let errInputObj = errors.errors;
    for (const key in errInputObj) {
      if(ignoreInputs.indexOf(key) != -1) continue;
      input[key].isInvalid = true;
      input[key].errMsg = errInputObj[key][0];
    }
  },
}