@page can-map-delegate
@group can-map-delegate.usage 0 Usage
@group can-map-delegate.api 1 API
@test src/test/test.html


# can-map-delegate

[![Build Status](https://travis-ci.org/canjs/can-map-delegate.png?branch=master)](https://travis-ci.org/canjs/can-map-delegate)

Listen to Map attribute selectors

## Usage

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

## Contributing

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
