var parser = require('postcss-selector-parser');

// Constants
var HTML_SELF_CLOSING = /area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;

// Element
function Element(selector) {
	var element = this;

	element.nodeName = null;
	element.attributes = {};
	element.children = [];

	if (selector) element.attrsBySelector(selector);
}

// <Element>.toString
Element.prototype.toString = function toString() {
	var element = this;
	var innerHTML = '';

	if (element.nodeName !== null) {
		innerHTML += '<' + element.nodeName;

		Object.keys(element.attributes).forEach(function (key) {
			innerHTML += ' ' + key;

			if (element.attributes[key] !== null) innerHTML += '="' + element.attributes[key] + '"';
		});

		innerHTML += '>';
	}

	element.children.forEach(function (childElement) {
		innerHTML += childElement;
	});

	if (element.nodeName !== null && !HTML_SELF_CLOSING.test(element.nodeName)) innerHTML += '</' + element.nodeName + '>';

	return innerHTML;
}

// <Element>.attrsBySelector
Element.prototype.attrsBySelector = function attrsBySelector(selector) {
	var element = this;

	// parse selector
	Element.parser.process(selector).res.nodes[0].each(function (node, index) {
		if (node.type in Element.type) Element.type[node.type](element, node);
	});
};

// <Element>.append
Element.prototype.append = function append(node) {
	var element = this;

	// at rule
	if (node.type === 'atrule' && node.name in Element.atRule) {
		Element.atRule[node.name](element, node);
	}

	// rule
	if (node.type === 'rule') {
		// create child element
		var childElement = new Element(node.selector);

		// set child parent
		childElement.parent = element;

		// append grandchildren
		node.each(function (subnode) {
			childElement.append(subnode);
		});

		// conditionally prepend space
		if (node.before) element.children.push(node.before);

		// append child element
		element.children.push(childElement);

		// conditionally append space
		if (node.after && !HTML_SELF_CLOSING.test(childElement.nodeName)) childElement.children.push(node.after);
	}

	// declaration
	if (node.type === 'decl') {
		// conditionally prepend space
		if (node.before && !HTML_SELF_CLOSING.test(element.nodeName)) element.children.push(node.before);

		// conditionally add declarations
		if (node.prop in Element.decl) Element.decl[node.prop](element, node);

		// conditionally append space
		if (node.after && !HTML_SELF_CLOSING.test(element.nodeName)) element.children.push(node.after);
	}
};

Element.trimQuotes = function trimQuotes(string) {
	return string.replace(/^(['"])(.*)\1$/, '$2');
};

Element.atRule = require('./Element.atRule.js');
Element.decl = require('./Element.decl.js');
Element.pseudo = require('./Element.pseudo.js');
Element.type = require('./Element.type.js');
Element.parser = parser();

// export Element
module.exports = Element;
