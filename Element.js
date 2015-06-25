var PHP_START = '<?php ';
var PHP_END = '?>';
var PHP_END_SAFE = ' ?>';
var PHP_ECHO = 'echo ';
var SELF_CLOSING_ELEMENTS = /area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/i;
var CONTENT_ELEMENTS = /img|input/i;
var CONTENT_ELEMENTS_MAP = {
	input: 'value',
	img: 'src'
};

function Element(name) {
	var element = this;

	element.nodeName = arguments.length ? String(name).toLowerCase() : 'div';
	element.attributes = {};
	element.children = [];
}

Element.prototype.toString = function toString() {
	var element = this;
	var innerHTML = '';

	if (element.nodeName) {
		innerHTML += '<' + element.nodeName;

		Object.keys(element.attributes).forEach(function (key) {
			innerHTML += ' ' + key + '="' + element.attributes[key] + '"';
		});

		innerHTML += '>';
	}

	element.children.forEach(function (childElement) {
		innerHTML += childElement;
	});

	if (element.nodeName && !SELF_CLOSING_ELEMENTS.test(element.nodeName)) {
		innerHTML += '</' + element.nodeName + '>';
	}

	return innerHTML;
};

Element.prototype.appendNode = function appendNode(node) {
	var element = this;

	if (node.type === 'rule') {
		var childElement = Element.fromSelector(node.selector);

		childElement.parent = element;

		element.children.push(node.before);
		element.children.push(childElement);

		node.each(function (subnode) {
			childElement.appendNode(subnode);
		});

		if (!SELF_CLOSING_ELEMENTS.test(childElement.nodeName)) {
			childElement.children.push(node.after);
		}
	}
	else if (node.type === 'atrule' && node.name === 'php') {
		element.children.push(PHP_START);

		if (node.before) element.children.push(node.before);

		node.each(function (subnode) {
			element.children.push(String(subnode));
		});

		if (node.after) element.children.push(node.after);

		element.children.push(PHP_END);
	} else if (node.type === 'decl') {
		if (node.prop === 'content') {
			if (CONTENT_ELEMENTS.test(element.nodeName)) {
				element.attributes[CONTENT_ELEMENTS_MAP[element.nodeName]] = PHP_START + PHP_ECHO + 'esc_attr(' + node.value.slice(1, -1) + ');' + PHP_END_SAFE;
			} else {
				if (node.before) element.children.push(node.before);

				element.children.push(PHP_START + PHP_ECHO + 'esc_html(' + node.value.slice(1, -1) + ');' + PHP_END_SAFE);

				if (node.after) element.children.push(node.after);
			}
		} else {
			if (node.before) element.children.push(node.before);

			element.children.push(PHP_START + PHP_ECHO + node.prop + '(' + node.value.slice(1, -1) + ');' + PHP_END_SAFE);

			if (node.after) element.children.push(node.after);
		}
	}
};

Element.fromSelector = function fromSelector(selector) {
	var element = new Element('div');
	var parser = require('postcss-selector-parser');
	var parsedSelector = parser().process(selector).res.nodes[0];

	parsedSelector.each(function (node, index) {
		if (node.type === 'tag') element.nodeName = node.value;
		if (node.type === 'id') element.attributes.id = 'id' in element.attributes ? element.attributes.id + ' ' + node.value : node.value;
		if (node.type === 'class') element.attributes.class = 'class' in element.attributes ? element.attributes.class + ' ' + node.value : node.value;
		if (node.type === 'attribute') element.attributes[node.attribute] = node.value && node.value.slice(1, -1);
	});

	return element;
};

module.exports = Element;
