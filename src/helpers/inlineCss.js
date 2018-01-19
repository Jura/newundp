var fs = require('fs');
var path = require('path');

module.exports = function(options) {
  var page = (typeof options.data.root.page != 'undefined') ? options.data.root.page.split('.')[0] : 'index';
  var filename = page + '.css';
  var filepath = path.join(__dirname, '..', '..', 'dist', 'assets', 'css', filename);
  var css = fs.readFileSync(filepath, 'utf8')
  if (options.data.root.root != '') {
    return css.replace(/assets/g, options.data.root.root + 'assets');
  } else {
    return css; 
  }
}