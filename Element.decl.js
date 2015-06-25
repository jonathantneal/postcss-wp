var PHP_START = '<?php';
var PHP_END = '?>';

module.exports = {
	content: function (element, node) {
		var Element = element.constructor;
		var value = Element.trimQuotes(node.value);

		element.children.push(value);
	},
	esc_html: function (element, node) {
		var Element = element.constructor;
		var value = Element.trimQuotes(node.value);

		element.children.push(PHP_START, ' echo esc_html(', value, '); ', PHP_END);
	}
};
