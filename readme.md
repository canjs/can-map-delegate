# can-map-delegate (DEPRECATED)

**The can-map-delegate plugin is deprecated.**

[![Build Status](https://travis-ci.org/canjs/can-map-delegate.png?branch=master)](https://travis-ci.org/canjs/can-map-delegate)

The __delegate__ plugin allows you to listen to more specific event changes on 
[Maps](http://canjs.com/docs/can.Map.html).

## Overview

The __delegate__ plugin allows you to specify:

 - the __attribute__ or __attributes__ - that you want to listen to and optionally the __value__ you want it to match
 - the __type__ of event (add,set,remove,change)

Listen to specific event changes with 
<code>[can.Map::delegate delegate]\(selector, event, handler(ev,newVal,oldVal,from)\)</code> :


	// create an observable
	var map = new can.Map({
      name : {
        first : "Justin Meyer"
      }
    })
  	var handler;
    //listen to changes on a property
    map.delegate("name.first","set", 
      handler = function(ev, newVal, oldVal, prop){
      
      console.log(this)   //-> "Justin"
      console.log(ev.currentTarget) //-> map
      console.log(newVal) //-> "Justin"
      console.log(oldVal) //-> "Justin Meyer"
      console.log(prop)   //-> "name.first"
    });
 
    // change the property
    map.attr('name.first',"Justin")
     
### Types of events

Delegate lets you listen to add, set, remove, and change events on property.

#### add

An add event is fired when a new property has been added.

    var o = new can.Map({});
    o.delegate("name","add", function(ev, value){
      // will be called once
      can.$('#name').show()
    })
    o.attr('name',"Justin")
    o.attr('name',"Brian");
    
Listening to add events is useful for 'setup' functionality (in this case
showing the <code>#name</code> element.

#### set

Set events are fired when a property takes on a new value.  set events are
always fired after an add.

    o.delegate("name","set", function(ev, value){
      // will be called twice
      can.$('#name').text(value)
    })
    o.attr('name',"Justin")
    o.attr('name',"Brian");

#### remove

Remove events are fired after a property is removed.

    o.delegate("name","remove", function(ev){
      // will be called once
      $('#name').text(value)
    })
    o.attr('name',"Justin");
    o.removeAttr('name');

### Wildcards - matching multiple properties

Sometimes, you want to know when any property within some part 
of an map has changed. Delegate lets you use wildcards to 
match any property name.  The following listens for any change
on an attribute of the params attribute:

    var o = new can.Map({
      options : {
        limit : 100,
        offset: 0,
        params : {
          parentId: 5
        }
      }
    })
    o.delegate('options.*','change', function(){
      alert('1');
    })
    o.delegate('options.**','change', function(){
      alert('2');
    })
    
    // alerts 1
    // alerts 2
    o.attr('options.offset',100)
    
    // alerts 2
    o.attr('options.params.parentId',6);

Using a single wildcard (`*`) matches single level
properties.  Using a double wildcard (`**`) matches
any deep property.

### Listening on multiple properties and values

Delegate lets you listen on multiple values at once.  The following listens
for first and last name changes:

    var o = new can.Map({
      name : {first: "Justin", last: "Meyer"}
    })
    
    o.bind("name.first,name.last", 
           "set",
           function(ev,newVal,oldVal,from){
    
    })

### Listening when properties are a particular value

Delegate lets you listen when a property is __set__ to a specific value:

    var o = new can.Map({
      name : "Justin"
    })
    
    o.bind("name=Brian", 
           "set",
           function(ev,newVal,oldVal,from){
    
    })

### Stop listening to events

Delegate will listen on the object until you 
call <code>[can.Map.prototype.undelegate undelegate]\(selector, event, handler\)</code> to remove the event handler.

    o.undelegate("name.first","set", handler );
    
## Use

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-map-delegate';
```

### CommonJS use

Use `require` to load `can-map-delegate` and everything else
needed to create a template that uses `can-map-delegate`:

```js
var plugin = require("can-map-delegate");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-map-delegate` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-map-delegate',
		    	location: 'node_modules/can-map-delegate/dist/amd',
		    	main: 'lib/can-map-delegate'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-map-delegate/dist/global/can-map-delegate.js'></script>
```

## Making Changes

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
