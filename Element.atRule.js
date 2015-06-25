var PHP_START = '<?php';
var PHP_END = '?>';
var fs = require('fs');
var postcss = require('postcss');

function forEach(element, node) {
	// conditionally prepend space
	if (node.before) element.children.push(node.before);

	// cache processed name
	var name = node.name;

	// patch else
	if (node.name === 'else' && node.params) name += 'if';

	// append condition opener
	element.children.push(PHP_START, ' ', name, ' ', node.params, ' { ', PHP_END);

	// append node children
	node.each(function (subnode) {
		element.append(subnode);
	});

	// conditionally append space
	if (node.after) element.children.push(node.after);

	// append condition closer
	element.children.push(PHP_START, ' } ', PHP_END);
}

module.exports = {
	'for': forEach,
	'foreach': forEach,
	'if': forEach,
	'else': forEach,
	'elseif': forEach,
	'while': forEach,
	'import': function (element, node) {
		var Element = element.constructor;

		// cache file name
		var filename = Element.trimQuotes(node.params) + '.scss';

		// import scss file
		var css = fs.readFileSync(filename, 'utf8');

		// conditionally prepend space
		if (node.before) element.children.push(node.before);

		// append every node in the imported css
		postcss.parse(css, { safe: true }).each(function (childNode) {
			element.append(childNode);
		});

		// conditionally append space
		if (node.after) element.children.push(node.after);
	},
	php: function (element, node) {
		// open PHP
		element.children.push(PHP_START);

		// conditionally prepend space
		if (node.before) element.children.push(node.before);

		// append every child
		node.each(function (childNode) {
			element.children.push(String(childNode));
		});

		// conditionally append space
		if (node.after) element.children.push(node.after);

		// close PHP
		element.children.push(PHP_END);
	},
	raw: function (element, node) {
		// conditionally prepend space
		if (node.before) element.children.push(node.before);

		// append every child
		node.each(function (childNode) {
			element.children.push(String(childNode));
		});

		// conditionally append space
		if (node.after) element.children.push(node.after);
	}
};
