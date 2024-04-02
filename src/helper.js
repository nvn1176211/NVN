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
    document.querySelectorAll('.ck-editor__main').forEach((elm)=>{
      elm.style.borderColor = 'rgb(204, 206, 209)';
    })
  },
  /**
   * @param Object errors
   * @param Object input
   * @param Array ignoreInputs
   * @param Array ckFields
   * @return Void
   */
  handleInvalidInput: (errors, input, ignoreInputs, ckFields) => {
    let errInputObj = errors.errors;
    for (const key in errInputObj) {
      if(ignoreInputs && ignoreInputs.indexOf(key) != -1) continue;
      if(ckFields && ckFields.indexOf(key) != -1){
        document.querySelector('#ckeditor-ctn-' + ckFields[ckFields.indexOf(key)] + ' .ck-editor__main').style.borderColor = 'red';
      };
      input[key].isInvalid = true;
      input[key].errMsg = errInputObj[key][0];
    }
  },
}