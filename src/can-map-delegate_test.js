require('can/list/list');
require('./can-map-delegate');
require('steal-qunit');

QUnit.module('can/map/delegate');
var matches = can.Map.prototype.delegate.matches;
QUnit.test('matches', function(assert) {
	assert.equal(matches(['**'], [
		'foo',
		'bar',
		'0'
	]), 'foo.bar.0', 'everything');
	assert.equal(matches(['*.**'], ['foo']), null, 'everything at least one level deep');
	assert.equal(matches([
		'foo',
		'*'
	], [
		'foo',
		'bar',
		'0'
	]), 'foo.bar');
	assert.equal(matches(['*'], [
		'foo',
		'bar',
		'0'
	]), 'foo');
	assert.equal(matches([
		'*',
		'bar'
	], [
		'foo',
		'bar',
		'0'
	]), 'foo.bar');
});
QUnit.test('delegate', 4, function(assert) {
	var state = new can.Map({
		properties: {
			prices: []
		}
	});
	var prices = state.attr('properties.prices');
	state.delegate('properties.prices', 'change', function (ev, attr, how, val) {
		assert.equal(attr, '0', 'correct change name');
		assert.equal(how, 'add');
		assert.equal(val[0].attr('foo'), 'bar', 'correct');
		assert.ok(this === prices, 'rooted element');
	});
	prices.push({
		foo: 'bar'
	});
	state.undelegate();
});
QUnit.test('delegate on add', 2, function(assert) {
	var state = new can.Map({});
	state.delegate('foo', 'add', function (ev, newVal) {
		assert.ok(true, 'called');
		assert.equal(newVal, 'bar', 'got newVal');
	})
		.delegate('foo', 'remove', function () {
			assert.ok(false, 'remove should not be called');
		});
	state.attr('foo', 'bar');
});
QUnit.test('delegate set is called on add', 2, function(assert) {
	var state = new can.Map({});
	state.delegate('foo', 'set', function (ev, newVal) {
		assert.ok(true, 'called');
		assert.equal(newVal, 'bar', 'got newVal');
	});
	state.attr('foo', 'bar');
});
QUnit.test('delegate\'s this', 5, function(assert) {
	var state = new can.Map({
		person: {
			name: {
				first: 'justin',
				last: 'meyer'
			}
		},
		prop: 'foo'
	});
	var n = state.attr('person.name'),
		check;
	// listen to person name changes
	state.delegate('person.name', 'set', check = function (ev, newValue, oldVal, from) {
		// make sure we are getting back the person.name
		assert.equal(this, n);
		assert.equal(newValue, 'Brian');
		assert.equal(oldVal, 'justin');
		// and how to get there
		assert.equal(from, 'first');
	});
	n.attr('first', 'Brian');
	state.undelegate('person.name', 'set', check);
	// stop listening
	// now listen to changes in prop
	state.delegate('prop', 'set', function () {
		assert.equal(this, 'food');
	});
	// this is weird, probably need to support direct bind ...
	// update the prop
	state.attr('prop', 'food');
});
QUnit.test('delegate on deep properties with *', function(assert) {
	var state = new can.Map({
		person: {
			name: {
				first: 'justin',
				last: 'meyer'
			}
		}
	});
	state.delegate('person', 'set', function (ev, newVal, oldVal, attr) {
		assert.equal(this, state.attr('person'), 'this is set right');
		assert.equal(attr, 'name.first');
	});
	state.attr('person.name.first', 'brian');
});
QUnit.test('compound sets', function(assert) {
	var state = new can.Map({
		type: 'person',
		id: '5'
	});
	var count = 0;
	state.delegate('type=person id', 'set', function () {
		assert.equal(state.type, 'person', 'type is person');
		assert.ok(state.id !== undefined, 'id has value');
		count++;
	});
	// should trigger a change
	state.attr('id', 0);
	assert.equal(count, 1, 'changing the id to 0 caused a change');
	// should not fire a set
	state.removeAttr('id');
	assert.equal(count, 1, 'removing the id changed nothing');
	state.attr('id', 3);
	assert.equal(count, 2, 'adding an id calls callback');
	state.attr('type', 'peter');
	assert.equal(count, 2, 'changing the type does not fire callback');
	state.removeAttr('type');
	state.removeAttr('id');
	assert.equal(count, 2, '');
	state.attr({
		type: 'person',
		id: '5'
	});
	assert.equal(count, 3, 'setting person and id only fires 1 event');
	state.removeAttr('type');
	state.removeAttr('id');
	state.attr({
		type: 'person'
	});
	assert.equal(count, 3, 'setting person does not fire anything');
});
QUnit.test('undelegate within event loop', 1, function(assert) {
	var state = new can.Map({
		type: 'person',
		id: '5'
	});
	var f1, f2, f3, f4;
	f1 = function () {
		state.undelegate('type', 'add', f2);
	};
	f2 = function () {
		assert.ok(false, 'I am removed, how am I called');
	};
	f3 = function () {
		state.undelegate('type', 'add', f1);
	};
	f4 = function () {
		assert.ok(true, 'f4 called');
	};

	state.delegate('type', 'set', f1);
	state.delegate('type', 'set', f2);
	state.delegate('type', 'set', f3);
	state.delegate('type', 'set', f4);
	state.attr('type', 'other');
});
QUnit.test('selector types', 5, function(assert) {
	var state = new can.Map({
		foo: 'a',
		bar: 'b',
		baz: 'c',
		box: 'd',
		baw: 'e'
	});
	state.delegate('foo=aa', 'change', function () {
		assert.ok(true, 'Unquoted value in selector matched.');
	});
	state.attr({
		foo: 'aa'
	});
	state.delegate('bar=\'b b\'', 'change', function () {
		assert.ok(true, 'Single-quoted value in selector matched.');
	});
	state.attr({
		bar: 'b b'
	});
	state.delegate('baz="c c"', 'change', function () {
		assert.ok(true, 'Double-quoted value in selector matched.');
	});
	state.attr({
		baz: 'c c'
	});
	state.delegate('box', 'change', function () {
		assert.ok(true, 'No-value attribute in selector matched.');
	});
	state.attr({
		box: 'quux'
	});
	state.delegate('baw=', 'change', function () {
		assert.ok(true, 'Empty-value shortcut in selector matched.');
	});
	state.attr({
		baw: ''
	});
});
