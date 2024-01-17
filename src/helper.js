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
export default { getCookie, setCookieY };