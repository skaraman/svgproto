let loaderUtils = require('loader-utils');
let htmlparser = require('htmlparser');

function assembleNode(context, node, root) {
	if (node.type === 'text') return JSON.stringify(node.data);
	let attribs = JSON.stringify(Object.assign({}, node.attribs || {}));
	let children = '[]';
	if (node.children) children = '[' + node.children.filter(childNode => childNode.name)
		.map(childNode => assembleNode(context, childNode)).join(', ') + ']';
	if (root) return `h('${node.name}', Object.assign(${attribs}, rest), ${children})`;
	return `h('${node.name}', ${attribs}, ${children})`;
}

module.exports = function (source) {
	if (this.cacheable) this.cacheable();
	let handler = new htmlparser.DefaultHandler(function (error) {
		if (error) throw error;
	});
	let parser = new htmlparser.Parser(handler);
	parser.parseComplete(source);
	let svgNode = handler.dom.find(node => node.type === 'tag' && node.name === 'svg');
	if (!svgNode) throw new Error('Could not find svg element');
	var svg = assembleNode(this, svgNode, true);
	this.callback(null, `
import { h } from 'preact';
export default function (props) {
		var styles = props.styles;
		var rest = Object.assign({}, props);
		delete rest.styles;
		return ${svg};
};`);
};
