//Source: https://github.com/Cap32/tiny-querystring/blob/67ce6ea001d0538b1d2829fb15b667df29679a9e/tiny-querystring.js
function parseQuerystring(str) {
  var decode = decodeURIComponent;
  return (str + '')
    .replace(/\+/g, ' ')
    .split('&')
    .filter(Boolean)
    .reduce(function (obj, item, index) {
      var ref = item.split('=');
      var key = decode(ref[0] || '');
      var val = decode(ref[1] || '');
      var prev = obj[key];
      obj[key] = prev === undefined ? val : [].concat(prev, val);
      return obj;
    }, {});
}
