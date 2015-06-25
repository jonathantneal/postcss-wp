var PHP_START = '<?php';
var PHP_END = '?>';

module.exports = {
	content: function (element, node) {
		var value = node.value.replace(/^(['"])(.+)\1$/g, '$2');

		element.children.push(value);
	},
	esc_html: function (element, node) {
		var value = node.value.replace(/^(['"])(.+)\1$/g, '$2');

		element.children.push(PHP_START, ' echo esc_html(', value, '); ', PHP_END);
	}
};
