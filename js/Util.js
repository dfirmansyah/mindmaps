mindmaps.Util = mindmaps.Util || {};

/**
 * Creates a UUID in compliance with RFC4122.
 * 
 * @returns a unique id as a String
 */
mindmaps.Util.createUUID = function() {
	// http://www.ietf.org/rfc/rfc4122.txt
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

mindmaps.Util.getId = function() {
	return mindmaps.Util.createUUID();
};

mindmaps.Util.randomColor = function() {
	// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript/5365036#5365036
	// return "#"+((1<<24)*Math.random()|0).toString(16);

	// http://paulirish.com/2009/random-hex-color-code-snippets/#comment-34808
	// return '#'+~~(Math.random()*(1<<24)).toString(16);

	// http://paulirish.com/2009/random-hex-color-code-snippets/#comment-34878
	return (function(h) {
		return '#000000'.substr(0, 7 - h.length) + h;
	})((~~(Math.random() * (1 << 24))).toString(16));
};

function timeit(func, caption) {
	var start = new Date().getTime();
	func();
	var stop = new Date().getTime();
	var diff = stop - start;
	console.log(caption || "", diff, "ms");
}

mindmaps.Util.distance = function(offsetX, offsetY) {
	return Math.sqrt(offsetX * offsetX + offsetY * offsetY);
};

/**
 * Point class.
 */
mindmaps.Point = function(x, y) {
	this.x = x;
	this.y = y;
};

mindmaps.Point.fromObject = function(obj) {
	return new mindmaps.Point(obj.x, obj.y);
};

mindmaps.Point.prototype.clone = function() {
	return new mindmaps.Point(this.x, this.y);
};

mindmaps.Point.prototype.add = function(point) {
	this.x += point.x;
	this.y += point.y;
};

mindmaps.Point.prototype.toString = function() {
	return "{x: " + this.x + " y: " + this.y + "}";
};

mindmaps.Point.ZERO = new mindmaps.Point(0, 0);

/**
 * test Default documents
 */

function getBinaryMapWithDepth(depth) {
	var mm = new mindmaps.MindMap();
	var root = mm.root;

	function createTwoChildren(node, depth) {
		if (depth === 0) {
			return;
		}

		var left = mm.createNode();
		left.text.caption = "Node " + left.id;
		node.addChild(left);
		createTwoChildren(left, depth - 1);

		var right = mm.createNode();
		right.text.caption = "Node " + right.id;
		node.addChild(right);
		createTwoChildren(right, depth - 1);
	}

	// depth 10: about 400kb, 800kb in chrome
	// depth 12: about 1600kb
	// depth 16: 25mb
	var depth = depth || 10;
	createTwoChildren(root, depth);

	// generate positions for all nodes.
	// tree grows balanced from left to right
	root.offset = new mindmaps.Point(400, 400);
	// var offset = Math.pow(2, depth-1) * 10;
	var offset = 80;
	var c = root.children.values();
	setOffset(c[0], 0, -offset);
	setOffset(c[1], 0, offset);
	function setOffset(node, depth, offsetY) {
		node.offset = new mindmaps.Point((depth + 1) * 50, offsetY);

		if (node.isLeaf()) {
			return;
		}

		var c = node.children.values();
		var left = c[0];
		setOffset(left, depth + 1, offsetY - offsetY / 2);

		var right = c[1];
		setOffset(right, depth + 1, offsetY + offsetY / 2);
	}

	// color nodes
	c[0].branchColor = mindmaps.Util.randomColor();
	c[0].forEachDescendant(function(node) {
		node.branchColor = mindmaps.Util.randomColor();
	});
	c[1].branchColor = mindmaps.Util.randomColor();
	c[1].forEachDescendant(function(node) {
		node.branchColor = mindmaps.Util.randomColor();
	});

	return mm;
}

/**
 * <pre>
 * 		    r
 *    /     |        \
 *   0		1		  2
 * 		   / \     / | \  \
 *    	  10  11  20 21 22 23
 *        |
 *        100
 *        |
 *        1000
 * </pre>
 */
function getDefaultTestMap() {
	var mm = new mindmaps.MindMap();
	var root = mm.root;

	var n0 = mm.createNode();
	var n1 = mm.createNode();
	var n2 = mm.createNode();
	root.addChild(n0);
	root.addChild(n1);
	root.addChild(n2);

	var n10 = mm.createNode();
	var n11 = mm.createNode();
	n1.addChild(n10);
	n1.addChild(n11);

	var n20 = mm.createNode();
	var n21 = mm.createNode();
	var n22 = mm.createNode();
	var n23 = mm.createNode();
	n2.addChild(n20);
	n2.addChild(n21);
	n2.addChild(n22);
	n2.addChild(n23);

	var n100 = mm.createNode();
	n10.addChild(n100);

	var n1000 = mm.createNode();
	n100.addChild(n1000);

	return mm;
}

function getDefaultTestDocument() {
	var doc = new mindmaps.Document();
	doc.title = "test document";
	doc.mindmap = getDefaultTestMap();

	return doc;
}

function getSimpleMap() {
	var mm = new mindmaps.MindMap();
	var root = mm.root;

	var n0 = mm.createNode();
	var n1 = mm.createNode();
	root.addChild(n0);
	root.addChild(n1);

	return mm;
}