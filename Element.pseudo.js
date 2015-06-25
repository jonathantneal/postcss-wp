var PHP_START = '<?php';
var PHP_END = '?>';

module.exports = {
	':class': function (element, node) {
		var conditional = String(node.nodes[0]).trim();
		var value = String(node.nodes[1]).trim();

		var ifStart = PHP_START + ' if (' + conditional + ') { echo ';
		var ifEnd = 'esc_attr(\'' + value + '\'); } ' + PHP_END;

		if ('class' in element.attributes) element.attributes.class += ifStart + ' \' \' . ' + ifEnd;
		else element.attributes.class = ifStart + ifEnd;
	},
	':data': function (element, node) {
		var conditional = String(node.nodes[0]).trim();
		var name = 'data-' + String(node.nodes[1]).trim();
		var value = String(node.nodes[2]).trim();

		var ifStart = PHP_START + ' if (' + conditional + ') { echo ';
		var ifEnd = 'esc_attr(\'' + value + '\'); } ' + PHP_END;

		if (name in element.attributes) element.attributes[name] += ifStart + ' \' \' . ' + ifEnd;
		else element.attributes[name] = ifStart + ifEnd;
	}
};
