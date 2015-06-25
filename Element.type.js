module.exports = {
	attribute: function (element, node) {
		element.attributes[node.attribute] = true;

		if (node.value) element.attributes[node.attribute] = node.value.replace(/^(['"])(.+)\1$/g, '$2');
	},
	class: function (element, node) {
		if ('class' in element.attributes) element.attributes.class += ' ' + node.value;
		else element.attributes.class = node.value;
	},
	id: function (element, node) {
		if ('id' in element.attributes) element.attributes.id += ' ' + node.value;
		else element.attributes.id = node.value;
	},
	pseudo: function (element, node) {
		var Element = element.constructor;

		if (node.value in Element.pseudo) {
			Element.pseudo[node.value](element, node);
		}
	},
	tag: function (element, node) {
		element.nodeName = node.value;
	}
};
