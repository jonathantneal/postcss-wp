var Element = require('./Element.js');
var fs = require('fs');
var postcss = require('postcss');

module.exports = postcss.plugin('postcss-wp', function (opts) {
	var root = new Element('');

	return function (css) {
		css.each(function (node) {
			root.append(node);
		});

		if (opts && opts.dest) {
			fs.writeFile(opts.dest, String(root), function (error) {
				if (error) return console.log(error);
			});
		} else {
			console.log(String(root));
		}
	};
});
