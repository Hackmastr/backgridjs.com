
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("jquery/jquery.js", function(exports, require, module){
/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );

});
require.register("bootstrap/js/bootstrap.js", function(exports, require, module){
/*!
 * Bootstrap v3.0.3 (http://getbootstrap.com)
 * Copyright 2013 Twitter, Inc.
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 */

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function($) {
      factory(root, $);
    });
  } else if (typeof exports !== 'undefined') {
    factory(root, require('jquery'));
  } else {
    factory(root, root.jQuery || root.Zepto || root.ender || root.$);
  }

}(this, function(root, jQuery) {

if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.3
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.3
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')
    var changed = true

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') === 'radio') {
        // see if clicking on current one
        if ($input.prop('checked') && this.$element.hasClass('active'))
          changed = false
        else
          $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.3
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.3
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.3
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.3
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.3
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.3
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.3
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.3
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);

}));

});
require.register("codemirror/codemirror-compressed.js", function(exports, require, module){
window.CodeMirror=function(){"use strict";function x(a,c){if(!(this instanceof x))return new x(a,c);this.options=c=c||{};for(var d in _c)!c.hasOwnProperty(d)&&_c.hasOwnProperty(d)&&(c[d]=_c[d]);J(c);var e="string"==typeof c.value?0:c.value.first,f=this.display=y(a,e);f.wrapper.CodeMirror=this,G(this),c.autofocus&&!p&&Nb(this),this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,draggingText:!1,highlight:new Xe},E(this),c.lineWrapping&&(this.display.wrapper.className+=" CodeMirror-wrap");var g=c.value;"string"==typeof g&&(g=new ge(c.value,c.mode)),Fb(this,ke)(this,g),b&&setTimeout(ff(Mb,this,!0),20),Pb(this);var h;try{h=document.activeElement==f.input}catch(i){}h||c.autofocus&&!p?setTimeout(ff(mc,this),20):nc(this),Fb(this,function(){for(var a in $c)$c.propertyIsEnumerable(a)&&$c[a](this,c[a],bd);for(var b=0;b<fd.length;++b)fd[b](this)})()}function y(a,b){var d={},e=d.input=lf("textarea",null,null,"position: absolute; padding: 0; width: 1px; height: 1em; outline: none; font-size: 4px;");return f?e.style.width="1000px":e.setAttribute("wrap","off"),o&&(e.style.border="1px solid black"),e.setAttribute("autocorrect","off"),e.setAttribute("autocapitalize","off"),e.setAttribute("spellcheck","false"),d.inputDiv=lf("div",[e],null,"overflow: hidden; position: relative; width: 3px; height: 0px;"),d.scrollbarH=lf("div",[lf("div",null,null,"height: 1px")],"CodeMirror-hscrollbar"),d.scrollbarV=lf("div",[lf("div",null,null,"width: 1px")],"CodeMirror-vscrollbar"),d.scrollbarFiller=lf("div",null,"CodeMirror-scrollbar-filler"),d.gutterFiller=lf("div",null,"CodeMirror-gutter-filler"),d.lineDiv=lf("div",null,"CodeMirror-code"),d.selectionDiv=lf("div",null,null,"position: relative; z-index: 1"),d.cursor=lf("div","\xa0","CodeMirror-cursor"),d.otherCursor=lf("div","\xa0","CodeMirror-cursor CodeMirror-secondarycursor"),d.measure=lf("div",null,"CodeMirror-measure"),d.lineSpace=lf("div",[d.measure,d.selectionDiv,d.lineDiv,d.cursor,d.otherCursor],null,"position: relative; outline: none"),d.mover=lf("div",[lf("div",[d.lineSpace],"CodeMirror-lines")],null,"position: relative"),d.sizer=lf("div",[d.mover],"CodeMirror-sizer"),d.heightForcer=lf("div",null,null,"position: absolute; height: "+Ve+"px; width: 1px;"),d.gutters=lf("div",null,"CodeMirror-gutters"),d.lineGutter=null,d.scroller=lf("div",[d.sizer,d.heightForcer,d.gutters],"CodeMirror-scroll"),d.scroller.setAttribute("tabIndex","-1"),d.wrapper=lf("div",[d.inputDiv,d.scrollbarH,d.scrollbarV,d.scrollbarFiller,d.gutterFiller,d.scroller],"CodeMirror"),c&&(d.gutters.style.zIndex=-1,d.scroller.style.paddingRight=0),a.appendChild?a.appendChild(d.wrapper):a(d.wrapper),o&&(e.style.width="0px"),f||(d.scroller.draggable=!0),k?(d.inputDiv.style.height="1px",d.inputDiv.style.position="absolute"):c&&(d.scrollbarH.style.minWidth=d.scrollbarV.style.minWidth="18px"),d.viewOffset=d.lastSizeC=0,d.showingFrom=d.showingTo=b,d.lineNumWidth=d.lineNumInnerWidth=d.lineNumChars=null,d.prevInput="",d.alignWidgets=!1,d.pollingFast=!1,d.poll=new Xe,d.cachedCharWidth=d.cachedTextHeight=null,d.measureLineCache=[],d.measureLineCachePos=0,d.inaccurateSelection=!1,d.maxLine=null,d.maxLineLength=0,d.maxLineChanged=!1,d.wheelDX=d.wheelDY=d.wheelStartX=d.wheelStartY=null,d}function z(a){a.doc.mode=x.getMode(a.options,a.doc.modeOption),a.doc.iter(function(a){a.stateAfter&&(a.stateAfter=null),a.styles&&(a.styles=null)}),a.doc.frontier=a.doc.first,bb(a,100),a.state.modeGen++,a.curOp&&Ib(a)}function A(a){a.options.lineWrapping?(a.display.wrapper.className+=" CodeMirror-wrap",a.display.sizer.style.minWidth=""):(a.display.wrapper.className=a.display.wrapper.className.replace(" CodeMirror-wrap",""),I(a)),C(a),Ib(a),pb(a),setTimeout(function(){K(a)},100)}function B(a){var b=Ab(a.display),c=a.options.lineWrapping,d=c&&Math.max(5,a.display.scroller.clientWidth/Bb(a.display)-3);return function(e){return Gd(a.doc,e)?0:c?(Math.ceil(e.text.length/d)||1)*b:b}}function C(a){var b=a.doc,c=B(a);b.iter(function(a){var b=c(a);b!=a.height&&oe(a,b)})}function D(a){var b=kd[a.options.keyMap],c=b.style;a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-keymap-\S+/g,"")+(c?" cm-keymap-"+c:""),a.state.disableInput=b.disableInput}function E(a){a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+a.options.theme.replace(/(^|\s)\s*/g," cm-s-"),pb(a)}function F(a){G(a),Ib(a),setTimeout(function(){M(a)},20)}function G(a){var b=a.display.gutters,c=a.options.gutters;mf(b);for(var d=0;d<c.length;++d){var e=c[d],f=b.appendChild(lf("div",null,"CodeMirror-gutter "+e));"CodeMirror-linenumbers"==e&&(a.display.lineGutter=f,f.style.width=(a.display.lineNumWidth||1)+"px")}b.style.display=d?"":"none"}function H(a,b){if(0==b.height)return 0;for(var d,c=b.text.length,e=b;d=Dd(e);){var f=d.find();e=le(a,f.from.line),c+=f.from.ch-f.to.ch}for(e=b;d=Ed(e);){var f=d.find();c-=e.text.length-f.from.ch,e=le(a,f.to.line),c+=e.text.length-f.to.ch}return c}function I(a){var b=a.display,c=a.doc;b.maxLine=le(c,c.first),b.maxLineLength=H(c,b.maxLine),b.maxLineChanged=!0,c.iter(function(a){var d=H(c,a);d>b.maxLineLength&&(b.maxLineLength=d,b.maxLine=a)})}function J(a){var b=bf(a.gutters,"CodeMirror-linenumbers");-1==b&&a.lineNumbers?a.gutters=a.gutters.concat(["CodeMirror-linenumbers"]):b>-1&&!a.lineNumbers&&(a.gutters=a.gutters.slice(0),a.gutters.splice(b,1))}function K(a){var b=a.display,c=a.doc.height,d=c+gb(b);b.sizer.style.minHeight=b.heightForcer.style.top=d+"px",b.gutters.style.height=Math.max(d,b.scroller.clientHeight-Ve)+"px";var e=Math.max(d,b.scroller.scrollHeight),f=b.scroller.scrollWidth>b.scroller.clientWidth+1,g=e>b.scroller.clientHeight+1;g?(b.scrollbarV.style.display="block",b.scrollbarV.style.bottom=f?tf(b.measure)+"px":"0",b.scrollbarV.firstChild.style.height=e-b.scroller.clientHeight+b.scrollbarV.clientHeight+"px"):(b.scrollbarV.style.display="",b.scrollbarV.firstChild.style.height="0"),f?(b.scrollbarH.style.display="block",b.scrollbarH.style.right=g?tf(b.measure)+"px":"0",b.scrollbarH.firstChild.style.width=b.scroller.scrollWidth-b.scroller.clientWidth+b.scrollbarH.clientWidth+"px"):(b.scrollbarH.style.display="",b.scrollbarH.firstChild.style.width="0"),f&&g?(b.scrollbarFiller.style.display="block",b.scrollbarFiller.style.height=b.scrollbarFiller.style.width=tf(b.measure)+"px"):b.scrollbarFiller.style.display="",f&&a.options.coverGutterNextToScrollbar&&a.options.fixedGutter?(b.gutterFiller.style.display="block",b.gutterFiller.style.height=tf(b.measure)+"px",b.gutterFiller.style.width=b.gutters.offsetWidth+"px"):b.gutterFiller.style.display="",l&&0===tf(b.measure)&&(b.scrollbarV.style.minWidth=b.scrollbarH.style.minHeight=m?"18px":"12px",b.scrollbarV.style.pointerEvents=b.scrollbarH.style.pointerEvents="none")}function L(a,b,c){var d=a.scroller.scrollTop,e=a.wrapper.clientHeight;"number"==typeof c?d=c:c&&(d=c.top,e=c.bottom-c.top),d=Math.floor(d-fb(a));var f=Math.ceil(d+e);return{from:qe(b,d),to:qe(b,f)}}function M(a){var b=a.display;if(b.alignWidgets||b.gutters.firstChild&&a.options.fixedGutter){for(var c=P(b)-b.scroller.scrollLeft+a.doc.scrollLeft,d=b.gutters.offsetWidth,e=c+"px",f=b.lineDiv.firstChild;f;f=f.nextSibling)if(f.alignable)for(var g=0,h=f.alignable;g<h.length;++g)h[g].style.left=e;a.options.fixedGutter&&(b.gutters.style.left=c+d+"px")}}function N(a){if(!a.options.lineNumbers)return!1;var b=a.doc,c=O(a.options,b.first+b.size-1),d=a.display;if(c.length!=d.lineNumChars){var e=d.measure.appendChild(lf("div",[lf("div",c)],"CodeMirror-linenumber CodeMirror-gutter-elt")),f=e.firstChild.offsetWidth,g=e.offsetWidth-f;return d.lineGutter.style.width="",d.lineNumInnerWidth=Math.max(f,d.lineGutter.offsetWidth-g),d.lineNumWidth=d.lineNumInnerWidth+g,d.lineNumChars=d.lineNumInnerWidth?c.length:-1,d.lineGutter.style.width=d.lineNumWidth+"px",!0}return!1}function O(a,b){return String(a.lineNumberFormatter(b+a.firstLineNumber))}function P(a){return pf(a.scroller).left-pf(a.sizer).left}function Q(a,b,c,d){for(var g,e=a.display.showingFrom,f=a.display.showingTo,h=L(a.display,a.doc,c),i=!0;;i=!1){var j=a.display.scroller.clientWidth;if(!R(a,b,h,d))break;if(g=!0,b=[],Z(a),K(a),i&&a.options.lineWrapping&&j!=a.display.scroller.clientWidth)d=!0;else if(d=!1,c&&(c=Math.min(a.display.scroller.scrollHeight-a.display.scroller.clientHeight,"number"==typeof c?c:c.top)),h=L(a.display,a.doc,c),h.from>=a.display.showingFrom&&h.to<=a.display.showingTo)break}return g&&(Qe(a,"update",a),(a.display.showingFrom!=e||a.display.showingTo!=f)&&Qe(a,"viewportChange",a,a.display.showingFrom,a.display.showingTo)),g}function R(a,b,c,d){var e=a.display,f=a.doc;if(!e.wrapper.clientWidth)return e.showingFrom=e.showingTo=f.first,e.viewOffset=0,void 0;if(!(!d&&0==b.length&&c.from>e.showingFrom&&c.to<e.showingTo)){N(a)&&(b=[{from:f.first,to:f.first+f.size}]);var g=e.sizer.style.marginLeft=e.gutters.offsetWidth+"px";e.scrollbarH.style.left=a.options.fixedGutter?g:"0";var h=1/0;if(a.options.lineNumbers)for(var i=0;i<b.length;++i)b[i].diff&&b[i].from<h&&(h=b[i].from);var j=f.first+f.size,k=Math.max(c.from-a.options.viewportMargin,f.first),l=Math.min(j,c.to+a.options.viewportMargin);if(e.showingFrom<k&&k-e.showingFrom<20&&(k=Math.max(f.first,e.showingFrom)),e.showingTo>l&&e.showingTo-l<20&&(l=Math.min(j,e.showingTo)),w)for(k=pe(Fd(f,le(f,k)));j>l&&Gd(f,le(f,l));)++l;var m=[{from:Math.max(e.showingFrom,f.first),to:Math.min(e.showingTo,j)}];if(m=m[0].from>=m[0].to?[]:U(m,b),w)for(var i=0;i<m.length;++i)for(var o,n=m[i];o=Ed(le(f,n.to-1));){var p=o.find().from.line;if(!(p>n.from)){m.splice(i--,1);break}n.to=p}for(var q=0,i=0;i<m.length;++i){var n=m[i];n.from<k&&(n.from=k),n.to>l&&(n.to=l),n.from>=n.to?m.splice(i--,1):q+=n.to-n.from}if(!d&&q==l-k&&k==e.showingFrom&&l==e.showingTo)return T(a),void 0;m.sort(function(a,b){return a.from-b.from});try{var r=document.activeElement}catch(s){}.7*(l-k)>q&&(e.lineDiv.style.display="none"),W(a,k,l,m,h),e.lineDiv.style.display="",r&&document.activeElement!=r&&r.offsetHeight&&r.focus();var t=k!=e.showingFrom||l!=e.showingTo||e.lastSizeC!=e.wrapper.clientHeight;return t&&(e.lastSizeC=e.wrapper.clientHeight,bb(a,400)),e.showingFrom=k,e.showingTo=l,S(a),T(a),!0}}function S(a){for(var f,b=a.display,d=b.lineDiv.offsetTop,e=b.lineDiv.firstChild;e;e=e.nextSibling)if(e.lineObj){if(c){var g=e.offsetTop+e.offsetHeight;f=g-d,d=g}else{var h=pf(e);f=h.bottom-h.top}var i=e.lineObj.height-f;if(2>f&&(f=Ab(b)),i>.001||-.001>i){oe(e.lineObj,f);var j=e.lineObj.widgets;if(j)for(var k=0;k<j.length;++k)j[k].height=j[k].node.offsetHeight}}}function T(a){var b=a.display.viewOffset=re(a,le(a.doc,a.display.showingFrom));a.display.mover.style.top=b+"px"}function U(a,b){for(var c=0,d=b.length||0;d>c;++c){for(var e=b[c],f=[],g=e.diff||0,h=0,i=a.length;i>h;++h){var j=a[h];e.to<=j.from&&e.diff?f.push({from:j.from+g,to:j.to+g}):e.to<=j.from||e.from>=j.to?f.push(j):(e.from>j.from&&f.push({from:j.from,to:e.from}),e.to<j.to&&f.push({from:e.to+g,to:j.to+g}))}a=f}return a}function V(a){for(var b=a.display,c={},d={},e=b.gutters.firstChild,f=0;e;e=e.nextSibling,++f)c[a.options.gutters[f]]=e.offsetLeft,d[a.options.gutters[f]]=e.offsetWidth;return{fixedPos:P(b),gutterTotalWidth:b.gutters.offsetWidth,gutterLeft:c,gutterWidth:d,wrapperWidth:b.wrapper.clientWidth}}function W(a,b,c,d,e){function l(b){var c=b.nextSibling;return f&&q&&a.display.currentWheelTarget==b?(b.style.display="none",b.lineObj=null):b.parentNode.removeChild(b),c}var g=V(a),h=a.display,i=a.options.lineNumbers;d.length||f&&a.display.currentWheelTarget||mf(h.lineDiv);var j=h.lineDiv,k=j.firstChild,m=d.shift(),n=b;for(a.doc.iter(b,c,function(b){if(m&&m.to==n&&(m=d.shift()),Gd(a.doc,b)){if(0!=b.height&&oe(b,0),b.widgets&&k&&k.previousSibling)for(var c=0;c<b.widgets.length;++c){var f=b.widgets[c];if(f.showIfHidden){var h=k.previousSibling;if(/pre/i.test(h.nodeName)){var o=lf("div",null,null,"position: relative");h.parentNode.replaceChild(o,h),o.appendChild(h),h=o}var p=h.appendChild(lf("div",[f.node],"CodeMirror-linewidget"));f.handleMouseEvents||(p.ignoreEvents=!0),Y(f,p,h,g)}}}else if(m&&m.from<=n&&m.to>n){for(;k.lineObj!=b;)k=l(k);i&&n>=e&&k.lineNumber&&of(k.lineNumber,O(a.options,n)),k=k.nextSibling}else{if(b.widgets)for(var s,q=0,r=k;r&&20>q;++q,r=r.nextSibling)if(r.lineObj==b&&/div/i.test(r.nodeName)){s=r;break}var t=X(a,b,n,g,s);if(t!=s)j.insertBefore(t,k);else{for(;k!=s;)k=l(k);k=k.nextSibling}t.lineObj=b}++n});k;)k=l(k)}function X(a,b,d,e,f){var k,g=Xd(a,b),h=g.pre,i=b.gutterMarkers,j=a.display,l=g.bgClass?g.bgClass+" "+(b.bgClass||""):b.bgClass;if(!(a.options.lineNumbers||i||l||b.wrapClass||b.widgets))return h;if(f){f.alignable=null;for(var q,m=!0,n=0,o=null,p=f.firstChild;p;p=q)if(q=p.nextSibling,/\bCodeMirror-linewidget\b/.test(p.className)){for(var r=0;r<b.widgets.length;++r){var s=b.widgets[r];if(s.node==p.firstChild){s.above||o||(o=p),Y(s,p,f,e),++n;break}}if(r==b.widgets.length){m=!1;break}}else f.removeChild(p);f.insertBefore(h,o),m&&n==b.widgets.length&&(k=f,f.className=b.wrapClass||"")}if(k||(k=lf("div",null,b.wrapClass,"position: relative"),k.appendChild(h)),l&&k.insertBefore(lf("div",null,l+" CodeMirror-linebackground"),k.firstChild),a.options.lineNumbers||i){var t=k.insertBefore(lf("div",null,null,"position: absolute; left: "+(a.options.fixedGutter?e.fixedPos:-e.gutterTotalWidth)+"px"),k.firstChild);if(a.options.fixedGutter&&(k.alignable||(k.alignable=[])).push(t),!a.options.lineNumbers||i&&i["CodeMirror-linenumbers"]||(k.lineNumber=t.appendChild(lf("div",O(a.options,d),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+e.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+j.lineNumInnerWidth+"px"))),i)for(var u=0;u<a.options.gutters.length;++u){var v=a.options.gutters[u],w=i.hasOwnProperty(v)&&i[v];w&&t.appendChild(lf("div",[w],"CodeMirror-gutter-elt","left: "+e.gutterLeft[v]+"px; width: "+e.gutterWidth[v]+"px"))}}if(c&&(k.style.zIndex=2),b.widgets&&k!=f)for(var r=0,x=b.widgets;r<x.length;++r){var s=x[r],y=lf("div",[s.node],"CodeMirror-linewidget");s.handleMouseEvents||(y.ignoreEvents=!0),Y(s,y,k,e),s.above?k.insertBefore(y,a.options.lineNumbers&&0!=b.height?t:h):k.appendChild(y),Qe(s,"redraw")}return k}function Y(a,b,c,d){if(a.noHScroll){(c.alignable||(c.alignable=[])).push(b);var e=d.wrapperWidth;b.style.left=d.fixedPos+"px",a.coverGutter||(e-=d.gutterTotalWidth,b.style.paddingLeft=d.gutterTotalWidth+"px"),b.style.width=e+"px"}a.coverGutter&&(b.style.zIndex=5,b.style.position="relative",a.noHScroll||(b.style.marginLeft=-d.gutterTotalWidth+"px"))}function Z(a){var b=a.display,c=Cc(a.doc.sel.from,a.doc.sel.to);if(c||a.options.showCursorWhenSelecting?$(a):b.cursor.style.display=b.otherCursor.style.display="none",c?b.selectionDiv.style.display="none":_(a),a.options.moveInputWithCursor){var d=vb(a,a.doc.sel.head,"div"),e=pf(b.wrapper),f=pf(b.lineDiv);b.inputDiv.style.top=Math.max(0,Math.min(b.wrapper.clientHeight-10,d.top+f.top-e.top))+"px",b.inputDiv.style.left=Math.max(0,Math.min(b.wrapper.clientWidth-10,d.left+f.left-e.left))+"px"}}function $(a){var b=a.display,c=vb(a,a.doc.sel.head,"div");b.cursor.style.left=c.left+"px",b.cursor.style.top=c.top+"px",b.cursor.style.height=Math.max(0,c.bottom-c.top)*a.options.cursorHeight+"px",b.cursor.style.display="",c.other?(b.otherCursor.style.display="",b.otherCursor.style.left=c.other.left+"px",b.otherCursor.style.top=c.other.top+"px",b.otherCursor.style.height=.85*(c.other.bottom-c.other.top)+"px"):b.otherCursor.style.display="none"}function _(a){function h(a,b,c,d){0>b&&(b=0),e.appendChild(lf("div",null,"CodeMirror-selected","position: absolute; left: "+a+"px; top: "+b+"px; width: "+(null==c?f-a:c)+"px; height: "+(d-b)+"px"))}function i(b,d,e){function m(c,d){return ub(a,Bc(b,c),"div",i,d)}var k,l,i=le(c,b),j=i.text.length;return Af(se(i),d||0,null==e?j:e,function(a,b,c){var n,o,p,i=m(a,"left");if(a==b)n=i,o=p=i.left;else{if(n=m(b-1,"right"),"rtl"==c){var q=i;i=n,n=q}o=i.left,p=n.right}null==d&&0==a&&(o=g),n.top-i.top>3&&(h(o,i.top,null,i.bottom),o=g,i.bottom<n.top&&h(o,i.bottom,null,n.top)),null==e&&b==j&&(p=f),(!k||i.top<k.top||i.top==k.top&&i.left<k.left)&&(k=i),(!l||n.bottom>l.bottom||n.bottom==l.bottom&&n.right>l.right)&&(l=n),g+1>o&&(o=g),h(o,n.top,p-o,n.bottom)}),{start:k,end:l}}var b=a.display,c=a.doc,d=a.doc.sel,e=document.createDocumentFragment(),f=b.lineSpace.offsetWidth,g=hb(a.display);if(d.from.line==d.to.line)i(d.from.line,d.from.ch,d.to.ch);else{var j=le(c,d.from.line),k=le(c,d.to.line),l=Fd(c,j)==Fd(c,k),m=i(d.from.line,d.from.ch,l?j.text.length:null).end,n=i(d.to.line,l?0:null,d.to.ch).start;l&&(m.top<n.top-2?(h(m.right,m.top,null,m.bottom),h(g,n.top,n.left,n.bottom)):h(m.right,m.top,n.left-m.right,m.bottom)),m.bottom<n.top&&h(g,m.bottom,null,n.top)}nf(b.selectionDiv,e),b.selectionDiv.style.display=""}function ab(a){if(a.state.focused){var b=a.display;clearInterval(b.blinker);var c=!0;b.cursor.style.visibility=b.otherCursor.style.visibility="",a.options.cursorBlinkRate>0&&(b.blinker=setInterval(function(){b.cursor.style.visibility=b.otherCursor.style.visibility=(c=!c)?"":"hidden"},a.options.cursorBlinkRate))}}function bb(a,b){a.doc.mode.startState&&a.doc.frontier<a.display.showingTo&&a.state.highlight.set(b,ff(cb,a))}function cb(a){var b=a.doc;if(b.frontier<b.first&&(b.frontier=b.first),!(b.frontier>=a.display.showingTo)){var f,c=+new Date+a.options.workTime,d=hd(b.mode,eb(a,b.frontier)),e=[];b.iter(b.frontier,Math.min(b.first+b.size,a.display.showingTo+500),function(g){if(b.frontier>=a.display.showingFrom){var h=g.styles;g.styles=Sd(a,g,d,!0);for(var i=!h||h.length!=g.styles.length,j=0;!i&&j<h.length;++j)i=h[j]!=g.styles[j];i&&(f&&f.end==b.frontier?f.end++:e.push(f={start:b.frontier,end:b.frontier+1})),g.stateAfter=hd(b.mode,d)}else Ud(a,g.text,d),g.stateAfter=0==b.frontier%5?hd(b.mode,d):null;return++b.frontier,+new Date>c?(bb(a,a.options.workDelay),!0):void 0}),e.length&&Fb(a,function(){for(var a=0;a<e.length;++a)Ib(this,e[a].start,e[a].end)})()}}function db(a,b,c){for(var d,e,f=a.doc,g=c?-1:b-(a.doc.mode.innerMode?1e3:100),h=b;h>g;--h){if(h<=f.first)return f.first;var i=le(f,h-1);if(i.stateAfter&&(!c||h<=f.frontier))return h;var j=Ye(i.text,null,a.options.tabSize);(null==e||d>j)&&(e=h-1,d=j)}return e}function eb(a,b,c){var d=a.doc,e=a.display;if(!d.mode.startState)return!0;var f=db(a,b,c),g=f>d.first&&le(d,f-1).stateAfter;return g=g?hd(d.mode,g):id(d.mode),d.iter(f,b,function(c){Ud(a,c.text,g);var h=f==b-1||0==f%5||f>=e.showingFrom&&f<e.showingTo;c.stateAfter=h?hd(d.mode,g):null,++f}),c&&(d.frontier=f),g}function fb(a){return a.lineSpace.offsetTop}function gb(a){return a.mover.offsetHeight-a.lineSpace.offsetHeight}function hb(a){var b=nf(a.measure,lf("pre",null,null,"text-align: left")).appendChild(lf("span","x"));return b.offsetLeft}function ib(a,b,c,d,e){var f=-1;if(d=d||lb(a,b),d.crude){var g=d.left+c*d.width;return{left:g,right:g+d.width,top:d.top,bottom:d.bottom}}for(var h=c;;h+=f){var i=d[h];if(i)break;0>f&&0==h&&(f=1)}return e=h>c?"left":c>h?"right":e,"left"==e&&i.leftSide?i=i.leftSide:"right"==e&&i.rightSide&&(i=i.rightSide),{left:c>h?i.right:i.left,right:h>c?i.left:i.right,top:i.top,bottom:i.bottom}}function jb(a,b){for(var c=a.display.measureLineCache,d=0;d<c.length;++d){var e=c[d];if(e.text==b.text&&e.markedSpans==b.markedSpans&&a.display.scroller.clientWidth==e.width&&e.classes==b.textClass+"|"+b.wrapClass)return e}}function kb(a,b){var c=jb(a,b);c&&(c.text=c.measure=c.markedSpans=null)}function lb(a,b){var c=jb(a,b);if(c)return c.measure;var d=mb(a,b),e=a.display.measureLineCache,f={text:b.text,width:a.display.scroller.clientWidth,markedSpans:b.markedSpans,measure:d,classes:b.textClass+"|"+b.wrapClass};return 16==e.length?e[++a.display.measureLineCachePos%16]=f:e.push(f),d}function mb(a,e){function t(a){var b=a.top-p.top,c=a.bottom-p.top;c>s&&(c=s),0>b&&(b=0);for(var d=q.length-2;d>=0;d-=2){var e=q[d],f=q[d+1];if(!(e>c||b>f)&&(b>=e&&f>=c||e>=b&&c>=f||Math.min(c,f)-Math.max(b,e)>=c-b>>1)){q[d]=Math.min(b,e),q[d+1]=Math.max(c,f);break}}return 0>d&&(d=q.length,q.push(b,c)),{left:a.left-p.left,right:a.right-p.left,top:d,bottom:null}}function u(a){a.bottom=q[a.top+1],a.top=q[a.top]}if(!a.options.lineWrapping&&e.text.length>=a.options.crudeMeasuringFrom)return nb(a,e);var f=a.display,g=ef(e.text.length),h=Xd(a,e,g,!0).pre;if(b&&!c&&!a.options.lineWrapping&&h.childNodes.length>100){for(var i=document.createDocumentFragment(),j=10,k=h.childNodes.length,l=0,m=Math.ceil(k/j);m>l;++l){for(var n=lf("div",null,null,"display: inline-block"),o=0;j>o&&k;++o)n.appendChild(h.firstChild),--k;i.appendChild(n)}h.appendChild(i)}nf(f.measure,h);var p=pf(f.lineDiv),q=[],r=ef(e.text.length),s=h.offsetHeight;d&&f.measure.first!=h&&nf(f.measure,h);for(var v,l=0;l<g.length;++l)if(v=g[l]){var w=v,x=null;if(/\bCodeMirror-widget\b/.test(v.className)&&v.getClientRects){1==v.firstChild.nodeType&&(w=v.firstChild);var y=w.getClientRects();y.length>1&&(x=r[l]=t(y[0]),x.rightSide=t(y[y.length-1]))}x||(x=r[l]=t(pf(w))),v.measureRight&&(x.right=pf(v.measureRight).left),v.leftSide&&(x.leftSide=t(pf(v.leftSide)))}mf(a.display.measure);for(var v,l=0;l<r.length;++l)(v=r[l])&&(u(v),v.leftSide&&u(v.leftSide),v.rightSide&&u(v.rightSide));return r}function nb(a,b){var c=new Od(b.text.slice(0,100),null);b.textClass&&(c.textClass=b.textClass);var d=mb(a,c),e=ib(a,c,0,d,"left"),f=ib(a,c,99,d,"right");return{crude:!0,top:e.top,left:e.left,bottom:e.bottom,width:(f.right-e.left)/100}}function ob(a,b){var c=!1;if(b.markedSpans)for(var d=0;d<b.markedSpans;++d){var e=b.markedSpans[d];!e.collapsed||null!=e.to&&e.to!=b.text.length||(c=!0)}var f=!c&&jb(a,b);if(f||b.text.length>=a.options.crudeMeasuringFrom)return ib(a,b,b.text.length,f&&f.measure,"right").right;var g=Xd(a,b,null,!0).pre,h=g.appendChild(vf(a.display.measure));return nf(a.display.measure,g),pf(h).right-pf(a.display.lineDiv).left}function pb(a){a.display.measureLineCache.length=a.display.measureLineCachePos=0,a.display.cachedCharWidth=a.display.cachedTextHeight=null,a.options.lineWrapping||(a.display.maxLineChanged=!0),a.display.lineNumChars=null}function qb(){return window.pageXOffset||(document.documentElement||document.body).scrollLeft}function rb(){return window.pageYOffset||(document.documentElement||document.body).scrollTop}function sb(a,b,c,d){if(b.widgets)for(var e=0;e<b.widgets.length;++e)if(b.widgets[e].above){var f=Md(b.widgets[e]);c.top+=f,c.bottom+=f}if("line"==d)return c;d||(d="local");var g=re(a,b);if("local"==d?g+=fb(a.display):g-=a.display.viewOffset,"page"==d||"window"==d){var h=pf(a.display.lineSpace);g+=h.top+("window"==d?0:rb());var i=h.left+("window"==d?0:qb());c.left+=i,c.right+=i}return c.top+=g,c.bottom+=g,c}function tb(a,b,c){if("div"==c)return b;var d=b.left,e=b.top;if("page"==c)d-=qb(),e-=rb();else if("local"==c||!c){var f=pf(a.display.sizer);d+=f.left,e+=f.top}var g=pf(a.display.lineSpace);return{left:d-g.left,top:e-g.top}}function ub(a,b,c,d,e){return d||(d=le(a.doc,b.line)),sb(a,d,ib(a,d,b.ch,null,e),c)}function vb(a,b,c,d,e){function f(b,f){var g=ib(a,d,b,e,f?"right":"left");return f?g.left=g.right:g.right=g.left,sb(a,d,g,c)}function g(a,b){var c=h[b],d=c.level%2;return a==Bf(c)&&b&&c.level<h[b-1].level?(c=h[--b],a=Cf(c)-(c.level%2?0:1),d=!0):a==Cf(c)&&b<h.length-1&&c.level<h[b+1].level&&(c=h[++b],a=Bf(c)-c.level%2,d=!1),d&&a==c.to&&a>c.from?f(a-1):f(a,d)}d=d||le(a.doc,b.line),e||(e=lb(a,d));var h=se(d),i=b.ch;if(!h)return f(i);var j=Jf(h,i),k=g(i,j);return null!=If&&(k.other=g(i,If)),k}function wb(a,b,c,d){var e=new Bc(a,b);return e.xRel=d,c&&(e.outside=!0),e}function xb(a,b,c){var d=a.doc;if(c+=a.display.viewOffset,0>c)return wb(d.first,0,!0,-1);var e=qe(d,c),f=d.first+d.size-1;if(e>f)return wb(d.first+d.size-1,le(d,f).text.length,!0,1);for(0>b&&(b=0);;){var g=le(d,e),h=yb(a,g,e,b,c),i=Ed(g),j=i&&i.find();if(!i||!(h.ch>j.from.ch||h.ch==j.from.ch&&h.xRel>0))return h;e=j.to.line}}function yb(a,b,c,d,e){function j(d){var e=vb(a,Bc(c,d),"line",b,i);return g=!0,f>e.bottom?e.left-h:f<e.top?e.left+h:(g=!1,e.left)}var f=e-re(a,b),g=!1,h=2*a.display.wrapper.clientWidth,i=lb(a,b),k=se(b),l=b.text.length,m=Df(b),n=Ef(b),o=j(m),p=g,q=j(n),r=g;if(d>q)return wb(c,n,r,1);for(;;){if(k?n==m||n==Lf(b,m,1):1>=n-m){for(var s=o>d||q-d>=d-o?m:n,t=d-(s==m?o:q);kf.test(b.text.charAt(s));)++s;var u=wb(c,s,s==m?p:r,0>t?-1:t?1:0);return u}var v=Math.ceil(l/2),w=m+v;if(k){w=m;for(var x=0;v>x;++x)w=Lf(b,w,1)}var y=j(w);y>d?(n=w,q=y,(r=g)&&(q+=1e3),l=v):(m=w,o=y,p=g,l-=v)}}function Ab(a){if(null!=a.cachedTextHeight)return a.cachedTextHeight;if(null==zb){zb=lf("pre");for(var b=0;49>b;++b)zb.appendChild(document.createTextNode("x")),zb.appendChild(lf("br"));zb.appendChild(document.createTextNode("x"))}nf(a.measure,zb);var c=zb.offsetHeight/50;return c>3&&(a.cachedTextHeight=c),mf(a.measure),c||1}function Bb(a){if(null!=a.cachedCharWidth)return a.cachedCharWidth;var b=lf("span","x"),c=lf("pre",[b]);nf(a.measure,c);var d=b.offsetWidth;return d>2&&(a.cachedCharWidth=d),d||10}function Db(a){a.curOp={changes:[],forceUpdate:!1,updateInput:null,userSelChange:null,textChanged:null,selectionChanged:!1,cursorActivity:!1,updateMaxLine:!1,updateScrollPos:!1,id:++Cb},Pe++||(Oe=[])}function Eb(a){var b=a.curOp,c=a.doc,d=a.display;if(a.curOp=null,b.updateMaxLine&&I(a),d.maxLineChanged&&!a.options.lineWrapping&&d.maxLine){var e=ob(a,d.maxLine);d.sizer.style.minWidth=Math.max(0,e+3+Ve)+"px",d.maxLineChanged=!1;var f=Math.max(0,d.sizer.offsetLeft+d.sizer.offsetWidth-d.scroller.clientWidth);f<c.scrollLeft&&!b.updateScrollPos&&ac(a,Math.min(d.scroller.scrollLeft,f),!0)}var g,h;if(b.updateScrollPos)g=b.updateScrollPos;else if(b.selectionChanged&&d.scroller.clientHeight){var i=vb(a,c.sel.head);g=Rc(a,i.left,i.top,i.left,i.bottom)}if((b.changes.length||b.forceUpdate||g&&null!=g.scrollTop)&&(h=Q(a,b.changes,g&&g.scrollTop,b.forceUpdate),a.display.scroller.offsetHeight&&(a.doc.scrollTop=a.display.scroller.scrollTop)),!h&&b.selectionChanged&&Z(a),b.updateScrollPos){var j=Math.max(0,Math.min(d.scroller.scrollHeight-d.scroller.clientHeight,g.scrollTop)),k=Math.max(0,Math.min(d.scroller.scrollWidth-d.scroller.clientWidth,g.scrollLeft));d.scroller.scrollTop=d.scrollbarV.scrollTop=c.scrollTop=j,d.scroller.scrollLeft=d.scrollbarH.scrollLeft=c.scrollLeft=k,M(a),b.scrollToPos&&Pc(a,Gc(a.doc,b.scrollToPos.from),Gc(a.doc,b.scrollToPos.to),b.scrollToPos.margin)}else g&&Oc(a);b.selectionChanged&&ab(a),a.state.focused&&b.updateInput&&Mb(a,b.userSelChange);var l=b.maybeHiddenMarkers,m=b.maybeUnhiddenMarkers;if(l)for(var n=0;n<l.length;++n)l[n].lines.length||Ne(l[n],"hide");if(m)for(var n=0;n<m.length;++n)m[n].lines.length&&Ne(m[n],"unhide");var o;if(--Pe||(o=Oe,Oe=null),b.textChanged&&Ne(a,"change",a,b.textChanged),b.cursorActivity&&Ne(a,"cursorActivity",a),o)for(var n=0;n<o.length;++n)o[n]()}function Fb(a,b){return function(){var c=a||this,d=!c.curOp;d&&Db(c);try{var e=b.apply(c,arguments)}finally{d&&Eb(c)}return e}}function Gb(a){return function(){var c,b=this.cm&&!this.cm.curOp;b&&Db(this.cm);try{c=a.apply(this,arguments)}finally{b&&Eb(this.cm)}return c}}function Hb(a,b){var d,c=!a.curOp;c&&Db(a);try{d=b()}finally{c&&Eb(a)}return d}function Ib(a,b,c,d){null==b&&(b=a.doc.first),null==c&&(c=a.doc.first+a.doc.size),a.curOp.changes.push({from:b,to:c,diff:d})}function Jb(a){a.display.pollingFast||a.display.poll.set(a.options.pollInterval,function(){Lb(a),a.state.focused&&Jb(a)})}function Kb(a){function c(){var d=Lb(a);d||b?(a.display.pollingFast=!1,Jb(a)):(b=!0,a.display.poll.set(60,c))}var b=!1;a.display.pollingFast=!0,a.display.poll.set(20,c)}function Lb(a){var c=a.display.input,e=a.display.prevInput,f=a.doc,g=f.sel;if(!a.state.focused||xf(c)||Ob(a)||a.state.disableInput)return!1;a.state.pasteIncoming&&a.state.fakedLastChar&&(c.value=c.value.substring(0,c.value.length-1),a.state.fakedLastChar=!1);var h=c.value;if(h==e&&Cc(g.from,g.to))return!1;if(b&&!d&&a.display.inputHasSelection===h)return Mb(a,!0),!1;var i=!a.curOp;i&&Db(a),g.shift=!1;for(var j=0,k=Math.min(e.length,h.length);k>j&&e.charCodeAt(j)==h.charCodeAt(j);)++j;var l=g.from,m=g.to;j<e.length?l=Bc(l.line,l.ch-(e.length-j)):a.state.overwrite&&Cc(l,m)&&!a.state.pasteIncoming&&(m=Bc(m.line,Math.min(le(f,m.line).text.length,m.ch+(h.length-j))));var n=a.curOp.updateInput,o={from:l,to:m,text:wf(h.slice(j)),origin:a.state.pasteIncoming?"paste":"+input"};return uc(a.doc,o,"end"),a.curOp.updateInput=n,Qe(a,"inputRead",a,o),h.length>1e3||h.indexOf("\n")>-1?c.value=a.display.prevInput="":a.display.prevInput=h,i&&Eb(a),a.state.pasteIncoming=!1,!0}function Mb(a,c){var e,f,g=a.doc;if(Cc(g.sel.from,g.sel.to))c&&(a.display.prevInput=a.display.input.value="",b&&!d&&(a.display.inputHasSelection=null));else{a.display.prevInput="",e=yf&&(g.sel.to.line-g.sel.from.line>100||(f=a.getSelection()).length>1e3);var h=e?"-":f||a.getSelection();a.display.input.value=h,a.state.focused&&af(a.display.input),b&&!d&&(a.display.inputHasSelection=h)}a.display.inaccurateSelection=e}function Nb(a){"nocursor"==a.options.readOnly||p&&document.activeElement==a.display.input||a.display.input.focus()}function Ob(a){return a.options.readOnly||a.doc.cantEdit}function Pb(a){function e(){a.state.focused&&setTimeout(ff(Nb,a),0)}function h(){null==g&&(g=setTimeout(function(){g=null,c.cachedCharWidth=c.cachedTextHeight=sf=null,pb(a),Hb(a,ff(Ib,a))},100))}function i(){for(var a=c.wrapper.parentNode;a&&a!=document.body;a=a.parentNode);a?setTimeout(i,5e3):Me(window,"resize",h)}function j(b){Re(a,b)||a.options.onDragEvent&&a.options.onDragEvent(a,Ee(b))||Ie(b)}function l(){c.inaccurateSelection&&(c.prevInput="",c.inaccurateSelection=!1,c.input.value=a.getSelection(),af(c.input))}var c=a.display;Le(c.scroller,"mousedown",Fb(a,Ub)),b?Le(c.scroller,"dblclick",Fb(a,function(b){if(!Re(a,b)){var c=Rb(a,b);if(c&&!Xb(a,b)&&!Qb(a.display,b)){Fe(b);var d=Yc(le(a.doc,c.line).text,c);Jc(a.doc,d.from,d.to)}}})):Le(c.scroller,"dblclick",function(b){Re(a,b)||Fe(b)}),Le(c.lineSpace,"selectstart",function(a){Qb(c,a)||Fe(a)}),u||Le(c.scroller,"contextmenu",function(b){pc(a,b)}),Le(c.scroller,"scroll",function(){c.scroller.clientHeight&&(_b(a,c.scroller.scrollTop),ac(a,c.scroller.scrollLeft,!0),Ne(a,"scroll",a))}),Le(c.scrollbarV,"scroll",function(){c.scroller.clientHeight&&_b(a,c.scrollbarV.scrollTop)}),Le(c.scrollbarH,"scroll",function(){c.scroller.clientHeight&&ac(a,c.scrollbarH.scrollLeft)}),Le(c.scroller,"mousewheel",function(b){dc(a,b)}),Le(c.scroller,"DOMMouseScroll",function(b){dc(a,b)}),Le(c.scrollbarH,"mousedown",e),Le(c.scrollbarV,"mousedown",e),Le(c.wrapper,"scroll",function(){c.wrapper.scrollTop=c.wrapper.scrollLeft=0});var g;Le(window,"resize",h),setTimeout(i,5e3),Le(c.input,"keyup",Fb(a,function(b){Re(a,b)||a.options.onKeyEvent&&a.options.onKeyEvent(a,Ee(b))||16==b.keyCode&&(a.doc.sel.shift=!1)})),Le(c.input,"input",function(){b&&!d&&a.display.inputHasSelection&&(a.display.inputHasSelection=null),Kb(a)}),Le(c.input,"keydown",Fb(a,kc)),Le(c.input,"keypress",Fb(a,lc)),Le(c.input,"focus",ff(mc,a)),Le(c.input,"blur",ff(nc,a)),a.options.dragDrop&&(Le(c.scroller,"dragstart",function(b){$b(a,b)}),Le(c.scroller,"dragenter",j),Le(c.scroller,"dragover",j),Le(c.scroller,"drop",Fb(a,Zb))),Le(c.scroller,"paste",function(b){Qb(c,b)||(Nb(a),Kb(a))}),Le(c.input,"paste",function(){if(f&&!a.state.fakedLastChar&&!(new Date-a.state.lastMiddleDown<200)){var b=c.input.selectionStart,d=c.input.selectionEnd;c.input.value+="$",c.input.selectionStart=b,c.input.selectionEnd=d,a.state.fakedLastChar=!0}a.state.pasteIncoming=!0,Kb(a)}),Le(c.input,"cut",l),Le(c.input,"copy",l),k&&Le(c.sizer,"mouseup",function(){document.activeElement==c.input&&c.input.blur(),Nb(a)})}function Qb(a,b){for(var c=Je(b);c!=a.wrapper;c=c.parentNode)if(!c||c.ignoreEvents||c.parentNode==a.sizer&&c!=a.mover)return!0}function Rb(a,b,c){var d=a.display;if(!c){var e=Je(b);if(e==d.scrollbarH||e==d.scrollbarH.firstChild||e==d.scrollbarV||e==d.scrollbarV.firstChild||e==d.scrollbarFiller||e==d.gutterFiller)return null}var f,g,h=pf(d.lineSpace);try{f=b.clientX,g=b.clientY}catch(b){return null}return xb(a,f-h.left,g-h.top)
}function Ub(a){function q(a){if(!Cc(p,a)){if(p=a,"single"==j)return Jc(c.doc,Gc(e,h),a),void 0;if(n=Gc(e,n),o=Gc(e,o),"double"==j){var b=Yc(le(e,a.line).text,a);Dc(a,n)?Jc(c.doc,b.from,o):Jc(c.doc,n,b.to)}else"triple"==j&&(Dc(a,n)?Jc(c.doc,o,Gc(e,Bc(a.line,0))):Jc(c.doc,n,Gc(e,Bc(a.line+1,0))))}}function t(a){var b=++s,f=Rb(c,a,!0);if(f)if(Cc(f,l)){var h=a.clientY<r.top?-20:a.clientY>r.bottom?20:0;h&&setTimeout(Fb(c,function(){s==b&&(d.scroller.scrollTop+=h,t(a))}),50)}else{c.state.focused||mc(c),l=f,q(f);var g=L(d,e);(f.line>=g.to||f.line<g.from)&&setTimeout(Fb(c,function(){s==b&&t(a)}),150)}}function v(a){s=1/0,Fe(a),Nb(c),Me(document,"mousemove",w),Me(document,"mouseup",x)}if(!Re(this,a)){var c=this,d=c.display,e=c.doc,g=e.sel;if(g.shift=a.shiftKey,Qb(d,a))return f||(d.scroller.draggable=!1,setTimeout(function(){d.scroller.draggable=!0},100)),void 0;if(!Xb(c,a)){var h=Rb(c,a);switch(Ke(a)){case 3:return u&&pc.call(c,c,a),void 0;case 2:return f&&(c.state.lastMiddleDown=+new Date),h&&Jc(c.doc,h),setTimeout(ff(Nb,c),20),Fe(a),void 0}if(!h)return Je(a)==d.scroller&&Fe(a),void 0;c.state.focused||mc(c);var i=+new Date,j="single";if(Tb&&Tb.time>i-400&&Cc(Tb.pos,h))j="triple",Fe(a),setTimeout(ff(Nb,c),20),Zc(c,h.line);else if(Sb&&Sb.time>i-400&&Cc(Sb.pos,h)){j="double",Tb={time:i,pos:h},Fe(a);var k=Yc(le(e,h.line).text,h);Jc(c.doc,k.from,k.to)}else Sb={time:i,pos:h};var l=h;if(c.options.dragDrop&&qf&&!Ob(c)&&!Cc(g.from,g.to)&&!Dc(h,g.from)&&!Dc(g.to,h)&&"single"==j){var m=Fb(c,function(b){f&&(d.scroller.draggable=!1),c.state.draggingText=!1,Me(document,"mouseup",m),Me(d.scroller,"drop",m),Math.abs(a.clientX-b.clientX)+Math.abs(a.clientY-b.clientY)<10&&(Fe(b),Jc(c.doc,h),Nb(c))});return f&&(d.scroller.draggable=!0),c.state.draggingText=m,d.scroller.dragDrop&&d.scroller.dragDrop(),Le(document,"mouseup",m),Le(d.scroller,"drop",m),void 0}Fe(a),"single"==j&&Jc(c.doc,Gc(e,h));var n=g.from,o=g.to,p=h,r=pf(d.wrapper),s=0,w=Fb(c,function(a){b||Ke(a)?t(a):v(a)}),x=Fb(c,v);Le(document,"mousemove",w),Le(document,"mouseup",x)}}}function Vb(a,b,c,d,e){try{var f=b.clientX,g=b.clientY}catch(b){return!1}if(f>=Math.floor(pf(a.display.gutters).right))return!1;d&&Fe(b);var h=a.display,i=pf(h.lineDiv);if(g>i.bottom||!Te(a,c))return He(b);g-=i.top-h.viewOffset;for(var j=0;j<a.options.gutters.length;++j){var k=h.gutters.childNodes[j];if(k&&pf(k).right>=f){var l=qe(a.doc,g),m=a.options.gutters[j];return e(a,c,a,l,m,b),He(b)}}}function Wb(a,b){return Te(a,"gutterContextMenu")?Vb(a,b,"gutterContextMenu",!1,Ne):!1}function Xb(a,b){return Vb(a,b,"gutterClick",!0,Qe)}function Zb(a){var c=this;if(!(Re(c,a)||Qb(c.display,a)||c.options.onDragEvent&&c.options.onDragEvent(c,Ee(a)))){Fe(a),b&&(Yb=+new Date);var d=Rb(c,a,!0),e=a.dataTransfer.files;if(d&&!Ob(c))if(e&&e.length&&window.FileReader&&window.File)for(var f=e.length,g=Array(f),h=0,i=function(a,b){var e=new FileReader;e.onload=function(){g[b]=e.result,++h==f&&(d=Gc(c.doc,d),uc(c.doc,{from:d,to:d,text:wf(g.join("\n")),origin:"paste"},"around"))},e.readAsText(a)},j=0;f>j;++j)i(e[j],j);else{if(c.state.draggingText&&!Dc(d,c.doc.sel.from)&&!Dc(c.doc.sel.to,d))return c.state.draggingText(a),setTimeout(ff(Nb,c),20),void 0;try{var g=a.dataTransfer.getData("Text");if(g){var k=c.doc.sel.from,l=c.doc.sel.to;Lc(c.doc,d,d),c.state.draggingText&&Ac(c.doc,"",k,l,"paste"),c.replaceSelection(g,null,"paste"),Nb(c)}}catch(a){}}}}function $b(a,c){if(b&&(!a.state.draggingText||+new Date-Yb<100))return Ie(c),void 0;if(!Re(a,c)&&!Qb(a.display,c)){var d=a.getSelection();if(c.dataTransfer.setData("Text",d),c.dataTransfer.setDragImage&&!j){var e=lf("img",null,null,"position: fixed; left: 0; top: 0;");e.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",i&&(e.width=e.height=1,a.display.wrapper.appendChild(e),e._top=e.offsetTop),c.dataTransfer.setDragImage(e,0,0),i&&e.parentNode.removeChild(e)}}}function _b(b,c){Math.abs(b.doc.scrollTop-c)<2||(b.doc.scrollTop=c,a||Q(b,[],c),b.display.scroller.scrollTop!=c&&(b.display.scroller.scrollTop=c),b.display.scrollbarV.scrollTop!=c&&(b.display.scrollbarV.scrollTop=c),a&&Q(b,[]),bb(b,100))}function ac(a,b,c){(c?b==a.doc.scrollLeft:Math.abs(a.doc.scrollLeft-b)<2)||(b=Math.min(b,a.display.scroller.scrollWidth-a.display.scroller.clientWidth),a.doc.scrollLeft=b,M(a),a.display.scroller.scrollLeft!=b&&(a.display.scroller.scrollLeft=b),a.display.scrollbarH.scrollLeft!=b&&(a.display.scrollbarH.scrollLeft=b))}function dc(b,c){var d=c.wheelDeltaX,e=c.wheelDeltaY;null==d&&c.detail&&c.axis==c.HORIZONTAL_AXIS&&(d=c.detail),null==e&&c.detail&&c.axis==c.VERTICAL_AXIS?e=c.detail:null==e&&(e=c.wheelDelta);var g=b.display,h=g.scroller;if(d&&h.scrollWidth>h.clientWidth||e&&h.scrollHeight>h.clientHeight){if(e&&q&&f)for(var j=c.target;j!=h;j=j.parentNode)if(j.lineObj){b.display.currentWheelTarget=j;break}if(d&&!a&&!i&&null!=cc)return e&&_b(b,Math.max(0,Math.min(h.scrollTop+e*cc,h.scrollHeight-h.clientHeight))),ac(b,Math.max(0,Math.min(h.scrollLeft+d*cc,h.scrollWidth-h.clientWidth))),Fe(c),g.wheelStartX=null,void 0;if(e&&null!=cc){var k=e*cc,l=b.doc.scrollTop,m=l+g.wrapper.clientHeight;0>k?l=Math.max(0,l+k-50):m=Math.min(b.doc.height,m+k+50),Q(b,[],{top:l,bottom:m})}20>bc&&(null==g.wheelStartX?(g.wheelStartX=h.scrollLeft,g.wheelStartY=h.scrollTop,g.wheelDX=d,g.wheelDY=e,setTimeout(function(){if(null!=g.wheelStartX){var a=h.scrollLeft-g.wheelStartX,b=h.scrollTop-g.wheelStartY,c=b&&g.wheelDY&&b/g.wheelDY||a&&g.wheelDX&&a/g.wheelDX;g.wheelStartX=g.wheelStartY=null,c&&(cc=(cc*bc+c)/(bc+1),++bc)}},200)):(g.wheelDX+=d,g.wheelDY+=e))}}function ec(a,b,c){if("string"==typeof b&&(b=jd[b],!b))return!1;a.display.pollingFast&&Lb(a)&&(a.display.pollingFast=!1);var d=a.doc,e=d.sel.shift,f=!1;try{Ob(a)&&(a.state.suppressEdits=!0),c&&(d.sel.shift=!1),f=b(a)!=We}finally{d.sel.shift=e,a.state.suppressEdits=!1}return f}function fc(a){var b=a.state.keyMaps.slice(0);return a.options.extraKeys&&b.push(a.options.extraKeys),b.push(a.options.keyMap),b}function hc(a,b){var c=ld(a.options.keyMap),e=c.auto;clearTimeout(gc),e&&!nd(b)&&(gc=setTimeout(function(){ld(a.options.keyMap)==c&&(a.options.keyMap=e.call?e.call(null,a):e,D(a))},50));var f=od(b,!0),g=!1;if(!f)return!1;var h=fc(a);return g=b.shiftKey?md("Shift-"+f,h,function(b){return ec(a,b,!0)})||md(f,h,function(b){return("string"==typeof b?/^go[A-Z]/.test(b):b.motion)?ec(a,b):void 0}):md(f,h,function(b){return ec(a,b)}),g&&(Fe(b),ab(a),d&&(b.oldKeyCode=b.keyCode,b.keyCode=0),Qe(a,"keyHandled",a,f,b)),g}function ic(a,b,c){var d=md("'"+c+"'",fc(a),function(b){return ec(a,b,!0)});return d&&(Fe(b),ab(a),Qe(a,"keyHandled",a,"'"+c+"'",b)),d}function kc(a){var c=this;if(c.state.focused||mc(c),!(Re(c,a)||c.options.onKeyEvent&&c.options.onKeyEvent(c,Ee(a)))){b&&27==a.keyCode&&(a.returnValue=!1);var d=a.keyCode;c.doc.sel.shift=16==d||a.shiftKey;var e=hc(c,a);i&&(jc=e?d:null,!e&&88==d&&!yf&&(q?a.metaKey:a.ctrlKey)&&c.replaceSelection(""))}}function lc(a){var c=this;if(!(Re(c,a)||c.options.onKeyEvent&&c.options.onKeyEvent(c,Ee(a)))){var e=a.keyCode,f=a.charCode;if(i&&e==jc)return jc=null,Fe(a),void 0;if(!(i&&(!a.which||a.which<10)||k)||!hc(c,a)){var g=String.fromCharCode(null==f?e:f);this.options.electricChars&&this.doc.mode.electricChars&&this.options.smartIndent&&!Ob(this)&&this.doc.mode.electricChars.indexOf(g)>-1&&setTimeout(Fb(c,function(){Uc(c,c.doc.sel.to.line,"smart")}),75),ic(c,a,g)||(b&&!d&&(c.display.inputHasSelection=null),Kb(c))}}}function mc(a){"nocursor"!=a.options.readOnly&&(a.state.focused||(Ne(a,"focus",a),a.state.focused=!0,-1==a.display.wrapper.className.search(/\bCodeMirror-focused\b/)&&(a.display.wrapper.className+=" CodeMirror-focused"),a.curOp||(Mb(a,!0),f&&setTimeout(ff(Mb,a,!0),0))),Jb(a),ab(a))}function nc(a){a.state.focused&&(Ne(a,"blur",a),a.state.focused=!1,a.display.wrapper.className=a.display.wrapper.className.replace(" CodeMirror-focused","")),clearInterval(a.display.blinker),setTimeout(function(){a.state.focused||(a.doc.sel.shift=!1)},150)}function pc(a,c){function l(){if(null!=e.input.selectionStart){var a=e.input.value="\u200b"+(Cc(f.from,f.to)?"":e.input.value);e.prevInput="\u200b",e.input.selectionStart=1,e.input.selectionEnd=a.length}}function m(){if(e.inputDiv.style.position="relative",e.input.style.cssText=k,d&&(e.scrollbarV.scrollTop=e.scroller.scrollTop=h),Jb(a),null!=e.input.selectionStart){(!b||d)&&l(),clearTimeout(oc);var c=0,f=function(){" "==e.prevInput&&0==e.input.selectionStart?Fb(a,jd.selectAll)(a):c++<10?oc=setTimeout(f,500):Mb(a)};oc=setTimeout(f,200)}}if(!Re(a,c,"contextmenu")){var e=a.display,f=a.doc.sel;if(!Qb(e,c)&&!Wb(a,c)){var g=Rb(a,c),h=e.scroller.scrollTop;if(g&&!i){var j=a.options.resetSelectionOnContextMenu;j&&(Cc(f.from,f.to)||Dc(g,f.from)||!Dc(g,f.to))&&Fb(a,Lc)(a.doc,g,g);var k=e.input.style.cssText;if(e.inputDiv.style.position="absolute",e.input.style.cssText="position: fixed; width: 30px; height: 30px; top: "+(c.clientY-5)+"px; left: "+(c.clientX-5)+"px; z-index: 1000; background: white; outline: none;"+"border-width: 0; outline: none; overflow: hidden; opacity: .05; -ms-opacity: .05; filter: alpha(opacity=5);",Nb(a),Mb(a,!0),Cc(f.from,f.to)&&(e.input.value=e.prevInput=" "),b&&!d&&l(),u){Ie(c);var n=function(){Me(window,"mouseup",n),setTimeout(m,20)};Le(window,"mouseup",n)}else setTimeout(m,50)}}}}function rc(a,b,c){if(!Dc(b.from,c))return Gc(a,c);var d=b.text.length-1-(b.to.line-b.from.line);if(c.line>b.to.line+d){var e=c.line-d,f=a.first+a.size-1;return e>f?Bc(f,le(a,f).text.length):Hc(c,le(a,e).text.length)}if(c.line==b.to.line+d)return Hc(c,_e(b.text).length+(1==b.text.length?b.from.ch:0)+le(a,b.to.line).text.length-b.to.ch);var g=c.line-b.from.line;return Hc(c,b.text[g].length+(g?0:b.from.ch))}function sc(a,b,c){if(c&&"object"==typeof c)return{anchor:rc(a,b,c.anchor),head:rc(a,b,c.head)};if("start"==c)return{anchor:b.from,head:b.from};var d=qc(b);if("around"==c)return{anchor:b.from,head:d};if("end"==c)return{anchor:d,head:d};var e=function(a){if(Dc(a,b.from))return a;if(!Dc(b.to,a))return d;var c=a.line+b.text.length-(b.to.line-b.from.line)-1,e=a.ch;return a.line==b.to.line&&(e+=d.ch-b.to.ch),Bc(c,e)};return{anchor:e(a.sel.anchor),head:e(a.sel.head)}}function tc(a,b,c){var d={canceled:!1,from:b.from,to:b.to,text:b.text,origin:b.origin,cancel:function(){this.canceled=!0}};return c&&(d.update=function(b,c,d,e){b&&(this.from=Gc(a,b)),c&&(this.to=Gc(a,c)),d&&(this.text=d),void 0!==e&&(this.origin=e)}),Ne(a,"beforeChange",a,d),a.cm&&Ne(a.cm,"beforeChange",a.cm,d),d.canceled?null:{from:d.from,to:d.to,text:d.text,origin:d.origin}}function uc(a,b,c,d){if(a.cm){if(!a.cm.curOp)return Fb(a.cm,uc)(a,b,c,d);if(a.cm.state.suppressEdits)return}if(!(Te(a,"beforeChange")||a.cm&&Te(a.cm,"beforeChange"))||(b=tc(a,b,!0))){var e=v&&!d&&Bd(a,b.from,b.to);if(e){for(var f=e.length-1;f>=1;--f)vc(a,{from:e[f].from,to:e[f].to,text:[""]});e.length&&vc(a,{from:e[0].from,to:e[0].to,text:b.text},c)}else vc(a,b,c)}}function vc(a,b,c){if(1!=b.text.length||""!=b.text[0]||!Cc(b.from,b.to)){var d=sc(a,b,c);we(a,b,d,a.cm?a.cm.curOp.id:0/0),yc(a,b,d,zd(a,b));var e=[];je(a,function(a,c){c||-1!=bf(e,a.history)||(Ce(a.history,b),e.push(a.history)),yc(a,b,null,zd(a,b))})}}function wc(a,b){if(!a.cm||!a.cm.state.suppressEdits){var c=a.history,d=("undo"==b?c.done:c.undone).pop();if(d){var e={changes:[],anchorBefore:d.anchorAfter,headBefore:d.headAfter,anchorAfter:d.anchorBefore,headAfter:d.headBefore,generation:c.generation};("undo"==b?c.undone:c.done).push(e),c.generation=d.generation||++c.maxGeneration;for(var f=Te(a,"beforeChange")||a.cm&&Te(a.cm,"beforeChange"),g=d.changes.length-1;g>=0;--g){var h=d.changes[g];if(h.origin=b,f&&!tc(a,h,!1))return("undo"==b?c.done:c.undone).length=0,void 0;e.changes.push(ve(a,h));var i=g?sc(a,h,null):{anchor:d.anchorBefore,head:d.headBefore};yc(a,h,i,Ad(a,h));var j=[];je(a,function(a,b){b||-1!=bf(j,a.history)||(Ce(a.history,h),j.push(a.history)),yc(a,h,null,Ad(a,h))})}}}}function xc(a,b){function c(a){return Bc(a.line+b,a.ch)}a.first+=b,a.cm&&Ib(a.cm,a.first,a.first,b),a.sel.head=c(a.sel.head),a.sel.anchor=c(a.sel.anchor),a.sel.from=c(a.sel.from),a.sel.to=c(a.sel.to)}function yc(a,b,c,d){if(a.cm&&!a.cm.curOp)return Fb(a.cm,yc)(a,b,c,d);if(b.to.line<a.first)return xc(a,b.text.length-1-(b.to.line-b.from.line)),void 0;if(!(b.from.line>a.lastLine())){if(b.from.line<a.first){var e=b.text.length-1-(a.first-b.from.line);xc(a,e),b={from:Bc(a.first,0),to:Bc(b.to.line+e,b.to.ch),text:[_e(b.text)],origin:b.origin}}var f=a.lastLine();b.to.line>f&&(b={from:b.from,to:Bc(f,le(a,f).text.length),text:[b.text[0]],origin:b.origin}),b.removed=me(a,b.from,b.to),c||(c=sc(a,b,null)),a.cm?zc(a.cm,b,d,c):ce(a,b,d,c)}}function zc(a,b,c,d){var e=a.doc,f=a.display,g=b.from,h=b.to,i=!1,j=g.line;a.options.lineWrapping||(j=pe(Fd(e,le(e,g.line))),e.iter(j,h.line+1,function(a){return a==f.maxLine?(i=!0,!0):void 0})),Dc(e.sel.head,b.from)||Dc(b.to,e.sel.head)||(a.curOp.cursorActivity=!0),ce(e,b,c,d,B(a)),a.options.lineWrapping||(e.iter(j,g.line+b.text.length,function(a){var b=H(e,a);b>f.maxLineLength&&(f.maxLine=a,f.maxLineLength=b,f.maxLineChanged=!0,i=!1)}),i&&(a.curOp.updateMaxLine=!0)),e.frontier=Math.min(e.frontier,g.line),bb(a,400);var k=b.text.length-(h.line-g.line)-1;if(Ib(a,g.line,h.line+1,k),Te(a,"change")){var l={from:g,to:h,text:b.text,removed:b.removed,origin:b.origin};if(a.curOp.textChanged){for(var m=a.curOp.textChanged;m.next;m=m.next);m.next=l}else a.curOp.textChanged=l}}function Ac(a,b,c,d,e){if(d||(d=c),Dc(d,c)){var f=d;d=c,c=f}"string"==typeof b&&(b=wf(b)),uc(a,{from:c,to:d,text:b,origin:e},null)}function Bc(a,b){return this instanceof Bc?(this.line=a,this.ch=b,void 0):new Bc(a,b)}function Cc(a,b){return a.line==b.line&&a.ch==b.ch}function Dc(a,b){return a.line<b.line||a.line==b.line&&a.ch<b.ch}function Ec(a){return Bc(a.line,a.ch)}function Fc(a,b){return Math.max(a.first,Math.min(b,a.first+a.size-1))}function Gc(a,b){if(b.line<a.first)return Bc(a.first,0);var c=a.first+a.size-1;return b.line>c?Bc(c,le(a,c).text.length):Hc(b,le(a,b.line).text.length)}function Hc(a,b){var c=a.ch;return null==c||c>b?Bc(a.line,b):0>c?Bc(a.line,0):a}function Ic(a,b){return b>=a.first&&b<a.first+a.size}function Jc(a,b,c,d){if(a.sel.shift||a.sel.extend){var e=a.sel.anchor;if(c){var f=Dc(b,e);f!=Dc(c,e)?(e=b,b=c):f!=Dc(b,c)&&(b=c)}Lc(a,e,b,d)}else Lc(a,b,c||b,d);a.cm&&(a.cm.curOp.userSelChange=!0)}function Kc(a,b,c){var d={anchor:b,head:c};return Ne(a,"beforeSelectionChange",a,d),a.cm&&Ne(a.cm,"beforeSelectionChange",a.cm,d),d.anchor=Gc(a,d.anchor),d.head=Gc(a,d.head),d}function Lc(a,b,c,d,e){if(!e&&Te(a,"beforeSelectionChange")||a.cm&&Te(a.cm,"beforeSelectionChange")){var f=Kc(a,b,c);c=f.head,b=f.anchor}var g=a.sel;if(g.goalColumn=null,null==d&&(d=Dc(c,g.head)?-1:1),(e||!Cc(b,g.anchor))&&(b=Nc(a,b,d,"push"!=e)),(e||!Cc(c,g.head))&&(c=Nc(a,c,d,"push"!=e)),!Cc(g.anchor,b)||!Cc(g.head,c)){g.anchor=b,g.head=c;var h=Dc(c,b);g.from=h?c:b,g.to=h?b:c,a.cm&&(a.cm.curOp.updateInput=a.cm.curOp.selectionChanged=a.cm.curOp.cursorActivity=!0),Qe(a,"cursorActivity",a)}}function Mc(a){Lc(a.doc,a.doc.sel.from,a.doc.sel.to,null,"push")}function Nc(a,b,c,d){var e=!1,f=b,g=c||1;a.cantEdit=!1;a:for(;;){var h=le(a,f.line);if(h.markedSpans)for(var i=0;i<h.markedSpans.length;++i){var j=h.markedSpans[i],k=j.marker;if((null==j.from||(k.inclusiveLeft?j.from<=f.ch:j.from<f.ch))&&(null==j.to||(k.inclusiveRight?j.to>=f.ch:j.to>f.ch))){if(d&&(Ne(k,"beforeCursorEnter"),k.explicitlyCleared)){if(h.markedSpans){--i;continue}break}if(!k.atomic)continue;var l=k.find()[0>g?"from":"to"];if(Cc(l,f)&&(l.ch+=g,l.ch<0?l=l.line>a.first?Gc(a,Bc(l.line-1)):null:l.ch>h.text.length&&(l=l.line<a.first+a.size-1?Bc(l.line+1,0):null),!l)){if(e)return d?(a.cantEdit=!0,Bc(a.first,0)):Nc(a,b,c,!0);e=!0,l=b,g=-g}f=l;continue a}}return f}}function Oc(a){var b=Pc(a,a.doc.sel.head,null,a.options.cursorScrollMargin);if(a.state.focused){var c=a.display,d=pf(c.sizer),e=null;if(b.top+d.top<0?e=!0:b.bottom+d.top>(window.innerHeight||document.documentElement.clientHeight)&&(e=!1),null!=e&&!n){var f="none"==c.cursor.style.display;f&&(c.cursor.style.display="",c.cursor.style.left=b.left+"px",c.cursor.style.top=b.top-c.viewOffset+"px"),c.cursor.scrollIntoView(e),f&&(c.cursor.style.display="none")}}}function Pc(a,b,c,d){for(null==d&&(d=0);;){var e=!1,f=vb(a,b),g=c&&c!=b?vb(a,c):f,h=Rc(a,Math.min(f.left,g.left),Math.min(f.top,g.top)-d,Math.max(f.left,g.left),Math.max(f.bottom,g.bottom)+d),i=a.doc.scrollTop,j=a.doc.scrollLeft;if(null!=h.scrollTop&&(_b(a,h.scrollTop),Math.abs(a.doc.scrollTop-i)>1&&(e=!0)),null!=h.scrollLeft&&(ac(a,h.scrollLeft),Math.abs(a.doc.scrollLeft-j)>1&&(e=!0)),!e)return f}}function Qc(a,b,c,d,e){var f=Rc(a,b,c,d,e);null!=f.scrollTop&&_b(a,f.scrollTop),null!=f.scrollLeft&&ac(a,f.scrollLeft)}function Rc(a,b,c,d,e){var f=a.display,g=Ab(a.display);0>c&&(c=0);var h=f.scroller.clientHeight-Ve,i=f.scroller.scrollTop,j={},k=a.doc.height+gb(f),l=g>c,m=e>k-g;if(i>c)j.scrollTop=l?0:c;else if(e>i+h){var n=Math.min(c,(m?k:e)-h);n!=i&&(j.scrollTop=n)}var o=f.scroller.clientWidth-Ve,p=f.scroller.scrollLeft;b+=f.gutters.offsetWidth,d+=f.gutters.offsetWidth;var q=f.gutters.offsetWidth,r=q+10>b;return p+q>b||r?(r&&(b=0),j.scrollLeft=Math.max(0,b-10-q)):d>o+p-3&&(j.scrollLeft=d+10-o),j}function Sc(a,b,c){a.curOp.updateScrollPos={scrollLeft:null==b?a.doc.scrollLeft:b,scrollTop:null==c?a.doc.scrollTop:c}}function Tc(a,b,c){var d=a.curOp.updateScrollPos||(a.curOp.updateScrollPos={scrollLeft:a.doc.scrollLeft,scrollTop:a.doc.scrollTop}),e=a.display.scroller;d.scrollTop=Math.max(0,Math.min(e.scrollHeight-e.clientHeight,d.scrollTop+c)),d.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,d.scrollLeft+b))}function Uc(a,b,c,d){var e=a.doc;if(null==c&&(c="add"),"smart"==c)if(a.doc.mode.indent)var f=eb(a,b);else c="prev";var k,g=a.options.tabSize,h=le(e,b),i=Ye(h.text,null,g),j=h.text.match(/^\s*/)[0];if("smart"==c&&(k=a.doc.mode.indent(f,h.text.slice(j.length),h.text),k==We)){if(!d)return;c="prev"}"prev"==c?k=b>e.first?Ye(le(e,b-1).text,null,g):0:"add"==c?k=i+a.options.indentUnit:"subtract"==c?k=i-a.options.indentUnit:"number"==typeof c&&(k=i+c),k=Math.max(0,k);var l="",m=0;if(a.options.indentWithTabs)for(var n=Math.floor(k/g);n;--n)m+=g,l+="	";k>m&&(l+=$e(k-m)),l!=j?Ac(a.doc,l,Bc(b,0),Bc(b,j.length),"+input"):e.sel.head.line==b&&e.sel.head.ch<j.length&&Lc(e,Bc(b,j.length),Bc(b,j.length),1),h.stateAfter=null}function Vc(a,b,c){var d=b,e=b,f=a.doc;return"number"==typeof b?e=le(f,Fc(f,b)):d=pe(b),null==d?null:c(e,d)?(Ib(a,d,d+1),e):null}function Wc(a,b,c,d,e){function k(){var b=f+c;return b<a.first||b>=a.first+a.size?j=!1:(f=b,i=le(a,b))}function l(a){var b=(e?Lf:Mf)(i,g,c,!0);if(null==b){if(a||!k())return j=!1;g=e?(0>c?Ef:Df)(i):0>c?i.text.length:0}else g=b;return!0}var f=b.line,g=b.ch,h=c,i=le(a,f),j=!0;if("char"==d)l();else if("column"==d)l(!0);else if("word"==d||"group"==d)for(var m=null,n="group"==d,o=!0;!(0>c)||l(!o);o=!1){var p=i.text.charAt(g)||"\n",q=hf(p)?"w":n?/\s/.test(p)?null:"p":null;if(m&&m!=q){0>c&&(c=1,l());break}if(q&&(m=q),c>0&&!l(!o))break}var r=Nc(a,Bc(f,g),h,!0);return j||(r.hitSide=!0),r}function Xc(a,b,c,d){var g,e=a.doc,f=b.left;if("page"==d){var h=Math.min(a.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight);g=b.top+c*(h-(0>c?1.5:.5)*Ab(a.display))}else"line"==d&&(g=c>0?b.bottom+3:b.top-3);for(;;){var i=xb(a,f,g);if(!i.outside)break;if(0>c?0>=g:g>=e.height){i.hitSide=!0;break}g+=5*c}return i}function Yc(a,b){var c=b.ch,d=b.ch;if(a){(b.xRel<0||d==a.length)&&c?--c:++d;for(var e=a.charAt(c),f=hf(e)?hf:/\s/.test(e)?function(a){return/\s/.test(a)}:function(a){return!/\s/.test(a)&&!hf(a)};c>0&&f(a.charAt(c-1));)--c;for(;d<a.length&&f(a.charAt(d));)++d}return{from:Bc(b.line,c),to:Bc(b.line,d)}}function Zc(a,b){Jc(a.doc,Bc(b,0),Gc(a.doc,Bc(b+1,0)))}function ad(a,b,c,d){x.defaults[a]=b,c&&($c[a]=d?function(a,b,d){d!=bd&&c(a,b,d)}:c)}function hd(a,b){if(b===!0)return b;if(a.copyState)return a.copyState(b);var c={};for(var d in b){var e=b[d];e instanceof Array&&(e=e.concat([])),c[d]=e}return c}function id(a,b,c){return a.startState?a.startState(b,c):!0}function ld(a){return"string"==typeof a?kd[a]:a}function md(a,b,c){function d(b){b=ld(b);var e=b[a];if(e===!1)return"stop";if(null!=e&&c(e))return!0;if(b.nofallthrough)return"stop";var f=b.fallthrough;if(null==f)return!1;if("[object Array]"!=Object.prototype.toString.call(f))return d(f);for(var g=0,h=f.length;h>g;++g){var i=d(f[g]);if(i)return i}return!1}for(var e=0;e<b.length;++e){var f=d(b[e]);if(f)return"stop"!=f}}function nd(a){var b=zf[a.keyCode];return"Ctrl"==b||"Alt"==b||"Shift"==b||"Mod"==b}function od(a,b){if(i&&34==a.keyCode&&a["char"])return!1;var c=zf[a.keyCode];return null==c||a.altGraphKey?!1:(a.altKey&&(c="Alt-"+c),(t?a.metaKey:a.ctrlKey)&&(c="Ctrl-"+c),(t?a.ctrlKey:a.metaKey)&&(c="Cmd-"+c),!b&&a.shiftKey&&(c="Shift-"+c),c)}function pd(a,b){this.pos=this.start=0,this.string=a,this.tabSize=b||8,this.lastColumnPos=this.lastColumnValue=0}function qd(a,b){this.lines=[],this.type=b,this.doc=a}function rd(a,b,c,d,e){if(d&&d.shared)return td(a,b,c,d,e);if(a.cm&&!a.cm.curOp)return Fb(a.cm,rd)(a,b,c,d,e);var f=new qd(a,e);if(Dc(c,b)||Cc(b,c)&&"range"==e&&(!d.inclusiveLeft||!d.inclusiveRight))return f;d&&df(d,f),f.replacedWith&&(f.collapsed=!0,f.replacedWith=lf("span",[f.replacedWith],"CodeMirror-widget"),d.handleMouseEvents||(f.replacedWith.ignoreEvents=!0)),f.collapsed&&(w=!0),f.addToHistory&&we(a,{from:b,to:c,origin:"markText"},{head:a.sel.head,anchor:a.sel.anchor},0/0);var i,j,l,g=b.line,h=0,k=a.cm;if(a.iter(g,c.line+1,function(d){k&&f.collapsed&&!k.options.lineWrapping&&Fd(a,d)==k.display.maxLine&&(l=!0);var e={from:null,to:null,marker:f};h+=d.text.length,g==b.line&&(e.from=b.ch,h-=b.ch),g==c.line&&(e.to=c.ch,h-=d.text.length-c.ch),f.collapsed&&(g==c.line&&(j=Cd(d,c.ch)),g==b.line?i=Cd(d,b.ch):oe(d,0)),wd(d,e),++g}),f.collapsed&&a.iter(b.line,c.line+1,function(b){Gd(a,b)&&oe(b,0)}),f.clearOnEnter&&Le(f,"beforeCursorEnter",function(){f.clear()}),f.readOnly&&(v=!0,(a.history.done.length||a.history.undone.length)&&a.clearHistory()),f.collapsed){if(i!=j)throw new Error("Inserting collapsed marker overlapping an existing one");f.size=h,f.atomic=!0}return k&&(l&&(k.curOp.updateMaxLine=!0),(f.className||f.title||f.startStyle||f.endStyle||f.collapsed)&&Ib(k,b.line,c.line+1),f.atomic&&Mc(k)),f}function sd(a,b){this.markers=a,this.primary=b;for(var c=0,d=this;c<a.length;++c)a[c].parent=this,Le(a[c],"clear",function(){d.clear()})}function td(a,b,c,d,e){d=df(d),d.shared=!1;var f=[rd(a,b,c,d,e)],g=f[0],h=d.replacedWith;return je(a,function(a){h&&(d.replacedWith=h.cloneNode(!0)),f.push(rd(a,Gc(a,b),Gc(a,c),d,e));for(var i=0;i<a.linked.length;++i)if(a.linked[i].isParent)return;g=_e(f)}),new sd(f,g)}function ud(a,b){if(a)for(var c=0;c<a.length;++c){var d=a[c];if(d.marker==b)return d}}function vd(a,b){for(var c,d=0;d<a.length;++d)a[d]!=b&&(c||(c=[])).push(a[d]);return c}function wd(a,b){a.markedSpans=a.markedSpans?a.markedSpans.concat([b]):[b],b.marker.attachLine(a)}function xd(a,b,c){if(a)for(var e,d=0;d<a.length;++d){var f=a[d],g=f.marker,h=null==f.from||(g.inclusiveLeft?f.from<=b:f.from<b);if(h||(g.inclusiveLeft&&g.inclusiveRight||"bookmark"==g.type)&&f.from==b&&(!c||!f.marker.insertLeft)){var i=null==f.to||(g.inclusiveRight?f.to>=b:f.to>b);(e||(e=[])).push({from:f.from,to:i?null:f.to,marker:g})}}return e}function yd(a,b,c){if(a)for(var e,d=0;d<a.length;++d){var f=a[d],g=f.marker,h=null==f.to||(g.inclusiveRight?f.to>=b:f.to>b);if(h||"bookmark"==g.type&&f.from==b&&(!c||f.marker.insertLeft)){var i=null==f.from||(g.inclusiveLeft?f.from<=b:f.from<b);(e||(e=[])).push({from:i?null:f.from-b,to:null==f.to?null:f.to-b,marker:g})}}return e}function zd(a,b){var c=Ic(a,b.from.line)&&le(a,b.from.line).markedSpans,d=Ic(a,b.to.line)&&le(a,b.to.line).markedSpans;if(!c&&!d)return null;var e=b.from.ch,f=b.to.ch,g=Cc(b.from,b.to),h=xd(c,e,g),i=yd(d,f,g),j=1==b.text.length,k=_e(b.text).length+(j?e:0);if(h)for(var l=0;l<h.length;++l){var m=h[l];if(null==m.to){var n=ud(i,m.marker);n?j&&(m.to=null==n.to?null:n.to+k):m.to=e}}if(i)for(var l=0;l<i.length;++l){var m=i[l];if(null!=m.to&&(m.to+=k),null==m.from){var n=ud(h,m.marker);n||(m.from=k,j&&(h||(h=[])).push(m))}else m.from+=k,j&&(h||(h=[])).push(m)}if(j&&h){for(var l=0;l<h.length;++l)null!=h[l].from&&h[l].from==h[l].to&&"bookmark"!=h[l].marker.type&&h.splice(l--,1);h.length||(h=null)}var o=[h];if(!j){var q,p=b.text.length-2;if(p>0&&h)for(var l=0;l<h.length;++l)null==h[l].to&&(q||(q=[])).push({from:null,to:null,marker:h[l].marker});for(var l=0;p>l;++l)o.push(q);o.push(i)}return o}function Ad(a,b){var c=ye(a,b),d=zd(a,b);if(!c)return d;if(!d)return c;for(var e=0;e<c.length;++e){var f=c[e],g=d[e];if(f&&g)a:for(var h=0;h<g.length;++h){for(var i=g[h],j=0;j<f.length;++j)if(f[j].marker==i.marker)continue a;f.push(i)}else g&&(c[e]=g)}return c}function Bd(a,b,c){var d=null;if(a.iter(b.line,c.line+1,function(a){if(a.markedSpans)for(var b=0;b<a.markedSpans.length;++b){var c=a.markedSpans[b].marker;!c.readOnly||d&&-1!=bf(d,c)||(d||(d=[])).push(c)}}),!d)return null;for(var e=[{from:b,to:c}],f=0;f<d.length;++f)for(var g=d[f],h=g.find(),i=0;i<e.length;++i){var j=e[i];if(!Dc(j.to,h.from)&&!Dc(h.to,j.from)){var k=[i,1];(Dc(j.from,h.from)||!g.inclusiveLeft&&Cc(j.from,h.from))&&k.push({from:j.from,to:h.from}),(Dc(h.to,j.to)||!g.inclusiveRight&&Cc(j.to,h.to))&&k.push({from:h.to,to:j.to}),e.splice.apply(e,k),i+=k.length-1}}return e}function Cd(a,b){var d,c=w&&a.markedSpans;if(c)for(var e,f=0;f<c.length;++f)e=c[f],e.marker.collapsed&&(null==e.from||e.from<b)&&(null==e.to||e.to>b)&&(!d||d.width<e.marker.width)&&(d=e.marker);return d}function Dd(a){return Cd(a,-1)}function Ed(a){return Cd(a,a.text.length+1)}function Fd(a,b){for(var c;c=Dd(b);)b=le(a,c.find().from.line);return b}function Gd(a,b){var c=w&&b.markedSpans;if(c)for(var d,e=0;e<c.length;++e)if(d=c[e],d.marker.collapsed){if(null==d.from)return!0;if(!d.marker.replacedWith&&0==d.from&&d.marker.inclusiveLeft&&Hd(a,b,d))return!0}}function Hd(a,b,c){if(null==c.to){var d=c.marker.find().to,e=le(a,d.line);return Hd(a,e,ud(e.markedSpans,c.marker))}if(c.marker.inclusiveRight&&c.to==b.text.length)return!0;for(var f,g=0;g<b.markedSpans.length;++g)if(f=b.markedSpans[g],f.marker.collapsed&&!f.marker.replacedWith&&f.from==c.to&&(f.marker.inclusiveLeft||c.marker.inclusiveRight)&&Hd(a,b,f))return!0}function Id(a){var b=a.markedSpans;if(b){for(var c=0;c<b.length;++c)b[c].marker.detachLine(a);a.markedSpans=null}}function Jd(a,b){if(b){for(var c=0;c<b.length;++c)b[c].marker.attachLine(a);a.markedSpans=b}}function Ld(a){return function(){var b=!this.cm.curOp;b&&Db(this.cm);try{var c=a.apply(this,arguments)}finally{b&&Eb(this.cm)}return c}}function Md(a){return null!=a.height?a.height:(a.node.parentNode&&1==a.node.parentNode.nodeType||nf(a.cm.display.measure,lf("div",[a.node],null,"position: relative")),a.height=a.node.offsetHeight)}function Nd(a,b,c,d){var e=new Kd(a,c,d);return e.noHScroll&&(a.display.alignWidgets=!0),Vc(a,b,function(b){var c=b.widgets||(b.widgets=[]);if(null==e.insertAt?c.push(e):c.splice(Math.min(c.length-1,Math.max(0,e.insertAt)),0,e),e.line=b,!Gd(a.doc,b)||e.showIfHidden){var d=re(a,b)<a.doc.scrollTop;oe(b,b.height+Md(e)),d&&Tc(a,0,e.height)}return!0}),e}function Pd(a,b,c,d){a.text=b,a.stateAfter&&(a.stateAfter=null),a.styles&&(a.styles=null),null!=a.order&&(a.order=null),Id(a),Jd(a,c);var e=d?d(a):1;e!=a.height&&oe(a,e)}function Qd(a){a.parent=null,Id(a)}function Rd(a,b,c,d,e,f){var g=c.flattenSpans;null==g&&(g=a.options.flattenSpans);var k,h=0,i=null,j=new pd(b,a.options.tabSize);for(""==b&&c.blankLine&&c.blankLine(d);!j.eol();)j.pos>a.options.maxHighlightLength?(g=!1,f&&Ud(a,b,d,j.pos),j.pos=b.length,k=null):k=c.token(j,d),g&&i==k||(h<j.start&&e(j.start,i),h=j.start,i=k),j.start=j.pos;for(;h<j.pos;){var l=Math.min(j.pos,h+5e4);e(l,i),h=l}}function Sd(a,b,c,d){var e=[a.state.modeGen];Rd(a,b.text,a.doc.mode,c,function(a,b){e.push(a,b)},d);for(var f=0;f<a.state.overlays.length;++f){var g=a.state.overlays[f],h=1,i=0;Rd(a,b.text,g.mode,!0,function(a,b){for(var c=h;a>i;){var d=e[h];d>a&&e.splice(h,1,a,e[h+1],d),h+=2,i=Math.min(a,d)}if(b)if(g.opaque)e.splice(c,h-c,a,b),h=c+2;else for(;h>c;c+=2){var f=e[c+1];e[c+1]=f?f+" "+b:b}})}return e}function Td(a,b){return b.styles&&b.styles[0]==a.state.modeGen||(b.styles=Sd(a,b,b.stateAfter=eb(a,pe(b)))),b.styles}function Ud(a,b,c,d){var e=a.doc.mode,f=new pd(b,a.options.tabSize);for(f.start=f.pos=d||0,""==b&&e.blankLine&&e.blankLine(c);!f.eol()&&f.pos<=a.options.maxHighlightLength;)e.token(f,c),f.start=f.pos}function Wd(a,b){if(!a)return null;for(;;){var c=a.match(/(?:^|\s)line-(background-)?(\S+)/);if(!c)break;a=a.slice(0,c.index)+a.slice(c.index+c[0].length);var d=c[1]?"bgClass":"textClass";null==b[d]?b[d]=c[2]:new RegExp("(?:^|s)"+c[2]+"(?:$|s)").test(b[d])||(b[d]+=" "+c[2])}return Vd[a]||(Vd[a]="cm-"+a.replace(/ +/g," cm-"))}function Xd(a,c,d,g){for(var h,i=c,j=!0;h=Dd(i);)i=le(a.doc,h.find().from.line);var k={pre:lf("pre"),col:0,pos:0,measure:null,measuredSomething:!1,cm:a,copyWidgets:g};do{i.text&&(j=!1),k.measure=i==c&&d,k.pos=0,k.addToken=k.measure?$d:Zd,(b||f)&&a.getOption("lineWrapping")&&(k.addToken=_d(k.addToken));var l=be(i,k,Td(a,i));d&&i==c&&!k.measuredSomething&&(d[0]=k.pre.appendChild(vf(a.display.measure)),k.measuredSomething=!0),l&&(i=le(a.doc,l.to.line))}while(l);!d||k.measuredSomething||d[0]||(d[0]=k.pre.appendChild(j?lf("span","\xa0"):vf(a.display.measure))),k.pre.firstChild||Gd(a.doc,c)||k.pre.appendChild(document.createTextNode("\xa0"));var m;if(d&&(b||e)&&(m=se(i))){var n=m.length-1;m[n].from==m[n].to&&--n;var o=m[n],p=m[n-1];if(o.from+1==o.to&&p&&o.level<p.level){var q=d[k.pos-1];q&&q.parentNode.insertBefore(q.measureRight=vf(a.display.measure),q.nextSibling)}}var r=k.textClass?k.textClass+" "+(c.textClass||""):c.textClass;return r&&(k.pre.className=r),Ne(a,"renderLine",a,c,k.pre),k}function Yd(a){var b=lf("span","\u2022","cm-invalidchar");return b.title="\\u"+a.charCodeAt(0).toString(16),b}function Zd(a,b,c,d,e,f){if(b){var g=a.cm.options.specialChars;if(g.test(b))for(var h=document.createDocumentFragment(),i=0;;){g.lastIndex=i;var j=g.exec(b),k=j?j.index-i:b.length-i;if(k&&(h.appendChild(document.createTextNode(b.slice(i,i+k))),a.col+=k),!j)break;if(i+=k+1,"	"==j[0]){var l=a.cm.options.tabSize,m=l-a.col%l;h.appendChild(lf("span",$e(m),"cm-tab")),a.col+=m}else{var n=a.cm.options.specialCharPlaceholder(j[0]);h.appendChild(n),a.col+=1}}else{a.col+=b.length;var h=document.createTextNode(b)}if(c||d||e||a.measure){var o=c||"";d&&(o+=d),e&&(o+=e);var n=lf("span",[h],o);return f&&(n.title=f),a.pre.appendChild(n)}a.pre.appendChild(h)}}function $d(a,c,d,e,f){for(var g=a.cm.options.lineWrapping,h=0;h<c.length;++h){var i=c.charAt(h),j=0==h;i>="\ud800"&&"\udbff">i&&h<c.length-1?(i=c.slice(h,h+2),++h):h&&g&&rf(c,h)&&a.pre.appendChild(lf("wbr"));var k=a.measure[a.pos],l=a.measure[a.pos]=Zd(a,i,d,j&&e,h==c.length-1&&f);k&&(l.leftSide=k.leftSide||k),b&&g&&" "==i&&h&&!/\s/.test(c.charAt(h-1))&&h<c.length-1&&!/\s/.test(c.charAt(h+1))&&(l.style.whiteSpace="normal"),a.pos+=i.length}c.length&&(a.measuredSomething=!0)}function _d(a){function b(a){for(var b=" ",c=0;c<a.length-2;++c)b+=c%2?" ":"\xa0";return b+=" "}return function(c,d,e,f,g,h){return a(c,d.replace(/ {3,}/g,b),e,f,g,h)}}function ae(a,b,c,d){var e=!d&&c.replacedWith;if(e&&(a.copyWidgets&&(e=e.cloneNode(!0)),a.pre.appendChild(e),a.measure)){if(b)a.measure[a.pos]=e;else{var f=vf(a.cm.display.measure);if("bookmark"!=c.type||c.insertLeft){if(a.measure[a.pos])return;a.measure[a.pos]=a.pre.insertBefore(f,e)}else a.measure[a.pos]=a.pre.appendChild(f)}a.measuredSomething=!0}a.pos+=b}function be(a,b,c){var d=a.markedSpans,e=a.text,f=0;if(d)for(var k,m,n,o,p,q,h=e.length,i=0,g=1,j="",l=0;;){if(l==i){m=n=o=p="",q=null,l=1/0;for(var r=[],s=0;s<d.length;++s){var t=d[s],u=t.marker;t.from<=i&&(null==t.to||t.to>i)?(null!=t.to&&l>t.to&&(l=t.to,n=""),u.className&&(m+=" "+u.className),u.startStyle&&t.from==i&&(o+=" "+u.startStyle),u.endStyle&&t.to==l&&(n+=" "+u.endStyle),u.title&&!p&&(p=u.title),u.collapsed&&(!q||q.marker.size<u.size)&&(q=t)):t.from>i&&l>t.from&&(l=t.from),"bookmark"==u.type&&t.from==i&&u.replacedWith&&r.push(u)
}if(q&&(q.from||0)==i&&(ae(b,(null==q.to?h:q.to)-i,q.marker,null==q.from),null==q.to))return q.marker.find();if(!q&&r.length)for(var s=0;s<r.length;++s)ae(b,0,r[s])}if(i>=h)break;for(var v=Math.min(h,l);;){if(j){var w=i+j.length;if(!q){var x=w>v?j.slice(0,v-i):j;b.addToken(b,x,k?k+m:m,o,i+x.length==l?n:"",p)}if(w>=v){j=j.slice(v-i),i=v;break}i=w,o=""}j=e.slice(f,f=c[g++]),k=Wd(c[g++],b)}}else for(var g=1;g<c.length;g+=2)b.addToken(b,e.slice(f,f=c[g]),Wd(c[g+1],b))}function ce(a,b,c,d,e){function f(a){return c?c[a]:null}function g(a,c,d){Pd(a,c,d,e),Qe(a,"change",a,b)}var h=b.from,i=b.to,j=b.text,k=le(a,h.line),l=le(a,i.line),m=_e(j),n=f(j.length-1),o=i.line-h.line;if(0!=h.ch||0!=i.ch||""!=m||a.cm&&!a.cm.options.wholeLineUpdateBefore)if(k==l)if(1==j.length)g(k,k.text.slice(0,h.ch)+m+k.text.slice(i.ch),n);else{for(var r=[],p=1,q=j.length-1;q>p;++p)r.push(new Od(j[p],f(p),e));r.push(new Od(m+k.text.slice(i.ch),n,e)),g(k,k.text.slice(0,h.ch)+j[0],f(0)),a.insert(h.line+1,r)}else if(1==j.length)g(k,k.text.slice(0,h.ch)+j[0]+l.text.slice(i.ch),f(0)),a.remove(h.line+1,o);else{g(k,k.text.slice(0,h.ch)+j[0],f(0)),g(l,m+l.text.slice(i.ch),n);for(var p=1,q=j.length-1,r=[];q>p;++p)r.push(new Od(j[p],f(p),e));o>1&&a.remove(h.line+1,o-1),a.insert(h.line+1,r)}else{for(var p=0,q=j.length-1,r=[];q>p;++p)r.push(new Od(j[p],f(p),e));g(l,l.text,n),o&&a.remove(h.line,o),r.length&&a.insert(h.line,r)}Qe(a,"change",a,b),Lc(a,d.anchor,d.head,null,!0)}function de(a){this.lines=a,this.parent=null;for(var b=0,c=a.length,d=0;c>b;++b)a[b].parent=this,d+=a[b].height;this.height=d}function ee(a){this.children=a;for(var b=0,c=0,d=0,e=a.length;e>d;++d){var f=a[d];b+=f.chunkSize(),c+=f.height,f.parent=this}this.size=b,this.height=c,this.parent=null}function je(a,b,c){function d(a,e,f){if(a.linked)for(var g=0;g<a.linked.length;++g){var h=a.linked[g];if(h.doc!=e){var i=f&&h.sharedHist;(!c||i)&&(b(h.doc,i),d(h.doc,a,i))}}}d(a,null,!0)}function ke(a,b){if(b.cm)throw new Error("This document is already in use.");a.doc=b,b.cm=a,C(a),z(a),a.options.lineWrapping||I(a),a.options.mode=b.modeOption,Ib(a)}function le(a,b){for(b-=a.first;!a.lines;)for(var c=0;;++c){var d=a.children[c],e=d.chunkSize();if(e>b){a=d;break}b-=e}return a.lines[b]}function me(a,b,c){var d=[],e=b.line;return a.iter(b.line,c.line+1,function(a){var f=a.text;e==c.line&&(f=f.slice(0,c.ch)),e==b.line&&(f=f.slice(b.ch)),d.push(f),++e}),d}function ne(a,b,c){var d=[];return a.iter(b,c,function(a){d.push(a.text)}),d}function oe(a,b){for(var c=b-a.height,d=a;d;d=d.parent)d.height+=c}function pe(a){if(null==a.parent)return null;for(var b=a.parent,c=bf(b.lines,a),d=b.parent;d;b=d,d=d.parent)for(var e=0;d.children[e]!=b;++e)c+=d.children[e].chunkSize();return c+b.first}function qe(a,b){var c=a.first;a:do{for(var d=0,e=a.children.length;e>d;++d){var f=a.children[d],g=f.height;if(g>b){a=f;continue a}b-=g,c+=f.chunkSize()}return c}while(!a.lines);for(var d=0,e=a.lines.length;e>d;++d){var h=a.lines[d],i=h.height;if(i>b)break;b-=i}return c+d}function re(a,b){b=Fd(a.doc,b);for(var c=0,d=b.parent,e=0;e<d.lines.length;++e){var f=d.lines[e];if(f==b)break;c+=f.height}for(var g=d.parent;g;d=g,g=d.parent)for(var e=0;e<g.children.length;++e){var h=g.children[e];if(h==d)break;c+=h.height}return c}function se(a){var b=a.order;return null==b&&(b=a.order=Nf(a.text)),b}function te(a){return{done:[],undone:[],undoDepth:1/0,lastTime:0,lastOp:null,lastOrigin:null,generation:a||1,maxGeneration:a||1}}function ue(a,b,c,d){var e=b["spans_"+a.id],f=0;a.iter(Math.max(a.first,c),Math.min(a.first+a.size,d),function(c){c.markedSpans&&((e||(e=b["spans_"+a.id]={}))[f]=c.markedSpans),++f})}function ve(a,b){var c={line:b.from.line,ch:b.from.ch},d={from:c,to:qc(b),text:me(a,b.from,b.to)};return ue(a,d,b.from.line,b.to.line+1),je(a,function(a){ue(a,d,b.from.line,b.to.line+1)},!0),d}function we(a,b,c,d){var e=a.history;e.undone.length=0;var f=+new Date,g=_e(e.done);if(g&&(e.lastOp==d||e.lastOrigin==b.origin&&b.origin&&("+"==b.origin.charAt(0)&&a.cm&&e.lastTime>f-a.cm.options.historyEventDelay||"*"==b.origin.charAt(0)))){var h=_e(g.changes);Cc(b.from,b.to)&&Cc(b.from,h.to)?h.to=qc(b):g.changes.push(ve(a,b)),g.anchorAfter=c.anchor,g.headAfter=c.head}else for(g={changes:[ve(a,b)],generation:e.generation,anchorBefore:a.sel.anchor,headBefore:a.sel.head,anchorAfter:c.anchor,headAfter:c.head},e.done.push(g),e.generation=++e.maxGeneration;e.done.length>e.undoDepth;)e.done.shift();e.lastTime=f,e.lastOp=d,e.lastOrigin=b.origin}function xe(a){if(!a)return null;for(var c,b=0;b<a.length;++b)a[b].marker.explicitlyCleared?c||(c=a.slice(0,b)):c&&c.push(a[b]);return c?c.length?c:null:a}function ye(a,b){var c=b["spans_"+a.id];if(!c)return null;for(var d=0,e=[];d<b.text.length;++d)e.push(xe(c[d]));return e}function ze(a,b){for(var c=0,d=[];c<a.length;++c){var e=a[c],f=e.changes,g=[];d.push({changes:g,anchorBefore:e.anchorBefore,headBefore:e.headBefore,anchorAfter:e.anchorAfter,headAfter:e.headAfter});for(var h=0;h<f.length;++h){var j,i=f[h];if(g.push({from:i.from,to:i.to,text:i.text}),b)for(var k in i)(j=k.match(/^spans_(\d+)$/))&&bf(b,Number(j[1]))>-1&&(_e(g)[k]=i[k],delete i[k])}}return d}function Ae(a,b,c,d){c<a.line?a.line+=d:b<a.line&&(a.line=b,a.ch=0)}function Be(a,b,c,d){for(var e=0;e<a.length;++e){for(var f=a[e],g=!0,h=0;h<f.changes.length;++h){var i=f.changes[h];if(f.copied||(i.from=Ec(i.from),i.to=Ec(i.to)),c<i.from.line)i.from.line+=d,i.to.line+=d;else if(b<=i.to.line){g=!1;break}}f.copied||(f.anchorBefore=Ec(f.anchorBefore),f.headBefore=Ec(f.headBefore),f.anchorAfter=Ec(f.anchorAfter),f.readAfter=Ec(f.headAfter),f.copied=!0),g?(Ae(f.anchorBefore),Ae(f.headBefore),Ae(f.anchorAfter),Ae(f.headAfter)):(a.splice(0,e+1),e=0)}}function Ce(a,b){var c=b.from.line,d=b.to.line,e=b.text.length-(d-c)-1;Be(a.done,c,d,e),Be(a.undone,c,d,e)}function De(){Ie(this)}function Ee(a){return a.stop||(a.stop=De),a}function Fe(a){a.preventDefault?a.preventDefault():a.returnValue=!1}function Ge(a){a.stopPropagation?a.stopPropagation():a.cancelBubble=!0}function He(a){return null!=a.defaultPrevented?a.defaultPrevented:0==a.returnValue}function Ie(a){Fe(a),Ge(a)}function Je(a){return a.target||a.srcElement}function Ke(a){var b=a.which;return null==b&&(1&a.button?b=1:2&a.button?b=3:4&a.button&&(b=2)),q&&a.ctrlKey&&1==b&&(b=3),b}function Le(a,b,c){if(a.addEventListener)a.addEventListener(b,c,!1);else if(a.attachEvent)a.attachEvent("on"+b,c);else{var d=a._handlers||(a._handlers={}),e=d[b]||(d[b]=[]);e.push(c)}}function Me(a,b,c){if(a.removeEventListener)a.removeEventListener(b,c,!1);else if(a.detachEvent)a.detachEvent("on"+b,c);else{var d=a._handlers&&a._handlers[b];if(!d)return;for(var e=0;e<d.length;++e)if(d[e]==c){d.splice(e,1);break}}}function Ne(a,b){var c=a._handlers&&a._handlers[b];if(c)for(var d=Array.prototype.slice.call(arguments,2),e=0;e<c.length;++e)c[e].apply(null,d)}function Qe(a,b){function e(a){return function(){a.apply(null,d)}}var c=a._handlers&&a._handlers[b];if(c){var d=Array.prototype.slice.call(arguments,2);Oe||(++Pe,Oe=[],setTimeout(Se,0));for(var f=0;f<c.length;++f)Oe.push(e(c[f]))}}function Re(a,b,c){return Ne(a,c||b.type,a,b),He(b)||b.codemirrorIgnore}function Se(){--Pe;var a=Oe;Oe=null;for(var b=0;b<a.length;++b)a[b]()}function Te(a,b){var c=a._handlers&&a._handlers[b];return c&&c.length>0}function Ue(a){a.prototype.on=function(a,b){Le(this,a,b)},a.prototype.off=function(a,b){Me(this,a,b)}}function Xe(){this.id=null}function Ye(a,b,c,d,e){null==b&&(b=a.search(/[^\s\u00a0]/),-1==b&&(b=a.length));for(var f=d||0,g=e||0;b>f;++f)"	"==a.charAt(f)?g+=c-g%c:++g;return g}function $e(a){for(;Ze.length<=a;)Ze.push(_e(Ze)+" ");return Ze[a]}function _e(a){return a[a.length-1]}function af(a){if(o)a.selectionStart=0,a.selectionEnd=a.value.length;else try{a.select()}catch(b){}}function bf(a,b){if(a.indexOf)return a.indexOf(b);for(var c=0,d=a.length;d>c;++c)if(a[c]==b)return c;return-1}function cf(a,b){function c(){}c.prototype=a;var d=new c;return b&&df(b,d),d}function df(a,b){b||(b={});for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}function ef(a){for(var b=[],c=0;a>c;++c)b.push(void 0);return b}function ff(a){var b=Array.prototype.slice.call(arguments,1);return function(){return a.apply(null,b)}}function hf(a){return/\w/.test(a)||a>"\x80"&&(a.toUpperCase()!=a.toLowerCase()||gf.test(a))}function jf(a){for(var b in a)if(a.hasOwnProperty(b)&&a[b])return!1;return!0}function lf(a,b,c,d){var e=document.createElement(a);if(c&&(e.className=c),d&&(e.style.cssText=d),"string"==typeof b)of(e,b);else if(b)for(var f=0;f<b.length;++f)e.appendChild(b[f]);return e}function mf(a){for(var b=a.childNodes.length;b>0;--b)a.removeChild(a.firstChild);return a}function nf(a,b){return mf(a).appendChild(b)}function of(a,b){d?(a.innerHTML="",a.appendChild(document.createTextNode(b))):a.textContent=b}function pf(a){return a.getBoundingClientRect()}function rf(){return!1}function tf(a){if(null!=sf)return sf;var b=lf("div",null,null,"width: 50px; height: 50px; overflow-x: scroll");return nf(a,b),b.offsetWidth&&(sf=b.offsetHeight-b.clientHeight),sf||0}function vf(a){if(null==uf){var b=lf("span","\u200b");nf(a,lf("span",[b,document.createTextNode("x")])),0!=a.firstChild.offsetHeight&&(uf=b.offsetWidth<=1&&b.offsetHeight>2&&!c)}return uf?lf("span","\u200b"):lf("span","\xa0",null,"display: inline-block; width: 1px; margin-right: -1px")}function Af(a,b,c,d){if(!a)return d(b,c,"ltr");for(var e=!1,f=0;f<a.length;++f){var g=a[f];(g.from<c&&g.to>b||b==c&&g.to==b)&&(d(Math.max(g.from,b),Math.min(g.to,c),1==g.level?"rtl":"ltr"),e=!0)}e||d(b,c,"ltr")}function Bf(a){return a.level%2?a.to:a.from}function Cf(a){return a.level%2?a.from:a.to}function Df(a){var b=se(a);return b?Bf(b[0]):0}function Ef(a){var b=se(a);return b?Cf(_e(b)):a.text.length}function Ff(a,b){var c=le(a.doc,b),d=Fd(a.doc,c);d!=c&&(b=pe(d));var e=se(d),f=e?e[0].level%2?Ef(d):Df(d):0;return Bc(b,f)}function Gf(a,b){for(var c,d;c=Ed(d=le(a.doc,b));)b=c.find().to.line;var e=se(d),f=e?e[0].level%2?Df(d):Ef(d):d.text.length;return Bc(b,f)}function Hf(a,b,c){var d=a[0].level;return b==d?!0:c==d?!1:c>b}function Jf(a,b){for(var d,c=0;c<a.length;++c){var e=a[c];if(e.from<b&&e.to>b)return If=null,c;if(e.from==b||e.to==b){if(null!=d)return Hf(a,e.level,a[d].level)?(If=d,c):(If=c,d);d=c}}return If=null,d}function Kf(a,b,c,d){if(!d)return b+c;do b+=c;while(b>0&&kf.test(a.text.charAt(b)));return b}function Lf(a,b,c,d){var e=se(a);if(!e)return Mf(a,b,c,d);for(var f=Jf(e,b),g=e[f],h=Kf(a,b,g.level%2?-c:c,d);;){if(h>g.from&&h<g.to)return h;if(h==g.from||h==g.to)return Jf(e,h)==f?h:(g=e[f+=c],c>0==g.level%2?g.to:g.from);if(g=e[f+=c],!g)return null;h=c>0==g.level%2?Kf(a,g.to,-1,d):Kf(a,g.from,1,d)}}function Mf(a,b,c,d){var e=b+c;if(d)for(;e>0&&kf.test(a.text.charAt(e));)e+=c;return 0>e||e>a.text.length?null:e}var a=/gecko\/\d/i.test(navigator.userAgent),b=/MSIE \d/.test(navigator.userAgent),c=b&&(null==document.documentMode||document.documentMode<8),d=b&&(null==document.documentMode||document.documentMode<9),e=/Trident\/([7-9]|\d{2,})\./.test(navigator.userAgent),f=/WebKit\//.test(navigator.userAgent),g=f&&/Qt\/\d+\.\d+/.test(navigator.userAgent),h=/Chrome\//.test(navigator.userAgent),i=/Opera\//.test(navigator.userAgent),j=/Apple Computer/.test(navigator.vendor),k=/KHTML\//.test(navigator.userAgent),l=/Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent),m=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent),n=/PhantomJS/.test(navigator.userAgent),o=/AppleWebKit/.test(navigator.userAgent)&&/Mobile\/\w+/.test(navigator.userAgent),p=o||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),q=o||/Mac/.test(navigator.platform),r=/win/i.test(navigator.platform),s=i&&navigator.userAgent.match(/Version\/(\d*\.\d*)/);s&&(s=Number(s[1])),s&&s>=15&&(i=!1,f=!0);var zb,Sb,Tb,t=q&&(g||i&&(null==s||12.11>s)),u=a||b&&!d,v=!1,w=!1,Cb=0,Yb=0,bc=0,cc=null;b?cc=-.53:a?cc=15:h?cc=-.7:j&&(cc=-1/3);var gc,oc,jc=null,qc=x.changeEnd=function(a){return a.text?Bc(a.from.line+a.text.length-1,_e(a.text).length+(1==a.text.length?a.from.ch:0)):a.to};x.Pos=Bc,x.prototype={constructor:x,focus:function(){window.focus(),Nb(this),Kb(this)},setOption:function(a,b){var c=this.options,d=c[a];(c[a]!=b||"mode"==a)&&(c[a]=b,$c.hasOwnProperty(a)&&Fb(this,$c[a])(this,b,d))},getOption:function(a){return this.options[a]},getDoc:function(){return this.doc},addKeyMap:function(a,b){this.state.keyMaps[b?"push":"unshift"](a)},removeKeyMap:function(a){for(var b=this.state.keyMaps,c=0;c<b.length;++c)if(b[c]==a||"string"!=typeof b[c]&&b[c].name==a)return b.splice(c,1),!0},addOverlay:Fb(null,function(a,b){var c=a.token?a:x.getMode(this.options,a);if(c.startState)throw new Error("Overlays may not be stateful.");this.state.overlays.push({mode:c,modeSpec:a,opaque:b&&b.opaque}),this.state.modeGen++,Ib(this)}),removeOverlay:Fb(null,function(a){for(var b=this.state.overlays,c=0;c<b.length;++c){var d=b[c].modeSpec;if(d==a||"string"==typeof a&&d.name==a)return b.splice(c,1),this.state.modeGen++,Ib(this),void 0}}),indentLine:Fb(null,function(a,b,c){"string"!=typeof b&&"number"!=typeof b&&(b=null==b?this.options.smartIndent?"smart":"prev":b?"add":"subtract"),Ic(this.doc,a)&&Uc(this,a,b,c)}),indentSelection:Fb(null,function(a){var b=this.doc.sel;if(Cc(b.from,b.to))return Uc(this,b.from.line,a);for(var c=b.to.line-(b.to.ch?0:1),d=b.from.line;c>=d;++d)Uc(this,d,a)}),getTokenAt:function(a,b){var c=this.doc;a=Gc(c,a);for(var d=eb(this,a.line,b),e=this.doc.mode,f=le(c,a.line),g=new pd(f.text,this.options.tabSize);g.pos<a.ch&&!g.eol();){g.start=g.pos;var h=e.token(g,d)}return{start:g.start,end:g.pos,string:g.current(),className:h||null,type:h||null,state:d}},getTokenTypeAt:function(a){a=Gc(this.doc,a);var b=Td(this,le(this.doc,a.line)),c=0,d=(b.length-1)/2,e=a.ch;if(0==e)return b[2];for(;;){var f=c+d>>1;if((f?b[2*f-1]:0)>=e)d=f;else{if(!(b[2*f+1]<e))return b[2*f+2];c=f+1}}},getModeAt:function(a){var b=this.doc.mode;return b.innerMode?x.innerMode(b,this.getTokenAt(a).state).mode:b},getHelper:function(a,b){if(gd.hasOwnProperty(b)){var c=gd[b],d=this.getModeAt(a);return d[b]&&c[d[b]]||d.helperType&&c[d.helperType]||c[d.name]}},getStateAfter:function(a,b){var c=this.doc;return a=Fc(c,null==a?c.first+c.size-1:a),eb(this,a+1,b)},cursorCoords:function(a,b){var c,d=this.doc.sel;return c=null==a?d.head:"object"==typeof a?Gc(this.doc,a):a?d.from:d.to,vb(this,c,b||"page")},charCoords:function(a,b){return ub(this,Gc(this.doc,a),b||"page")},coordsChar:function(a,b){return a=tb(this,a,b||"page"),xb(this,a.left,a.top)},lineAtHeight:function(a,b){return a=tb(this,{top:a,left:0},b||"page").top,qe(this.doc,a+this.display.viewOffset)},heightAtLine:function(a,b){var c=!1,d=this.doc.first+this.doc.size-1;a<this.doc.first?a=this.doc.first:a>d&&(a=d,c=!0);var e=le(this.doc,a);return sb(this,le(this.doc,a),{top:0,left:0},b||"page").top+(c?e.height:0)},defaultTextHeight:function(){return Ab(this.display)},defaultCharWidth:function(){return Bb(this.display)},setGutterMarker:Fb(null,function(a,b,c){return Vc(this,a,function(a){var d=a.gutterMarkers||(a.gutterMarkers={});return d[b]=c,!c&&jf(d)&&(a.gutterMarkers=null),!0})}),clearGutter:Fb(null,function(a){var b=this,c=b.doc,d=c.first;c.iter(function(c){c.gutterMarkers&&c.gutterMarkers[a]&&(c.gutterMarkers[a]=null,Ib(b,d,d+1),jf(c.gutterMarkers)&&(c.gutterMarkers=null)),++d})}),addLineClass:Fb(null,function(a,b,c){return Vc(this,a,function(a){var d="text"==b?"textClass":"background"==b?"bgClass":"wrapClass";if(a[d]){if(new RegExp("(?:^|\\s)"+c+"(?:$|\\s)").test(a[d]))return!1;a[d]+=" "+c}else a[d]=c;return!0})}),removeLineClass:Fb(null,function(a,b,c){return Vc(this,a,function(a){var d="text"==b?"textClass":"background"==b?"bgClass":"wrapClass",e=a[d];if(!e)return!1;if(null==c)a[d]=null;else{var f=e.match(new RegExp("(?:^|\\s+)"+c+"(?:$|\\s+)"));if(!f)return!1;var g=f.index+f[0].length;a[d]=e.slice(0,f.index)+(f.index&&g!=e.length?" ":"")+e.slice(g)||null}return!0})}),addLineWidget:Fb(null,function(a,b,c){return Nd(this,a,b,c)}),removeLineWidget:function(a){a.clear()},lineInfo:function(a){if("number"==typeof a){if(!Ic(this.doc,a))return null;var b=a;if(a=le(this.doc,a),!a)return null}else{var b=pe(a);if(null==b)return null}return{line:b,handle:a,text:a.text,gutterMarkers:a.gutterMarkers,textClass:a.textClass,bgClass:a.bgClass,wrapClass:a.wrapClass,widgets:a.widgets}},getViewport:function(){return{from:this.display.showingFrom,to:this.display.showingTo}},addWidget:function(a,b,c,d,e){var f=this.display;a=vb(this,Gc(this.doc,a));var g=a.bottom,h=a.left;if(b.style.position="absolute",f.sizer.appendChild(b),"over"==d)g=a.top;else if("above"==d||"near"==d){var i=Math.max(f.wrapper.clientHeight,this.doc.height),j=Math.max(f.sizer.clientWidth,f.lineSpace.clientWidth);("above"==d||a.bottom+b.offsetHeight>i)&&a.top>b.offsetHeight?g=a.top-b.offsetHeight:a.bottom+b.offsetHeight<=i&&(g=a.bottom),h+b.offsetWidth>j&&(h=j-b.offsetWidth)}b.style.top=g+"px",b.style.left=b.style.right="","right"==e?(h=f.sizer.clientWidth-b.offsetWidth,b.style.right="0px"):("left"==e?h=0:"middle"==e&&(h=(f.sizer.clientWidth-b.offsetWidth)/2),b.style.left=h+"px"),c&&Qc(this,h,g,h+b.offsetWidth,g+b.offsetHeight)},triggerOnKeyDown:Fb(null,kc),execCommand:function(a){return jd[a](this)},findPosH:function(a,b,c,d){var e=1;0>b&&(e=-1,b=-b);for(var f=0,g=Gc(this.doc,a);b>f&&(g=Wc(this.doc,g,e,c,d),!g.hitSide);++f);return g},moveH:Fb(null,function(a,b){var d,c=this.doc.sel;d=c.shift||c.extend||Cc(c.from,c.to)?Wc(this.doc,c.head,a,b,this.options.rtlMoveVisually):0>a?c.from:c.to,Jc(this.doc,d,d,a)}),deleteH:Fb(null,function(a,b){var c=this.doc.sel;Cc(c.from,c.to)?Ac(this.doc,"",c.from,Wc(this.doc,c.head,a,b,!1),"+delete"):Ac(this.doc,"",c.from,c.to,"+delete"),this.curOp.userSelChange=!0}),findPosV:function(a,b,c,d){var e=1,f=d;0>b&&(e=-1,b=-b);for(var g=0,h=Gc(this.doc,a);b>g;++g){var i=vb(this,h,"div");if(null==f?f=i.left:i.left=f,h=Xc(this,i,e,c),h.hitSide)break}return h},moveV:Fb(null,function(a,b){var c=this.doc.sel,d=vb(this,c.head,"div");null!=c.goalColumn&&(d.left=c.goalColumn);var e=Xc(this,d,a,b);"page"==b&&Tc(this,0,ub(this,e,"div").top-d.top),Jc(this.doc,e,e,a),c.goalColumn=d.left}),toggleOverwrite:function(a){(null==a||a!=this.state.overwrite)&&((this.state.overwrite=!this.state.overwrite)?this.display.cursor.className+=" CodeMirror-overwrite":this.display.cursor.className=this.display.cursor.className.replace(" CodeMirror-overwrite",""))},hasFocus:function(){return this.state.focused},scrollTo:Fb(null,function(a,b){Sc(this,a,b)}),getScrollInfo:function(){var a=this.display.scroller,b=Ve;return{left:a.scrollLeft,top:a.scrollTop,height:a.scrollHeight-b,width:a.scrollWidth-b,clientHeight:a.clientHeight-b,clientWidth:a.clientWidth-b}},scrollIntoView:Fb(null,function(a,b){null==a?a={from:this.doc.sel.head,to:null}:"number"==typeof a?a={from:Bc(a,0),to:null}:null==a.from&&(a={from:a,to:null}),a.to||(a.to=a.from),b||(b=0);var c=a;null!=a.from.line&&(this.curOp.scrollToPos={from:a.from,to:a.to,margin:b},c={from:vb(this,a.from),to:vb(this,a.to)});var d=Rc(this,Math.min(c.from.left,c.to.left),Math.min(c.from.top,c.to.top)-b,Math.max(c.from.right,c.to.right),Math.max(c.from.bottom,c.to.bottom)+b);Sc(this,d.scrollLeft,d.scrollTop)}),setSize:Fb(null,function(a,b){function c(a){return"number"==typeof a||/^\d+$/.test(String(a))?a+"px":a}null!=a&&(this.display.wrapper.style.width=c(a)),null!=b&&(this.display.wrapper.style.height=c(b)),this.options.lineWrapping&&(this.display.measureLineCache.length=this.display.measureLineCachePos=0),this.curOp.forceUpdate=!0}),operation:function(a){return Hb(this,a)},refresh:Fb(null,function(){var a=null==this.display.cachedTextHeight;pb(this),Sc(this,this.doc.scrollLeft,this.doc.scrollTop),Ib(this),a&&C(this)}),swapDoc:Fb(null,function(a){var b=this.doc;return b.cm=null,ke(this,a),pb(this),Mb(this,!0),Sc(this,a.scrollLeft,a.scrollTop),Qe(this,"swapDoc",this,b),b}),getInputField:function(){return this.display.input},getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}},Ue(x);var $c=x.optionHandlers={},_c=x.defaults={},bd=x.Init={toString:function(){return"CodeMirror.Init"}};ad("value","",function(a,b){a.setValue(b)},!0),ad("mode",null,function(a,b){a.doc.modeOption=b,z(a)},!0),ad("indentUnit",2,z,!0),ad("indentWithTabs",!1),ad("smartIndent",!0),ad("tabSize",4,function(a){z(a),pb(a),Ib(a)},!0),ad("specialChars",/[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\ufeff]/g,function(a,b){a.options.specialChars=new RegExp(b.source+(b.test("	")?"":"|	"),"g"),a.refresh()},!0),ad("specialCharPlaceholder",Yd,function(a){a.refresh()},!0),ad("electricChars",!0),ad("rtlMoveVisually",!r),ad("wholeLineUpdateBefore",!0),ad("theme","default",function(a){E(a),F(a)},!0),ad("keyMap","default",D),ad("extraKeys",null),ad("onKeyEvent",null),ad("onDragEvent",null),ad("lineWrapping",!1,A,!0),ad("gutters",[],function(a){J(a.options),F(a)},!0),ad("fixedGutter",!0,function(a,b){a.display.gutters.style.left=b?P(a.display)+"px":"0",a.refresh()},!0),ad("coverGutterNextToScrollbar",!1,K,!0),ad("lineNumbers",!1,function(a){J(a.options),F(a)},!0),ad("firstLineNumber",1,F,!0),ad("lineNumberFormatter",function(a){return a},F,!0),ad("showCursorWhenSelecting",!1,Z,!0),ad("resetSelectionOnContextMenu",!0),ad("readOnly",!1,function(a,b){"nocursor"==b?(nc(a),a.display.input.blur(),a.display.disabled=!0):(a.display.disabled=!1,b||Mb(a,!0))}),ad("dragDrop",!0),ad("cursorBlinkRate",530),ad("cursorScrollMargin",0),ad("cursorHeight",1),ad("workTime",100),ad("workDelay",100),ad("flattenSpans",!0),ad("pollInterval",100),ad("undoDepth",40,function(a,b){a.doc.history.undoDepth=b}),ad("historyEventDelay",500),ad("viewportMargin",10,function(a){a.refresh()},!0),ad("maxHighlightLength",1e4,function(a){z(a),a.refresh()},!0),ad("crudeMeasuringFrom",1e4),ad("moveInputWithCursor",!0,function(a,b){b||(a.display.inputDiv.style.top=a.display.inputDiv.style.left=0)}),ad("tabindex",null,function(a,b){a.display.input.tabIndex=b||""}),ad("autofocus",null);var cd=x.modes={},dd=x.mimeModes={};x.defineMode=function(a,b){if(x.defaults.mode||"null"==a||(x.defaults.mode=a),arguments.length>2){b.dependencies=[];for(var c=2;c<arguments.length;++c)b.dependencies.push(arguments[c])}cd[a]=b},x.defineMIME=function(a,b){dd[a]=b},x.resolveMode=function(a){if("string"==typeof a&&dd.hasOwnProperty(a))a=dd[a];else if(a&&"string"==typeof a.name&&dd.hasOwnProperty(a.name)){var b=dd[a.name];a=cf(b,a),a.name=b.name}else if("string"==typeof a&&/^[\w\-]+\/[\w\-]+\+xml$/.test(a))return x.resolveMode("application/xml");return"string"==typeof a?{name:a}:a||{name:"null"}},x.getMode=function(a,b){var b=x.resolveMode(b),c=cd[b.name];if(!c)return x.getMode(a,"text/plain");var d=c(a,b);if(ed.hasOwnProperty(b.name)){var e=ed[b.name];for(var f in e)e.hasOwnProperty(f)&&(d.hasOwnProperty(f)&&(d["_"+f]=d[f]),d[f]=e[f])}return d.name=b.name,d},x.defineMode("null",function(){return{token:function(a){a.skipToEnd()}}}),x.defineMIME("text/plain","null");var ed=x.modeExtensions={};x.extendMode=function(a,b){var c=ed.hasOwnProperty(a)?ed[a]:ed[a]={};df(b,c)},x.defineExtension=function(a,b){x.prototype[a]=b},x.defineDocExtension=function(a,b){ge.prototype[a]=b},x.defineOption=ad;var fd=[];x.defineInitHook=function(a){fd.push(a)};var gd=x.helpers={};x.registerHelper=function(a,b,c){gd.hasOwnProperty(a)||(gd[a]=x[a]={}),gd[a][b]=c},x.isWordChar=hf,x.copyState=hd,x.startState=id,x.innerMode=function(a,b){for(;a.innerMode;){var c=a.innerMode(b);if(!c||c.mode==a)break;b=c.state,a=c.mode}return c||{mode:a,state:b}};var jd=x.commands={selectAll:function(a){a.setSelection(Bc(a.firstLine(),0),Bc(a.lastLine()))},killLine:function(a){var b=a.getCursor(!0),c=a.getCursor(!1),d=!Cc(b,c);d||a.getLine(b.line).length!=b.ch?a.replaceRange("",b,d?c:Bc(b.line),"+delete"):a.replaceRange("",b,Bc(b.line+1,0),"+delete")},deleteLine:function(a){var b=a.getCursor().line;a.replaceRange("",Bc(b,0),Bc(b),"+delete")},delLineLeft:function(a){var b=a.getCursor();a.replaceRange("",Bc(b.line,0),b,"+delete")},undo:function(a){a.undo()},redo:function(a){a.redo()},goDocStart:function(a){a.extendSelection(Bc(a.firstLine(),0))},goDocEnd:function(a){a.extendSelection(Bc(a.lastLine()))},goLineStart:function(a){a.extendSelection(Ff(a,a.getCursor().line))},goLineStartSmart:function(a){var b=a.getCursor(),c=Ff(a,b.line),d=a.getLineHandle(c.line),e=se(d);if(e&&0!=e[0].level)a.extendSelection(c);else{var f=Math.max(0,d.text.search(/\S/)),g=b.line==c.line&&b.ch<=f&&b.ch;a.extendSelection(Bc(c.line,g?0:f))}},goLineEnd:function(a){a.extendSelection(Gf(a,a.getCursor().line))},goLineRight:function(a){var b=a.charCoords(a.getCursor(),"div").top+5;a.extendSelection(a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:b},"div"))},goLineLeft:function(a){var b=a.charCoords(a.getCursor(),"div").top+5;a.extendSelection(a.coordsChar({left:0,top:b},"div"))},goLineUp:function(a){a.moveV(-1,"line")},goLineDown:function(a){a.moveV(1,"line")},goPageUp:function(a){a.moveV(-1,"page")},goPageDown:function(a){a.moveV(1,"page")},goCharLeft:function(a){a.moveH(-1,"char")},goCharRight:function(a){a.moveH(1,"char")},goColumnLeft:function(a){a.moveH(-1,"column")},goColumnRight:function(a){a.moveH(1,"column")},goWordLeft:function(a){a.moveH(-1,"word")},goGroupRight:function(a){a.moveH(1,"group")},goGroupLeft:function(a){a.moveH(-1,"group")},goWordRight:function(a){a.moveH(1,"word")},delCharBefore:function(a){a.deleteH(-1,"char")},delCharAfter:function(a){a.deleteH(1,"char")},delWordBefore:function(a){a.deleteH(-1,"word")},delWordAfter:function(a){a.deleteH(1,"word")},delGroupBefore:function(a){a.deleteH(-1,"group")},delGroupAfter:function(a){a.deleteH(1,"group")},indentAuto:function(a){a.indentSelection("smart")},indentMore:function(a){a.indentSelection("add")},indentLess:function(a){a.indentSelection("subtract")},insertTab:function(a){a.replaceSelection("	","end","+input")},defaultTab:function(a){a.somethingSelected()?a.indentSelection("add"):a.replaceSelection("	","end","+input")},transposeChars:function(a){var b=a.getCursor(),c=a.getLine(b.line);b.ch>0&&b.ch<c.length-1&&a.replaceRange(c.charAt(b.ch)+c.charAt(b.ch-1),Bc(b.line,b.ch-1),Bc(b.line,b.ch+1))},newlineAndIndent:function(a){Fb(a,function(){a.replaceSelection("\n","end","+input"),a.indentLine(a.getCursor().line,null,!0)})()},toggleOverwrite:function(a){a.toggleOverwrite()}},kd=x.keyMap={};kd.basic={Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",Enter:"newlineAndIndent",Insert:"toggleOverwrite"},kd.pcDefault={"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Alt-Up":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Down":"goDocEnd","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore",fallthrough:"basic"},kd.macDefault={"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight","Cmd-Left":"goLineStart","Cmd-Right":"goLineEnd","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delLineLeft",fallthrough:["basic","emacsy"]},kd["default"]=q?kd.macDefault:kd.pcDefault,kd.emacsy={"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Alt-F":"goWordRight","Alt-B":"goWordLeft","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars"},x.lookupKey=md,x.isModifierKey=nd,x.keyName=od,x.fromTextArea=function(a,b){function e(){a.value=i.getValue()}if(b||(b={}),b.value=a.value,!b.tabindex&&a.tabindex&&(b.tabindex=a.tabindex),!b.placeholder&&a.placeholder&&(b.placeholder=a.placeholder),null==b.autofocus){var c=document.body;try{c=document.activeElement}catch(d){}b.autofocus=c==a||null!=a.getAttribute("autofocus")&&c==document.body}if(a.form&&(Le(a.form,"submit",e),!b.leaveSubmitMethodAlone)){var f=a.form,g=f.submit;try{var h=f.submit=function(){e(),f.submit=g,f.submit(),f.submit=h}}catch(d){}}a.style.display="none";var i=x(function(b){a.parentNode.insertBefore(b,a.nextSibling)},b);return i.save=e,i.getTextArea=function(){return a},i.toTextArea=function(){e(),a.parentNode.removeChild(i.getWrapperElement()),a.style.display="",a.form&&(Me(a.form,"submit",e),"function"==typeof a.form.submit&&(a.form.submit=g))},i},pd.prototype={eol:function(){return this.pos>=this.string.length},sol:function(){return 0==this.pos},peek:function(){return this.string.charAt(this.pos)||void 0},next:function(){return this.pos<this.string.length?this.string.charAt(this.pos++):void 0},eat:function(a){var b=this.string.charAt(this.pos);if("string"==typeof a)var c=b==a;else var c=b&&(a.test?a.test(b):a(b));return c?(++this.pos,b):void 0},eatWhile:function(a){for(var b=this.pos;this.eat(a););return this.pos>b},eatSpace:function(){for(var a=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>a},skipToEnd:function(){this.pos=this.string.length},skipTo:function(a){var b=this.string.indexOf(a,this.pos);return b>-1?(this.pos=b,!0):void 0},backUp:function(a){this.pos-=a},column:function(){return this.lastColumnPos<this.start&&(this.lastColumnValue=Ye(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start),this.lastColumnValue},indentation:function(){return Ye(this.string,null,this.tabSize)},match:function(a,b,c){if("string"!=typeof a){var f=this.string.slice(this.pos).match(a);return f&&f.index>0?null:(f&&b!==!1&&(this.pos+=f[0].length),f)}var d=function(a){return c?a.toLowerCase():a},e=this.string.substr(this.pos,a.length);return d(e)==d(a)?(b!==!1&&(this.pos+=a.length),!0):void 0},current:function(){return this.string.slice(this.start,this.pos)}},x.StringStream=pd,x.TextMarker=qd,Ue(qd),qd.prototype.clear=function(){if(!this.explicitlyCleared){var a=this.doc.cm,b=a&&!a.curOp;if(b&&Db(a),Te(this,"clear")){var c=this.find();c&&Qe(this,"clear",c.from,c.to)}for(var d=null,e=null,f=0;f<this.lines.length;++f){var g=this.lines[f],h=ud(g.markedSpans,this);null!=h.to&&(e=pe(g)),g.markedSpans=vd(g.markedSpans,h),null!=h.from?d=pe(g):this.collapsed&&!Gd(this.doc,g)&&a&&oe(g,Ab(a.display))}if(a&&this.collapsed&&!a.options.lineWrapping)for(var f=0;f<this.lines.length;++f){var i=Fd(a.doc,this.lines[f]),j=H(a.doc,i);j>a.display.maxLineLength&&(a.display.maxLine=i,a.display.maxLineLength=j,a.display.maxLineChanged=!0)}null!=d&&a&&Ib(a,d,e+1),this.lines.length=0,this.explicitlyCleared=!0,this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,a&&Mc(a)),b&&Eb(a)}},qd.prototype.find=function(){for(var a,b,c=0;c<this.lines.length;++c){var d=this.lines[c],e=ud(d.markedSpans,this);if(null!=e.from||null!=e.to){var f=pe(d);null!=e.from&&(a=Bc(f,e.from)),null!=e.to&&(b=Bc(f,e.to))}}return"bookmark"==this.type?a:a&&{from:a,to:b}},qd.prototype.changed=function(){var a=this.find(),b=this.doc.cm;if(a&&b){"bookmark"!=this.type&&(a=a.from);var c=le(this.doc,a.line);if(kb(b,c),a.line>=b.display.showingFrom&&a.line<b.display.showingTo){for(var d=b.display.lineDiv.firstChild;d;d=d.nextSibling)if(d.lineObj==c){d.offsetHeight!=c.height&&oe(c,d.offsetHeight);
break}Hb(b,function(){b.curOp.selectionChanged=b.curOp.forceUpdate=b.curOp.updateMaxLine=!0})}}},qd.prototype.attachLine=function(a){if(!this.lines.length&&this.doc.cm){var b=this.doc.cm.curOp;b.maybeHiddenMarkers&&-1!=bf(b.maybeHiddenMarkers,this)||(b.maybeUnhiddenMarkers||(b.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(a)},qd.prototype.detachLine=function(a){if(this.lines.splice(bf(this.lines,a),1),!this.lines.length&&this.doc.cm){var b=this.doc.cm.curOp;(b.maybeHiddenMarkers||(b.maybeHiddenMarkers=[])).push(this)}},x.SharedTextMarker=sd,Ue(sd),sd.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=!0;for(var a=0;a<this.markers.length;++a)this.markers[a].clear();Qe(this,"clear")}},sd.prototype.find=function(){return this.primary.find()};var Kd=x.LineWidget=function(a,b,c){if(c)for(var d in c)c.hasOwnProperty(d)&&(this[d]=c[d]);this.cm=a,this.node=b};Ue(Kd),Kd.prototype.clear=Ld(function(){var a=this.line.widgets,b=pe(this.line);if(null!=b&&a){for(var c=0;c<a.length;++c)a[c]==this&&a.splice(c--,1);a.length||(this.line.widgets=null);var d=re(this.cm,this.line)<this.cm.doc.scrollTop;oe(this.line,Math.max(0,this.line.height-Md(this))),d&&Tc(this.cm,0,-this.height),Ib(this.cm,b,b+1)}}),Kd.prototype.changed=Ld(function(){var a=this.height;this.height=null;var b=Md(this)-a;if(b){oe(this.line,this.line.height+b);var c=pe(this.line);Ib(this.cm,c,c+1)}});var Od=x.Line=function(a,b,c){this.text=a,Jd(this,b),this.height=c?c(this):1};Ue(Od),Od.prototype.lineNo=function(){return pe(this)};var Vd={};de.prototype={chunkSize:function(){return this.lines.length},removeInner:function(a,b){for(var c=a,d=a+b;d>c;++c){var e=this.lines[c];this.height-=e.height,Qd(e),Qe(e,"delete")}this.lines.splice(a,b)},collapse:function(a){a.splice.apply(a,[a.length,0].concat(this.lines))},insertInner:function(a,b,c){this.height+=c,this.lines=this.lines.slice(0,a).concat(b).concat(this.lines.slice(a));for(var d=0,e=b.length;e>d;++d)b[d].parent=this},iterN:function(a,b,c){for(var d=a+b;d>a;++a)if(c(this.lines[a]))return!0}},ee.prototype={chunkSize:function(){return this.size},removeInner:function(a,b){this.size-=b;for(var c=0;c<this.children.length;++c){var d=this.children[c],e=d.chunkSize();if(e>a){var f=Math.min(b,e-a),g=d.height;if(d.removeInner(a,f),this.height-=g-d.height,e==f&&(this.children.splice(c--,1),d.parent=null),0==(b-=f))break;a=0}else a-=e}if(this.size-b<25){var h=[];this.collapse(h),this.children=[new de(h)],this.children[0].parent=this}},collapse:function(a){for(var b=0,c=this.children.length;c>b;++b)this.children[b].collapse(a)},insertInner:function(a,b,c){this.size+=b.length,this.height+=c;for(var d=0,e=this.children.length;e>d;++d){var f=this.children[d],g=f.chunkSize();if(g>=a){if(f.insertInner(a,b,c),f.lines&&f.lines.length>50){for(;f.lines.length>50;){var h=f.lines.splice(f.lines.length-25,25),i=new de(h);f.height-=i.height,this.children.splice(d+1,0,i),i.parent=this}this.maybeSpill()}break}a-=g}},maybeSpill:function(){if(!(this.children.length<=10)){var a=this;do{var b=a.children.splice(a.children.length-5,5),c=new ee(b);if(a.parent){a.size-=c.size,a.height-=c.height;var e=bf(a.parent.children,a);a.parent.children.splice(e+1,0,c)}else{var d=new ee(a.children);d.parent=a,a.children=[d,c],a=d}c.parent=a.parent}while(a.children.length>10);a.parent.maybeSpill()}},iterN:function(a,b,c){for(var d=0,e=this.children.length;e>d;++d){var f=this.children[d],g=f.chunkSize();if(g>a){var h=Math.min(b,g-a);if(f.iterN(a,h,c))return!0;if(0==(b-=h))break;a=0}else a-=g}}};var fe=0,ge=x.Doc=function(a,b,c){if(!(this instanceof ge))return new ge(a,b,c);null==c&&(c=0),ee.call(this,[new de([new Od("",null)])]),this.first=c,this.scrollTop=this.scrollLeft=0,this.cantEdit=!1,this.history=te(),this.cleanGeneration=1,this.frontier=c;var d=Bc(c,0);this.sel={from:d,to:d,head:d,anchor:d,shift:!1,extend:!1,goalColumn:null},this.id=++fe,this.modeOption=b,"string"==typeof a&&(a=wf(a)),ce(this,{from:d,to:d,text:a},null,{head:d,anchor:d})};ge.prototype=cf(ee.prototype,{constructor:ge,iter:function(a,b,c){c?this.iterN(a-this.first,b-a,c):this.iterN(this.first,this.first+this.size,a)},insert:function(a,b){for(var c=0,d=0,e=b.length;e>d;++d)c+=b[d].height;this.insertInner(a-this.first,b,c)},remove:function(a,b){this.removeInner(a-this.first,b)},getValue:function(a){var b=ne(this,this.first,this.first+this.size);return a===!1?b:b.join(a||"\n")},setValue:function(a){var b=Bc(this.first,0),c=this.first+this.size-1;uc(this,{from:b,to:Bc(c,le(this,c).text.length),text:wf(a),origin:"setValue"},{head:b,anchor:b},!0)},replaceRange:function(a,b,c,d){b=Gc(this,b),c=c?Gc(this,c):b,Ac(this,a,b,c,d)},getRange:function(a,b,c){var d=me(this,Gc(this,a),Gc(this,b));return c===!1?d:d.join(c||"\n")},getLine:function(a){var b=this.getLineHandle(a);return b&&b.text},setLine:function(a,b){Ic(this,a)&&Ac(this,b,Bc(a,0),Gc(this,Bc(a)))},removeLine:function(a){a?Ac(this,"",Gc(this,Bc(a-1)),Gc(this,Bc(a))):Ac(this,"",Bc(0,0),Gc(this,Bc(1,0)))},getLineHandle:function(a){return Ic(this,a)?le(this,a):void 0},getLineNumber:function(a){return pe(a)},getLineHandleVisualStart:function(a){return"number"==typeof a&&(a=le(this,a)),Fd(this,a)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+this.size-1},clipPos:function(a){return Gc(this,a)},getCursor:function(a){var c,b=this.sel;return c=null==a||"head"==a?b.head:"anchor"==a?b.anchor:"end"==a||a===!1?b.to:b.from,Ec(c)},somethingSelected:function(){return!Cc(this.sel.head,this.sel.anchor)},setCursor:Gb(function(a,b,c){var d=Gc(this,"number"==typeof a?Bc(a,b||0):a);c?Jc(this,d):Lc(this,d,d)}),setSelection:Gb(function(a,b,c){Lc(this,Gc(this,a),Gc(this,b||a),c)}),extendSelection:Gb(function(a,b,c){Jc(this,Gc(this,a),b&&Gc(this,b),c)}),getSelection:function(a){return this.getRange(this.sel.from,this.sel.to,a)},replaceSelection:function(a,b,c){uc(this,{from:this.sel.from,to:this.sel.to,text:wf(a),origin:c},b||"around")},undo:Gb(function(){wc(this,"undo")}),redo:Gb(function(){wc(this,"redo")}),setExtending:function(a){this.sel.extend=a},historySize:function(){var a=this.history;return{undo:a.done.length,redo:a.undone.length}},clearHistory:function(){this.history=te(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=this.changeGeneration()},changeGeneration:function(){return this.history.lastOp=this.history.lastOrigin=null,this.history.generation},isClean:function(a){return this.history.generation==(a||this.cleanGeneration)},getHistory:function(){return{done:ze(this.history.done),undone:ze(this.history.undone)}},setHistory:function(a){var b=this.history=te(this.history.maxGeneration);b.done=a.done.slice(0),b.undone=a.undone.slice(0)},markText:function(a,b,c){return rd(this,Gc(this,a),Gc(this,b),c,"range")},setBookmark:function(a,b){var c={replacedWith:b&&(null==b.nodeType?b.widget:b),insertLeft:b&&b.insertLeft};return a=Gc(this,a),rd(this,a,a,c,"bookmark")},findMarksAt:function(a){a=Gc(this,a);var b=[],c=le(this,a.line).markedSpans;if(c)for(var d=0;d<c.length;++d){var e=c[d];(null==e.from||e.from<=a.ch)&&(null==e.to||e.to>=a.ch)&&b.push(e.marker.parent||e.marker)}return b},getAllMarks:function(){var a=[];return this.iter(function(b){var c=b.markedSpans;if(c)for(var d=0;d<c.length;++d)null!=c[d].from&&a.push(c[d].marker)}),a},posFromIndex:function(a){var b,c=this.first;return this.iter(function(d){var e=d.text.length+1;return e>a?(b=a,!0):(a-=e,++c,void 0)}),Gc(this,Bc(c,b))},indexFromPos:function(a){a=Gc(this,a);var b=a.ch;return a.line<this.first||a.ch<0?0:(this.iter(this.first,a.line,function(a){b+=a.text.length+1}),b)},copy:function(a){var b=new ge(ne(this,this.first,this.first+this.size),this.modeOption,this.first);return b.scrollTop=this.scrollTop,b.scrollLeft=this.scrollLeft,b.sel={from:this.sel.from,to:this.sel.to,head:this.sel.head,anchor:this.sel.anchor,shift:this.sel.shift,extend:!1,goalColumn:this.sel.goalColumn},a&&(b.history.undoDepth=this.history.undoDepth,b.setHistory(this.getHistory())),b},linkedDoc:function(a){a||(a={});var b=this.first,c=this.first+this.size;null!=a.from&&a.from>b&&(b=a.from),null!=a.to&&a.to<c&&(c=a.to);var d=new ge(ne(this,b,c),a.mode||this.modeOption,b);return a.sharedHist&&(d.history=this.history),(this.linked||(this.linked=[])).push({doc:d,sharedHist:a.sharedHist}),d.linked=[{doc:this,isParent:!0,sharedHist:a.sharedHist}],d},unlinkDoc:function(a){if(a instanceof x&&(a=a.doc),this.linked)for(var b=0;b<this.linked.length;++b){var c=this.linked[b];if(c.doc==a){this.linked.splice(b,1),a.unlinkDoc(this);break}}if(a.history==this.history){var d=[a.id];je(a,function(a){d.push(a.id)},!0),a.history=te(),a.history.done=ze(this.history.done,d),a.history.undone=ze(this.history.undone,d)}},iterLinkedDocs:function(a){je(this,a)},getMode:function(){return this.mode},getEditor:function(){return this.cm}}),ge.prototype.eachLine=ge.prototype.iter;var he="iter insert remove copy getEditor".split(" ");for(var ie in ge.prototype)ge.prototype.hasOwnProperty(ie)&&bf(he,ie)<0&&(x.prototype[ie]=function(a){return function(){return a.apply(this.doc,arguments)}}(ge.prototype[ie]));Ue(ge),x.e_stop=Ie,x.e_preventDefault=Fe,x.e_stopPropagation=Ge;var Oe,Pe=0;x.on=Le,x.off=Me,x.signal=Ne;var Ve=30,We=x.Pass={toString:function(){return"CodeMirror.Pass"}};Xe.prototype={set:function(a,b){clearTimeout(this.id),this.id=setTimeout(b,a)}},x.countColumn=Ye;var Ze=[""],gf=/[\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,kf=/[\u0300-\u036F\u0483-\u0487\u0488-\u0489\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\uA66F\u1DC0\u2013\u1DFF\u20D0\u2013\u20FF\uA670-\uA672\uA674-\uA67D\uA69F\udc00-\udfff\uFE20\u2013\uFE2F]/;x.replaceGetRect=function(a){pf=a};var qf=function(){if(d)return!1;var a=lf("div");return"draggable"in a||"dragDrop"in a}();a?rf=function(a,b){return 36==a.charCodeAt(b-1)&&39==a.charCodeAt(b)}:j&&!/Version\/([6-9]|\d\d)\b/.test(navigator.userAgent)?rf=function(a,b){return/\-[^ \-?]|\?[^ !\'\"\),.\-\/:;\?\]\}]/.test(a.slice(b-1,b+1))}:f&&/Chrome\/(?:29|[3-9]\d|\d\d\d)\./.test(navigator.userAgent)?rf=function(a,b){var c=a.charCodeAt(b-1);return c>=8208&&8212>=c}:f&&(rf=function(a,b){if(b>1&&45==a.charCodeAt(b-1)){if(/\w/.test(a.charAt(b-2))&&/[^\-?\.]/.test(a.charAt(b)))return!0;if(b>2&&/[\d\.,]/.test(a.charAt(b-2))&&/[\d\.,]/.test(a.charAt(b)))return!1}return/[~!#%&*)=+}\]\\|\"\.>,:;][({[<]|-[^\-?\.\u2010-\u201f\u2026]|\?[\w~`@#$%\^&*(_=+{[|><]|\u2026[\w~`@#$%\^&*(_=+{[><]/.test(a.slice(b-1,b+1))});var sf,uf,wf=3!="\n\nb".split(/\n/).length?function(a){for(var b=0,c=[],d=a.length;d>=b;){var e=a.indexOf("\n",b);-1==e&&(e=a.length);var f=a.slice(b,"\r"==a.charAt(e-1)?e-1:e),g=f.indexOf("\r");-1!=g?(c.push(f.slice(0,g)),b+=g+1):(c.push(f),b=e+1)}return c}:function(a){return a.split(/\r\n?|\n/)};x.splitLines=wf;var xf=window.getSelection?function(a){try{return a.selectionStart!=a.selectionEnd}catch(b){return!1}}:function(a){try{var b=a.ownerDocument.selection.createRange()}catch(c){}return b&&b.parentElement()==a?0!=b.compareEndPoints("StartToEnd",b):!1},yf=function(){var a=lf("div");return"oncopy"in a?!0:(a.setAttribute("oncopy","return;"),"function"==typeof a.oncopy)}(),zf={3:"Enter",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",91:"Mod",92:"Mod",93:"Mod",109:"-",107:"=",127:"Delete",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",63276:"PageUp",63277:"PageDown",63275:"End",63273:"Home",63234:"Left",63232:"Up",63235:"Right",63233:"Down",63302:"Insert",63272:"Delete"};x.keyNames=zf,function(){for(var a=0;10>a;a++)zf[a+48]=String(a);for(var a=65;90>=a;a++)zf[a]=String.fromCharCode(a);for(var a=1;12>=a;a++)zf[a+111]=zf[a+63235]="F"+a}();var If,Nf=function(){function c(c){return 255>=c?a.charAt(c):c>=1424&&1524>=c?"R":c>=1536&&1791>=c?b.charAt(c-1536):c>=1792&&2220>=c?"r":"L"}var a="bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLL",b="rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmmrrrrrrrrrrrrrrrrrr",d=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,e=/[stwN]/,f=/[LRr]/,g=/[Lb1n]/,h=/[1n]/,i="L";return function(a){if(!d.test(a))return!1;for(var l,b=a.length,j=[],k=0;b>k;++k)j.push(l=c(a.charCodeAt(k)));for(var k=0,m=i;b>k;++k){var l=j[k];"m"==l?j[k]=m:m=l}for(var k=0,n=i;b>k;++k){var l=j[k];"1"==l&&"r"==n?j[k]="n":f.test(l)&&(n=l,"r"==l&&(j[k]="R"))}for(var k=1,m=j[0];b-1>k;++k){var l=j[k];"+"==l&&"1"==m&&"1"==j[k+1]?j[k]="1":","!=l||m!=j[k+1]||"1"!=m&&"n"!=m||(j[k]=m),m=l}for(var k=0;b>k;++k){var l=j[k];if(","==l)j[k]="N";else if("%"==l){for(var o=k+1;b>o&&"%"==j[o];++o);for(var p=k&&"!"==j[k-1]||b-1>o&&"1"==j[o]?"1":"N",q=k;o>q;++q)j[q]=p;k=o-1}}for(var k=0,n=i;b>k;++k){var l=j[k];"L"==n&&"1"==l?j[k]="L":f.test(l)&&(n=l)}for(var k=0;b>k;++k)if(e.test(j[k])){for(var o=k+1;b>o&&e.test(j[o]);++o);for(var r="L"==(k?j[k-1]:i),s="L"==(b-1>o?j[o]:i),p=r||s?"L":"R",q=k;o>q;++q)j[q]=p;k=o-1}for(var u,t=[],k=0;b>k;)if(g.test(j[k])){var v=k;for(++k;b>k&&g.test(j[k]);++k);t.push({from:v,to:k,level:0})}else{var w=k,x=t.length;for(++k;b>k&&"L"!=j[k];++k);for(var q=w;k>q;)if(h.test(j[q])){q>w&&t.splice(x,0,{from:w,to:q,level:1});var y=q;for(++q;k>q&&h.test(j[q]);++q);t.splice(x,0,{from:y,to:q,level:2}),w=q}else++q;k>w&&t.splice(x,0,{from:w,to:k,level:1})}return 1==t[0].level&&(u=a.match(/^\s+/))&&(t[0].from=u[0].length,t.unshift({from:0,to:u[0].length,level:0})),1==_e(t).level&&(u=a.match(/\s+$/))&&(_e(t).to-=u[0].length,t.push({from:b-u[0].length,to:b,level:0})),t[0].level!=_e(t).level&&t.push({from:b,to:b,level:t[0].level}),t}}();return x.version="3.20.0",x}(),CodeMirror.defineMode("css",function(a,b){"use strict";function l(a,b){return k=b,a}function m(a,b){var c=a.next();if(d[c]){var e=d[c](a,b);if(e!==!1)return e}if("@"==c)return a.eatWhile(/[\w\\\-]/),l("def",a.current());if("="==c)l(null,"compare");else{if(("~"==c||"|"==c)&&a.eat("="))return l(null,"compare");if('"'==c||"'"==c)return b.tokenize=n(c),b.tokenize(a,b);if("#"==c)return a.eatWhile(/[\w\\\-]/),l("atom","hash");if("!"==c)return a.match(/^\s*\w*/),l("keyword","important");if(/\d/.test(c)||"."==c&&a.eat(/\d/))return a.eatWhile(/[\w.%]/),l("number","unit");if("-"!==c)return/[,+>*\/]/.test(c)?l(null,"select-op"):"."==c&&a.match(/^-?[_a-z][_a-z0-9-]*/i)?l("qualifier","qualifier"):":"==c?l("operator",c):/[;{}\[\]\(\)]/.test(c)?l(null,c):"u"==c&&a.match("rl(")?(a.backUp(1),b.tokenize=o,l("property","variable")):(a.eatWhile(/[\w\\\-]/),l("property","variable"));if(/\d/.test(a.peek()))return a.eatWhile(/[\w.%]/),l("number","unit");if(a.match(/^[^-]+-/))return l("meta","meta")}}function n(a,b){return function(c,d){for(var f,e=!1;null!=(f=c.next())&&(f!=a||e);)e=!e&&"\\"==f;return e||(b&&c.backUp(1),d.tokenize=m),l("string","string")}}function o(a,b){return a.next(),b.tokenize=a.match(/\s*[\"\']/,!1)?m:n(")",!0),l(null,"(")}b.propertyKeywords||(b=CodeMirror.resolveMode("text/css"));var c=a.indentUnit||a.tabSize||2,d=b.hooks||{},e=b.atMediaTypes||{},f=b.atMediaFeatures||{},g=b.propertyKeywords||{},h=b.colorKeywords||{},i=b.valueKeywords||{},j=!!b.allowNested,k=null;return{startState:function(a){return{tokenize:m,baseIndent:a||0,stack:[],lastToken:null}},token:function(a,b){if(b.tokenize=b.tokenize||m,b.tokenize==m&&a.eatSpace())return null;var c=b.tokenize(a,b);c&&"string"!=typeof c&&(c=l(c[0],c[1]));var d=b.stack[b.stack.length-1];if("variable"==c)return"variable-definition"==k&&b.stack.push("propertyValue"),b.lastToken="variable-2";if("property"==c){var n=a.current().toLowerCase();"propertyValue"==d?c=i.hasOwnProperty(n)?"string-2":h.hasOwnProperty(n)?"keyword":"variable-2":"rule"==d?g.hasOwnProperty(n)||(c+=" error"):"block"==d?c=g.hasOwnProperty(n)?"property":h.hasOwnProperty(n)?"keyword":i.hasOwnProperty(n)?"string-2":"tag":d&&"@media{"!=d?"@media"==d?c=e[a.current()]?"attribute":/^(only|not)$/.test(n)?"keyword":"and"==n?"error":f.hasOwnProperty(n)?"error":"attribute error":"@mediaType"==d?c=e.hasOwnProperty(n)?"attribute":"and"==n?"operator":/^(only|not)$/.test(n)?"error":"error":"@mediaType("==d?g.hasOwnProperty(n)||(e.hasOwnProperty(n)?c="error":"and"==n?c="operator":/^(only|not)$/.test(n)?c="error":c+=" error"):c="@import"==d?"tag":"error":c="tag"}else"atom"==c?d&&"@media{"!=d&&"block"!=d?"propertyValue"==d?/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(a.current())||(c+=" error"):c="error":c="builtin":"@media"==d&&"{"==k&&(c="error");if("{"==k)if("@media"==d||"@mediaType"==d)b.stack[b.stack.length-1]="@media{";else{var o=j?"block":"rule";b.stack.push(o)}else if("}"==k)for("interpolation"==d&&(c="operator");b.stack.length;){var p=b.stack.pop();if(p.indexOf("{")>-1||"block"==p||"rule"==p)break}else if("interpolation"==k)b.stack.push("interpolation");else if("@media"==k)b.stack.push("@media");else if("@import"==k)b.stack.push("@import");else if("@media"==d&&/\b(keyword|attribute)\b/.test(c))b.stack[b.stack.length-1]="@mediaType";else if("@mediaType"==d&&","==a.current())b.stack[b.stack.length-1]="@media";else if("("==k)"@media"==d||"@mediaType"==d?(b.stack[b.stack.length-1]="@mediaType",b.stack.push("@mediaType(")):b.stack.push("(");else if(")"==k)for(;b.stack.length;){var p=b.stack.pop();if(p.indexOf("(")>-1)break}else":"==k&&"property"==b.lastToken?b.stack.push("propertyValue"):"propertyValue"==d&&";"==k?b.stack.pop():"@import"==d&&";"==k&&b.stack.pop();return b.lastToken=c},indent:function(a,b){var d=a.stack.length;return/^\}/.test(b)&&(d-="propertyValue"==a.stack[d-1]?2:1),a.baseIndent+d*c},electricChars:"}",blockCommentStart:"/*",blockCommentEnd:"*/",fold:"brace"}}),function(){function a(a){for(var b={},c=0;c<a.length;++c)b[a[c]]=!0;return b}function g(a,b){for(var d,c=!1;null!=(d=a.next());){if(c&&"/"==d){b.tokenize=null;break}c="*"==d}return["comment","comment"]}var b=a(["all","aural","braille","handheld","print","projection","screen","tty","tv","embossed"]),c=a(["width","min-width","max-width","height","min-height","max-height","device-width","min-device-width","max-device-width","device-height","min-device-height","max-device-height","aspect-ratio","min-aspect-ratio","max-aspect-ratio","device-aspect-ratio","min-device-aspect-ratio","max-device-aspect-ratio","color","min-color","max-color","color-index","min-color-index","max-color-index","monochrome","min-monochrome","max-monochrome","resolution","min-resolution","max-resolution","scan","grid"]),d=a(["align-content","align-items","align-self","alignment-adjust","alignment-baseline","anchor-point","animation","animation-delay","animation-direction","animation-duration","animation-iteration-count","animation-name","animation-play-state","animation-timing-function","appearance","azimuth","backface-visibility","background","background-attachment","background-clip","background-color","background-image","background-origin","background-position","background-repeat","background-size","baseline-shift","binding","bleed","bookmark-label","bookmark-level","bookmark-state","bookmark-target","border","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","clear","clip","color","color-profile","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","content","counter-increment","counter-reset","crop","cue","cue-after","cue-before","cursor","direction","display","dominant-baseline","drop-initial-after-adjust","drop-initial-after-align","drop-initial-before-adjust","drop-initial-before-align","drop-initial-size","drop-initial-value","elevation","empty-cells","fit","fit-position","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","float-offset","flow-from","flow-into","font","font-feature-settings","font-family","font-kerning","font-language-override","font-size","font-size-adjust","font-stretch","font-style","font-synthesis","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-variant-position","font-weight","grid-cell","grid-column","grid-column-align","grid-column-sizing","grid-column-span","grid-columns","grid-flow","grid-row","grid-row-align","grid-row-sizing","grid-row-span","grid-rows","grid-template","hanging-punctuation","height","hyphens","icon","image-orientation","image-rendering","image-resolution","inline-box-align","justify-content","left","letter-spacing","line-break","line-height","line-stacking","line-stacking-ruby","line-stacking-shift","line-stacking-strategy","list-style","list-style-image","list-style-position","list-style-type","margin","margin-bottom","margin-left","margin-right","margin-top","marker-offset","marks","marquee-direction","marquee-loop","marquee-play-count","marquee-speed","marquee-style","max-height","max-width","min-height","min-width","move-to","nav-down","nav-index","nav-left","nav-right","nav-up","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-style","overflow-wrap","overflow-x","overflow-y","padding","padding-bottom","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","page-policy","pause","pause-after","pause-before","perspective","perspective-origin","pitch","pitch-range","play-during","position","presentation-level","punctuation-trim","quotes","region-break-after","region-break-before","region-break-inside","region-fragment","rendering-intent","resize","rest","rest-after","rest-before","richness","right","rotation","rotation-point","ruby-align","ruby-overhang","ruby-position","ruby-span","shape-inside","shape-outside","size","speak","speak-as","speak-header","speak-numeral","speak-punctuation","speech-rate","stress","string-set","tab-size","table-layout","target","target-name","target-new","target-position","text-align","text-align-last","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-style","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-height","text-indent","text-justify","text-outline","text-overflow","text-shadow","text-size-adjust","text-space-collapse","text-transform","text-underline-position","text-wrap","top","transform","transform-origin","transform-style","transition","transition-delay","transition-duration","transition-property","transition-timing-function","unicode-bidi","vertical-align","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","volume","white-space","widows","width","word-break","word-spacing","word-wrap","z-index","zoom","clip-path","clip-rule","mask","enable-background","filter","flood-color","flood-opacity","lighting-color","stop-color","stop-opacity","pointer-events","color-interpolation","color-interpolation-filters","color-profile","color-rendering","fill","fill-opacity","fill-rule","image-rendering","marker","marker-end","marker-mid","marker-start","shape-rendering","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","text-rendering","baseline-shift","dominant-baseline","glyph-orientation-horizontal","glyph-orientation-vertical","kerning","text-anchor","writing-mode"]),e=a(["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","grey","green","greenyellow","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"]),f=a(["above","absolute","activeborder","activecaption","afar","after-white-space","ahead","alias","all","all-scroll","alternate","always","amharic","amharic-abegede","antialiased","appworkspace","arabic-indic","armenian","asterisks","auto","avoid","avoid-column","avoid-page","avoid-region","background","backwards","baseline","below","bidi-override","binary","bengali","blink","block","block-axis","bold","bolder","border","border-box","both","bottom","break","break-all","break-word","button","button-bevel","buttonface","buttonhighlight","buttonshadow","buttontext","cambodian","capitalize","caps-lock-indicator","caption","captiontext","caret","cell","center","checkbox","circle","cjk-earthly-branch","cjk-heavenly-stem","cjk-ideographic","clear","clip","close-quote","col-resize","collapse","column","compact","condensed","contain","content","content-box","context-menu","continuous","copy","cover","crop","cross","crosshair","currentcolor","cursive","dashed","decimal","decimal-leading-zero","default","default-button","destination-atop","destination-in","destination-out","destination-over","devanagari","disc","discard","document","dot-dash","dot-dot-dash","dotted","double","down","e-resize","ease","ease-in","ease-in-out","ease-out","element","ellipse","ellipsis","embed","end","ethiopic","ethiopic-abegede","ethiopic-abegede-am-et","ethiopic-abegede-gez","ethiopic-abegede-ti-er","ethiopic-abegede-ti-et","ethiopic-halehame-aa-er","ethiopic-halehame-aa-et","ethiopic-halehame-am-et","ethiopic-halehame-gez","ethiopic-halehame-om-et","ethiopic-halehame-sid-et","ethiopic-halehame-so-et","ethiopic-halehame-ti-er","ethiopic-halehame-ti-et","ethiopic-halehame-tig","ew-resize","expanded","extra-condensed","extra-expanded","fantasy","fast","fill","fixed","flat","footnotes","forwards","from","geometricPrecision","georgian","graytext","groove","gujarati","gurmukhi","hand","hangul","hangul-consonant","hebrew","help","hidden","hide","higher","highlight","highlighttext","hiragana","hiragana-iroha","horizontal","hsl","hsla","icon","ignore","inactiveborder","inactivecaption","inactivecaptiontext","infinite","infobackground","infotext","inherit","initial","inline","inline-axis","inline-block","inline-table","inset","inside","intrinsic","invert","italic","justify","kannada","katakana","katakana-iroha","keep-all","khmer","landscape","lao","large","larger","left","level","lighter","line-through","linear","lines","list-item","listbox","listitem","local","logical","loud","lower","lower-alpha","lower-armenian","lower-greek","lower-hexadecimal","lower-latin","lower-norwegian","lower-roman","lowercase","ltr","malayalam","match","media-controls-background","media-current-time-display","media-fullscreen-button","media-mute-button","media-play-button","media-return-to-realtime-button","media-rewind-button","media-seek-back-button","media-seek-forward-button","media-slider","media-sliderthumb","media-time-remaining-display","media-volume-slider","media-volume-slider-container","media-volume-sliderthumb","medium","menu","menulist","menulist-button","menulist-text","menulist-textfield","menutext","message-box","middle","min-intrinsic","mix","mongolian","monospace","move","multiple","myanmar","n-resize","narrower","ne-resize","nesw-resize","no-close-quote","no-drop","no-open-quote","no-repeat","none","normal","not-allowed","nowrap","ns-resize","nw-resize","nwse-resize","oblique","octal","open-quote","optimizeLegibility","optimizeSpeed","oriya","oromo","outset","outside","outside-shape","overlay","overline","padding","padding-box","painted","page","paused","persian","plus-darker","plus-lighter","pointer","polygon","portrait","pre","pre-line","pre-wrap","preserve-3d","progress","push-button","radio","read-only","read-write","read-write-plaintext-only","rectangle","region","relative","repeat","repeat-x","repeat-y","reset","reverse","rgb","rgba","ridge","right","round","row-resize","rtl","run-in","running","s-resize","sans-serif","scroll","scrollbar","se-resize","searchfield","searchfield-cancel-button","searchfield-decoration","searchfield-results-button","searchfield-results-decoration","semi-condensed","semi-expanded","separate","serif","show","sidama","single","skip-white-space","slide","slider-horizontal","slider-vertical","sliderthumb-horizontal","sliderthumb-vertical","slow","small","small-caps","small-caption","smaller","solid","somali","source-atop","source-in","source-out","source-over","space","square","square-button","start","static","status-bar","stretch","stroke","sub","subpixel-antialiased","super","sw-resize","table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row","table-row-group","telugu","text","text-bottom","text-top","textarea","textfield","thai","thick","thin","threeddarkshadow","threedface","threedhighlight","threedlightshadow","threedshadow","tibetan","tigre","tigrinya-er","tigrinya-er-abegede","tigrinya-et","tigrinya-et-abegede","to","top","transparent","ultra-condensed","ultra-expanded","underline","up","upper-alpha","upper-armenian","upper-greek","upper-hexadecimal","upper-latin","upper-norwegian","upper-roman","uppercase","urdu","url","vertical","vertical-text","visible","visibleFill","visiblePainted","visibleStroke","visual","w-resize","wait","wave","wider","window","windowframe","windowtext","x-large","x-small","xor","xx-large","xx-small"]);CodeMirror.defineMIME("text/css",{atMediaTypes:b,atMediaFeatures:c,propertyKeywords:d,colorKeywords:e,valueKeywords:f,hooks:{"<":function(a,b){function c(a,b){for(var d,c=0;null!=(d=a.next());){if(c>=2&&">"==d){b.tokenize=null;break}c="-"==d?c+1:0}return["comment","comment"]}return a.eat("!")?(b.tokenize=c,c(a,b)):void 0
},"/":function(a,b){return a.eat("*")?(b.tokenize=g,g(a,b)):!1}},name:"css"}),CodeMirror.defineMIME("text/x-scss",{atMediaTypes:b,atMediaFeatures:c,propertyKeywords:d,colorKeywords:e,valueKeywords:f,allowNested:!0,hooks:{":":function(a){return a.match(/\s*{/)?[null,"{"]:!1},$:function(a){return a.match(/^[\w-]+/),":"==a.peek()?["variable","variable-definition"]:["variable","variable"]},",":function(a,b){return"propertyValue"==b.stack[b.stack.length-1]&&a.match(/^ *\$/,!1)?["operator",";"]:void 0},"/":function(a,b){return a.eat("/")?(a.skipToEnd(),["comment","comment"]):a.eat("*")?(b.tokenize=g,g(a,b)):["operator","operator"]},"#":function(a){return a.eat("{")?["operator","interpolation"]:(a.eatWhile(/[\w\\\-]/),["atom","hash"])}},name:"css"})}(),CodeMirror.defineMode("htmlmixed",function(a,b){function i(a,b){var f=b.htmlState.tagName,g=c.token(a,b.htmlState);if("script"==f&&/\btag\b/.test(g)&&">"==a.current()){var h=a.string.slice(Math.max(0,a.pos-100),a.pos).match(/\btype\s*=\s*("[^"]+"|'[^']+'|\S+)[^<]*$/i);h=h?h[1]:"",h&&/[\"\']/.test(h.charAt(0))&&(h=h.slice(1,h.length-1));for(var i=0;i<e.length;++i){var j=e[i];if("string"==typeof j.matches?h==j.matches:j.matches.test(h)){j.mode&&(b.token=k,b.localMode=j.mode,b.localState=j.mode.startState&&j.mode.startState(c.indent(b.htmlState,"")));break}}}else"style"==f&&/\btag\b/.test(g)&&">"==a.current()&&(b.token=l,b.localMode=d,b.localState=d.startState(c.indent(b.htmlState,"")));return g}function j(a,b,c){var f,d=a.current(),e=d.search(b);return e>-1?a.backUp(d.length-e):(f=d.match(/<\/?$/))&&(a.backUp(d.length),a.match(b,!1)||a.match(d)),c}function k(a,b){return a.match(/^<\/\s*script\s*>/i,!1)?(b.token=i,b.localState=b.localMode=null,i(a,b)):j(a,/<\/\s*script\s*>/,b.localMode.token(a,b.localState))}function l(a,b){return a.match(/^<\/\s*style\s*>/i,!1)?(b.token=i,b.localState=b.localMode=null,i(a,b)):j(a,/<\/\s*style\s*>/,d.token(a,b.localState))}var c=CodeMirror.getMode(a,{name:"xml",htmlMode:!0}),d=CodeMirror.getMode(a,"css"),e=[],f=b&&b.scriptTypes;if(e.push({matches:/^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^$/i,mode:CodeMirror.getMode(a,"javascript")}),f)for(var g=0;g<f.length;++g){var h=f[g];e.push({matches:h.matches,mode:h.mode&&CodeMirror.getMode(a,h.mode)})}return e.push({matches:/./,mode:CodeMirror.getMode(a,"text/plain")}),{startState:function(){var a=c.startState();return{token:i,localMode:null,localState:null,htmlState:a}},copyState:function(a){if(a.localState)var b=CodeMirror.copyState(a.localMode,a.localState);return{token:a.token,localMode:a.localMode,localState:b,htmlState:CodeMirror.copyState(c,a.htmlState)}},token:function(a,b){return b.token(a,b)},indent:function(a,b){return!a.localMode||/^\s*<\//.test(b)?c.indent(a.htmlState,b):a.localMode.indent?a.localMode.indent(a.localState,b):CodeMirror.Pass},electricChars:"/{}:",innerMode:function(a){return{state:a.localState||a.htmlState,mode:a.localMode||c}}}},"xml","javascript","css"),CodeMirror.defineMIME("text/html","htmlmixed"),CodeMirror.defineMode("javascript",function(a,b){function i(a,b){for(var d,c=!1;null!=(d=a.next());){if(d==b&&!c)return!1;c=!c&&"\\"==d}return c}function l(a,b,c){return j=a,k=c,b}function m(a,b){var c=a.next();if('"'==c||"'"==c)return b.tokenize=n(c),b.tokenize(a,b);if("."==c&&a.match(/^\d+(?:[eE][+\-]?\d+)?/))return l("number","number");if("."==c&&a.match(".."))return l("spread","meta");if(/[\[\]{}\(\),;\:\.]/.test(c))return l(c);if("="==c&&a.eat(">"))return l("=>");if("0"==c&&a.eat(/x/i))return a.eatWhile(/[\da-f]/i),l("number","number");if(/\d/.test(c))return a.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/),l("number","number");if("/"==c)return a.eat("*")?(b.tokenize=o,o(a,b)):a.eat("/")?(a.skipToEnd(),l("comment","comment")):"operator"==b.lastType||"keyword c"==b.lastType||"sof"==b.lastType||/^[\[{}\(,;:]$/.test(b.lastType)?(i(a,"/"),a.eatWhile(/[gimy]/),l("regexp","string-2")):(a.eatWhile(h),l("operator",null,a.current()));if("`"==c)return b.tokenize=p,p(a,b);if("#"==c)return a.skipToEnd(),l("error","error");if(h.test(c))return a.eatWhile(h),l("operator",null,a.current());a.eatWhile(/[\w\$_]/);var d=a.current(),e=g.propertyIsEnumerable(d)&&g[d];return e&&"."!=b.lastType?l(e.type,e.style,d):l("variable","variable",d)}function n(a){return function(b,c){return i(b,a)||(c.tokenize=m),l("string","string")}}function o(a,b){for(var d,c=!1;d=a.next();){if("/"==d&&c){b.tokenize=m;break}c="*"==d}return l("comment","comment")}function p(a,b){for(var d,c=!1;null!=(d=a.next());){if(!c&&("`"==d||"$"==d&&a.eat("{"))){b.tokenize=m;break}c=!c&&"\\"==d}return l("quasi","string-2",a.current())}function r(a,b){b.fatArrowAt&&(b.fatArrowAt=null);var c=a.string.indexOf("=>",a.start);if(!(0>c)){for(var d=0,e=!1,f=c-1;f>=0;--f){var g=a.string.charAt(f),h=q.indexOf(g);if(h>=0&&3>h){if(!d){++f;break}if(0==--d)break}else if(h>=3&&6>h)++d;else if(/[$\w]/.test(g))e=!0;else if(e&&!d){++f;break}}e&&!d&&(b.fatArrowAt=f)}}function t(a,b,c,d,e,f){this.indented=a,this.column=b,this.type=c,this.prev=e,this.info=f,null!=d&&(this.align=d)}function u(a,b){for(var c=a.localVars;c;c=c.next)if(c.name==b)return!0;for(var d=a.context;d;d=d.prev)for(var c=d.vars;c;c=c.next)if(c.name==b)return!0}function v(a,b,c,d,f){var g=a.cc;for(w.state=a,w.stream=f,w.marked=null,w.cc=g,a.lexical.hasOwnProperty("align")||(a.lexical.align=!0);;){var h=g.length?g.pop():e?H:G;if(h(c,d)){for(;g.length&&g[g.length-1].lex;)g.pop()();return w.marked?w.marked:"variable"==c&&u(a,d)?"variable-2":b}}}function x(){for(var a=arguments.length-1;a>=0;a--)w.cc.push(arguments[a])}function y(){return x.apply(null,arguments),!0}function z(a){function c(b){for(var c=b;c;c=c.next)if(c.name==a)return!0;return!1}var d=w.state;if(d.context){if(w.marked="def",c(d.localVars))return;d.localVars={name:a,next:d.localVars}}else{if(c(d.globalVars))return;b.globalVars&&(d.globalVars={name:a,next:d.globalVars})}}function B(){w.state.context={prev:w.state.context,vars:w.state.localVars},w.state.localVars=A}function C(){w.state.localVars=w.state.context.vars,w.state.context=w.state.context.prev}function D(a,b){var c=function(){var c=w.state,d=c.indented;"stat"==c.lexical.type&&(d=c.lexical.indented),c.lexical=new t(d,w.stream.column(),a,null,c.lexical,b)};return c.lex=!0,c}function E(){var a=w.state;a.lexical.prev&&(")"==a.lexical.type&&(a.indented=a.lexical.indented),a.lexical=a.lexical.prev)}function F(a){return function(b){return b==a?y():";"==a?x():y(arguments.callee)}}function G(a,b){return"var"==a?y(D("vardef",b.length),_,F(";"),E):"keyword a"==a?y(D("form"),H,G,E):"keyword b"==a?y(D("form"),G,E):"{"==a?y(D("}"),Y,E):";"==a?y():"if"==a?y(D("form"),H,G,E,eb):"function"==a?y(kb):"for"==a?y(D("form"),fb,E,G,E):"variable"==a?y(D("stat"),S):"switch"==a?y(D("form"),H,D("}","switch"),F("{"),Y,E,E):"case"==a?y(H,F(":")):"default"==a?y(F(":")):"catch"==a?y(D("form"),B,F("("),lb,F(")"),G,E,C):"module"==a?y(D("form"),B,pb,C,E):"class"==a?y(D("form"),mb,ob,E):"export"==a?y(D("form"),qb,E):"import"==a?y(D("form"),rb,E):x(D("stat"),H,F(";"),E)}function H(a){return J(a,!1)}function I(a){return J(a,!0)}function J(a,b){if(w.state.fatArrowAt==w.stream.start){var c=b?R:Q;if("("==a)return y(B,X(ab,")"),F("=>"),c,C);if("variable"==a)return x(B,ab,F("=>"),c,C)}var d=b?N:M;return s.hasOwnProperty(a)?y(d):"function"==a?y(kb):"keyword c"==a?y(b?L:K):"("==a?y(D(")"),K,vb,F(")"),E,d):"operator"==a||"spread"==a?y(b?I:H):"["==a?y(D("]"),I,ub,E,d):"{"==a?y(X(U,"}"),d):y()}function K(a){return a.match(/[;\}\)\],]/)?x():x(H)}function L(a){return a.match(/[;\}\)\],]/)?x():x(I)}function M(a,b){return","==a?y(H):N(a,b,!1)}function N(a,b,c){var d=0==c?M:N,e=0==c?H:I;return"=>"==b?y(B,c?R:Q,C):"operator"==a?/\+\+|--/.test(b)?y(d):"?"==b?y(H,F(":"),e):y(e):"quasi"==a?(w.cc.push(d),O(b)):";"!=a?"("==a?y(X(I,")","call"),d):"."==a?y(T,d):"["==a?y(D("]"),K,F("]"),E,d):void 0:void 0}function O(a){return"${"!=a.slice(a.length-2)?y():y(H,P)}function P(a){return"}"==a?(w.marked="string-2",w.state.tokenize=p,y()):void 0}function Q(a){return r(w.stream,w.state),"{"==a?x(G):x(H)}function R(a){return r(w.stream,w.state),"{"==a?x(G):x(I)}function S(a){return":"==a?y(E,G):x(M,F(";"),E)}function T(a){return"variable"==a?(w.marked="property",y()):void 0}function U(a,b){if("variable"==a){if(w.marked="property","get"==b||"set"==b)return y(V)}else if("number"==a||"string"==a)w.marked=a+" property";else if("["==a)return y(H,F("]"),W);return s.hasOwnProperty(a)?y(W):void 0}function V(a){return"variable"!=a?x(W):(w.marked="property",y(kb))}function W(a){return":"==a?y(I):"("==a?x(kb):void 0}function X(a,b,c){function d(c){if(","==c){var e=w.state.lexical;return"call"==e.info&&(e.pos=(e.pos||0)+1),y(a,d)}return c==b?y():y(F(b))}return function(e){return e==b?y():c===!1?x(a,d):x(D(b,c),a,d,E)}}function Y(a){return"}"==a?y():x(G,Y)}function Z(a){return f&&":"==a?y($):void 0}function $(a){return"variable"==a?(w.marked="variable-3",y()):void 0}function _(){return x(ab,Z,cb,db)}function ab(a,b){return"variable"==a?(z(b),y()):"["==a?y(X(ab,"]")):"{"==a?y(X(bb,"}")):void 0}function bb(a,b){return"variable"!=a||w.stream.match(/^\s*:/,!1)?("variable"==a&&(w.marked="property"),y(F(":"),ab,cb)):(z(b),y(cb))}function cb(a,b){return"="==b?y(I):void 0}function db(a){return","==a?y(_):void 0}function eb(a,b){return"keyword b"==a&&"else"==b?y(D("form"),G,E):void 0}function fb(a){return"("==a?y(D(")"),gb,F(")")):void 0}function gb(a){return"var"==a?y(_,F(";"),ib):";"==a?y(ib):"variable"==a?y(hb):x(H,F(";"),ib)}function hb(a,b){return"in"==b||"of"==b?(w.marked="keyword",y(H)):y(M,ib)}function ib(a,b){return";"==a?y(jb):"in"==b||"of"==b?(w.marked="keyword",y(H)):x(H,F(";"),jb)}function jb(a){")"!=a&&y(H)}function kb(a,b){return"*"==b?(w.marked="keyword",y(kb)):"variable"==a?(z(b),y(kb)):"("==a?y(B,X(lb,")"),G,C):void 0}function lb(a){return"spread"==a?y(lb):x(ab,Z)}function mb(a,b){return"variable"==a?(z(b),y(nb)):void 0}function nb(a,b){return"extends"==b?y(H):void 0}function ob(a){return"{"==a?y(X(U,"}")):void 0}function pb(a,b){return"string"==a?y(G):"variable"==a?(z(b),y(tb)):void 0}function qb(a,b){return"*"==b?(w.marked="keyword",y(tb,F(";"))):"default"==b?(w.marked="keyword",y(H,F(";"))):x(G)}function rb(a){return"string"==a?y():x(sb,tb)}function sb(a,b){return"{"==a?y(X(sb,"}")):("variable"==a&&z(b),y())}function tb(a,b){return"from"==b?(w.marked="keyword",y(H)):void 0}function ub(a){return"for"==a?x(vb):","==a?y(X(I,"]",!1)):x(X(I,"]",!1))}function vb(a){return"for"==a?y(fb,vb):"if"==a?y(H,vb):void 0}var j,k,c=a.indentUnit,d=b.statementIndent,e=b.json,f=b.typescript,g=function(){function a(a){return{type:a,style:"keyword"}}var b=a("keyword a"),c=a("keyword b"),d=a("keyword c"),e=a("operator"),g={type:"atom",style:"atom"},h={"if":a("if"),"while":b,"with":b,"else":c,"do":c,"try":c,"finally":c,"return":d,"break":d,"continue":d,"new":d,"delete":d,"throw":d,"var":a("var"),"const":a("var"),let:a("var"),"function":a("function"),"catch":a("catch"),"for":a("for"),"switch":a("switch"),"case":a("case"),"default":a("default"),"in":e,"typeof":e,"instanceof":e,"true":g,"false":g,"null":g,undefined:g,NaN:g,Infinity:g,"this":a("this"),module:a("module"),"class":a("class"),"super":a("atom"),yield:d,"export":a("export"),"import":a("import"),"extends":d};if(f){var i={type:"variable",style:"variable-3"},j={"interface":a("interface"),"extends":a("extends"),constructor:a("constructor"),"public":a("public"),"private":a("private"),"protected":a("protected"),"static":a("static"),string:i,number:i,bool:i,any:i};for(var k in j)h[k]=j[k]}return h}(),h=/[+\-*&%=<>!?|~^]/,q="([{}])",s={atom:!0,number:!0,variable:!0,string:!0,regexp:!0,"this":!0},w={state:null,column:null,marked:null,cc:null},A={name:"this",next:{name:"arguments"}};return E.lex=!0,{startState:function(a){var d={tokenize:m,lastType:"sof",cc:[],lexical:new t((a||0)-c,0,"block",!1),localVars:b.localVars,context:b.localVars&&{vars:b.localVars},indented:0};return b.globalVars&&(d.globalVars=b.globalVars),d},token:function(a,b){if(a.sol()&&(b.lexical.hasOwnProperty("align")||(b.lexical.align=!1),b.indented=a.indentation(),r(a,b)),b.tokenize!=o&&a.eatSpace())return null;var c=b.tokenize(a,b);return"comment"==j?c:(b.lastType="operator"!=j||"++"!=k&&"--"!=k?j:"incdec",v(b,c,j,k,a))},indent:function(a,e){if(a.tokenize==o)return CodeMirror.Pass;if(a.tokenize!=m)return 0;for(var f=e&&e.charAt(0),g=a.lexical,h=a.cc.length-1;h>=0;--h){var i=a.cc[h];if(i==E)g=g.prev;else if(i!=eb)break}"stat"==g.type&&"}"==f&&(g=g.prev),d&&")"==g.type&&"stat"==g.prev.type&&(g=g.prev);var j=g.type,k=f==j;return"vardef"==j?g.indented+("operator"==a.lastType||","==a.lastType?g.info+1:0):"form"==j&&"{"==f?g.indented:"form"==j?g.indented+c:"stat"==j?g.indented+("operator"==a.lastType||","==a.lastType?d||c:0):"switch"!=g.info||k||0==b.doubleIndentSwitch?g.align?g.column+(k?0:1):g.indented+(k?0:c):g.indented+(/^(?:case|default)\b/.test(e)?c:2*c)},electricChars:":{}",blockCommentStart:e?null:"/*",blockCommentEnd:e?null:"*/",lineComment:e?null:"//",fold:"brace",helperType:e?"json":"javascript",jsonMode:e}}),CodeMirror.defineMIME("text/javascript","javascript"),CodeMirror.defineMIME("text/ecmascript","javascript"),CodeMirror.defineMIME("application/javascript","javascript"),CodeMirror.defineMIME("application/ecmascript","javascript"),CodeMirror.defineMIME("application/json",{name:"javascript",json:!0}),CodeMirror.defineMIME("application/x-json",{name:"javascript",json:!0}),CodeMirror.defineMIME("text/typescript",{name:"javascript",typescript:!0}),CodeMirror.defineMIME("application/typescript",{name:"javascript",typescript:!0}),CodeMirror.defineMode("shell",function(){function b(b,c){for(var d=c.split(" "),e=0;e<d.length;e++)a[d[e]]=b}function c(b,c){var g=b.sol(),h=b.next();if("'"===h||'"'===h||"`"===h)return c.tokens.unshift(d(h)),f(b,c);if("#"===h)return g&&b.eat("!")?(b.skipToEnd(),"meta"):(b.skipToEnd(),"comment");if("$"===h)return c.tokens.unshift(e),f(b,c);if("+"===h||"="===h)return"operator";if("-"===h)return b.eat("-"),b.eatWhile(/\w/),"attribute";if(/\d/.test(h)&&(b.eatWhile(/\d/),!/\w/.test(b.peek())))return"number";b.eatWhile(/[\w-]/);var i=b.current();return"="===b.peek()&&/\w+/.test(i)?"def":a.hasOwnProperty(i)?a[i]:null}function d(a){return function(b,c){for(var d,f=!1,g=!1;null!=(d=b.next());){if(d===a&&!g){f=!0;break}if("$"===d&&!g&&"'"!==a){g=!0,b.backUp(1),c.tokens.unshift(e);break}g=!g&&"\\"===d}return(f||!g)&&c.tokens.shift(),"`"===a||")"===a?"quote":"string"}}function f(a,b){return(b.tokens[0]||c)(a,b)}var a={};b("atom","true false"),b("keyword","if then do else elif while until for in esac fi fin fil done exit set unset export function"),b("builtin","ab awk bash beep cat cc cd chown chmod chroot clear cp curl cut diff echo find gawk gcc get git grep kill killall ln ls make mkdir openssl mv nc node npm ping ps restart rm rmdir sed service sh shopt shred source sort sleep ssh start stop su sudo tee telnet top touch vi vim wall wc wget who write yes zsh");var e=function(a,b){b.tokens.length>1&&a.eat("$");var c=a.next(),e=/\w/;return"{"===c&&(e=/[^}]/),"("===c?(b.tokens[0]=d(")"),f(a,b)):(/\d/.test(c)||(a.eatWhile(e),a.eat("}")),b.tokens.shift(),"def")};return{startState:function(){return{tokens:[]}},token:function(a,b){return a.eatSpace()?null:f(a,b)}}}),CodeMirror.defineMIME("text/x-sh","shell"),CodeMirror.defineMode("xml",function(a,b){function j(a,b){function c(c){return b.tokenize=c,c(a,b)}var d=a.next();if("<"==d){if(a.eat("!"))return a.eat("[")?a.match("CDATA[")?c(m("atom","]]>")):null:a.match("--")?c(m("comment","-->")):a.match("DOCTYPE",!0,!0)?(a.eatWhile(/[\w\._\-]/),c(n(1))):null;if(a.eat("?"))return a.eatWhile(/[\w\._\-]/),b.tokenize=m("meta","?>"),"meta";var e=a.eat("/");h="";for(var f;f=a.eat(/[^\s\u00a0=<>\"\'\/?]/);)h+=f;return h?(i=e?"closeTag":"openTag",b.tokenize=k,"tag"):"tag error"}if("&"==d){var g;return g=a.eat("#")?a.eat("x")?a.eatWhile(/[a-fA-F\d]/)&&a.eat(";"):a.eatWhile(/[\d]/)&&a.eat(";"):a.eatWhile(/[\w\.\-:]/)&&a.eat(";"),g?"atom":"error"}return a.eatWhile(/[^&<]/),null}function k(a,b){var c=a.next();if(">"==c||"/"==c&&a.eat(">"))return b.tokenize=j,i=">"==c?"endTag":"selfcloseTag","tag";if("="==c)return i="equals",null;if("<"==c){b.tokenize=j;var d=b.tokenize(a,b);return d?d+" error":"error"}return/[\'\"]/.test(c)?(b.tokenize=l(c),b.stringStartCol=a.column(),b.tokenize(a,b)):(a.eatWhile(/[^\s\u00a0=<>\"\']/),"word")}function l(a){var b=function(b,c){for(;!b.eol();)if(b.next()==a){c.tokenize=k;break}return"string"};return b.isInAttribute=!0,b}function m(a,b){return function(c,d){for(;!c.eol();){if(c.match(b)){d.tokenize=j;break}c.next()}return a}}function n(a){return function(b,c){for(var d;null!=(d=b.next());){if("<"==d)return c.tokenize=n(a+1),c.tokenize(b,c);if(">"==d){if(1==a){c.tokenize=j;break}return c.tokenize=n(a-1),c.tokenize(b,c)}}return"meta"}}function r(){for(var a=arguments.length-1;a>=0;a--)o.cc.push(arguments[a])}function s(){return r.apply(null,arguments),!0}function t(a,b){var c=f.doNotIndent.hasOwnProperty(a)||o.context&&o.context.noIndent;o.context={prev:o.context,tagName:a,indent:o.indented,startOfLine:b,noIndent:c}}function u(){o.context&&(o.context=o.context.prev)}function v(a){if("openTag"==a)return o.tagName=h,o.tagStart=p.column(),s(z,w(o.startOfLine));if("closeTag"==a){var b=!1;return o.context?o.context.tagName!=h&&(f.implicitlyClosed.hasOwnProperty(o.context.tagName.toLowerCase())&&u(),b=!o.context||o.context.tagName!=h):b=!0,b&&(q="error"),s(x(b))}return s()}function w(a){return function(b){var c=o.tagName;return o.tagName=o.tagStart=null,"selfcloseTag"==b||"endTag"==b&&f.autoSelfClosers.hasOwnProperty(c.toLowerCase())?(y(c.toLowerCase()),s()):"endTag"==b?(y(c.toLowerCase()),t(c,a),s()):s()}}function x(a){return function(b){return a&&(q="error"),"endTag"==b?(u(),s()):(q="error",s(arguments.callee))}}function y(a){for(var b;;){if(!o.context)return;if(b=o.context.tagName.toLowerCase(),!f.contextGrabbers.hasOwnProperty(b)||!f.contextGrabbers[b].hasOwnProperty(a))return;u()}}function z(a){return"word"==a?(q="attribute",s(A,z)):"endTag"==a||"selfcloseTag"==a?r():(q="error",s(z))}function A(a){if("equals"==a)return s(B,z);if(f.allowMissing){if("word"==a)return q="attribute",s(A,z)}else q="error";return"endTag"==a||"selfcloseTag"==a?r():s()}function B(a){return"string"==a?s(C):"word"==a&&f.allowUnquoted?(q="string",s()):(q="error","endTag"==a||"selfCloseTag"==a?r():s())}function C(a){return"string"==a?s(C):r()}var h,i,o,p,q,c=a.indentUnit,d=b.multilineTagIndentFactor||1,e=b.multilineTagIndentPastTag||!0,f=b.htmlMode?{autoSelfClosers:{area:!0,base:!0,br:!0,col:!0,command:!0,embed:!0,frame:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},implicitlyClosed:{dd:!0,li:!0,optgroup:!0,option:!0,p:!0,rp:!0,rt:!0,tbody:!0,td:!0,tfoot:!0,th:!0,tr:!0},contextGrabbers:{dd:{dd:!0,dt:!0},dt:{dd:!0,dt:!0},li:{li:!0},option:{option:!0,optgroup:!0},optgroup:{optgroup:!0},p:{address:!0,article:!0,aside:!0,blockquote:!0,dir:!0,div:!0,dl:!0,fieldset:!0,footer:!0,form:!0,h1:!0,h2:!0,h3:!0,h4:!0,h5:!0,h6:!0,header:!0,hgroup:!0,hr:!0,menu:!0,nav:!0,ol:!0,p:!0,pre:!0,section:!0,table:!0,ul:!0},rp:{rp:!0,rt:!0},rt:{rp:!0,rt:!0},tbody:{tbody:!0,tfoot:!0},td:{td:!0,th:!0},tfoot:{tbody:!0},th:{td:!0,th:!0},thead:{tbody:!0,tfoot:!0},tr:{tr:!0}},doNotIndent:{pre:!0},allowUnquoted:!0,allowMissing:!0}:{autoSelfClosers:{},implicitlyClosed:{},contextGrabbers:{},doNotIndent:{},allowUnquoted:!1,allowMissing:!1},g=b.alignCDATA;return{startState:function(){return{tokenize:j,cc:[],indented:0,startOfLine:!0,tagName:null,tagStart:null,context:null}},token:function(a,b){if(!b.tagName&&a.sol()&&(b.startOfLine=!0,b.indented=a.indentation()),a.eatSpace())return null;q=i=h=null;var c=b.tokenize(a,b);if(b.type=i,(c||i)&&"comment"!=c)for(o=b,p=a;;){var d=b.cc.pop()||v;if(d(i||c))break}return b.startOfLine=!1,q&&(c="error"==q?c+" error":q),c},indent:function(a,b,f){var h=a.context;if(a.tokenize.isInAttribute)return a.stringStartCol+1;if(a.tokenize!=k&&a.tokenize!=j||h&&h.noIndent)return f?f.match(/^(\s*)/)[0].length:0;if(a.tagName)return e?a.tagStart+a.tagName.length+2:a.tagStart+c*d;if(g&&/<!\[CDATA\[/.test(b))return 0;for(h&&/^<\//.test(b)&&(h=h.prev);h&&!h.startOfLine;)h=h.prev;return h?h.indent+c:0},electricChars:"/",blockCommentStart:"<!--",blockCommentEnd:"-->",configuration:b.htmlMode?"html":"xml",helperType:b.htmlMode?"html":"xml"}}),CodeMirror.defineMIME("text/xml","xml"),CodeMirror.defineMIME("application/xml","xml"),CodeMirror.mimeModes.hasOwnProperty("text/html")||CodeMirror.defineMIME("text/html",{name:"xml",htmlMode:!0});
});
require.register("jashkenas-underscore/underscore.js", function(exports, require, module){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  //use the faster Date.now if available.
  var getTime = (Date.now || function() {
    return new Date().getTime();
  });

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = value == null ? _.identity : lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : getTime();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = getTime();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = getTime();
      var later = function() {
        var last = getTime() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

});
require.register("jashkenas-backbone/backbone.js", function(exports, require, module){
//     Backbone.js 1.1.0

//     (c) 2010-2011 Jeremy Ashkenas, DocumentCloud Inc.
//     (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch(e) {};
    factory(root, exports, _, $);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model, options);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i] || {};
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute || 'id'];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);
          this._addReference(model, options);
        }
        if (order) order.push(existing || model);
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) return attrs;
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      if (model.id != null) this._byId[model.id] = model;
      if (!model.collection) model.collection = this;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      delete this._byId[model.id];
      delete this._byId[model.cid];
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch = typeof window !== 'undefined' && !!window.ActiveXObject && !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash and query.
  var pathStripper = /[?#].*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !atRoot) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + this.location.search + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && atRoot && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the fragment of the query and hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;

}));

});
require.register("wyuenho-backbone-pageable/lib/backbone-pageable.js", function(exports, require, module){
/*
  backbone-pageable 1.4.1
  http://github.com/wyuenho/backbone-pageable

  Copyright (c) 2013 Jimmy Yuen Ho Wong
  Licensed under the MIT @license.
*/

(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("underscore"), require("backbone"));
  }
  // AMD
  else if (typeof define == "function" && define.amd) {
    define(["underscore", "backbone"], factory);
  }
  // Browser
  else if (typeof _ !== "undefined" && typeof Backbone !== "undefined") {
    var oldPageableCollection = Backbone.PageableCollection;
    var PageableCollection = factory(_, Backbone);

    /**
       __BROWSER ONLY__

       If you already have an object named `PageableCollection` attached to the
       `Backbone` module, you can use this to return a local reference to this
       Backbone.PageableCollection class and reset the name
       Backbone.PageableCollection to its previous definition.

           // The left hand side gives you a reference to this
           // Backbone.PageableCollection implementation, the right hand side
           // resets Backbone.PageableCollection to your other
           // Backbone.PageableCollection.
           var PageableCollection = Backbone.PageableCollection.noConflict();

       @static
       @member Backbone.PageableCollection
       @return {Backbone.PageableCollection}
    */
    Backbone.PageableCollection.noConflict = function () {
      Backbone.PageableCollection = oldPageableCollection;
      return PageableCollection;
    };
  }

}(function (_, Backbone) {

  "use strict";

  var _extend = _.extend;
  var _omit = _.omit;
  var _clone = _.clone;
  var _each = _.each;
  var _pick = _.pick;
  var _contains = _.contains;
  var _isEmpty = _.isEmpty;
  var _pairs = _.pairs;
  var _invert = _.invert;
  var _isArray = _.isArray;
  var _isFunction = _.isFunction;
  var _isObject = _.isObject;
  var _keys = _.keys;
  var _isUndefined = _.isUndefined;
  var _result = _.result;
  var ceil = Math.ceil;
  var floor = Math.floor;
  var max = Math.max;

  var BBColProto = Backbone.Collection.prototype;

  function finiteInt (val, name) {
    if (!_.isNumber(val) || _.isNaN(val) || !_.isFinite(val) || ~~val !== val) {
      throw new TypeError("`" + name + "` must be a finite integer");
    }
    return val;
  }

  function queryStringToParams (qs) {
    var kvp, k, v, ls, params = {}, decode = decodeURIComponent;
    var kvps = qs.split('&');
    for (var i = 0, l = kvps.length; i < l; i++) {
      var param = kvps[i];
      kvp = param.split('='), k = kvp[0], v = kvp[1] || true;
      k = decode(k), v = decode(v), ls = params[k];
      if (_isArray(ls)) ls.push(v);
      else if (ls) params[k] = [ls, v];
      else params[k] = v;
    }
    return params;
  }

  // hack to make sure the whatever event handlers for this event is run
  // before func is, and the event handlers that func will trigger.
  function runOnceAtLastHandler (col, event, func) {
    var eventHandlers = col._events[event];
    if (eventHandlers && eventHandlers.length) {
      var lastHandler = eventHandlers[eventHandlers.length - 1];
      var oldCallback = lastHandler.callback;
      lastHandler.callback = function () {
        try {
          oldCallback.apply(this, arguments);
          func();
        }
        catch (e) {
          throw e;
        }
        finally {
          lastHandler.callback = oldCallback;
        }
      };
    }
    else func();
  }

  var PARAM_TRIM_RE = /[\s'"]/g;
  var URL_TRIM_RE = /[<>\s'"]/g;

  /**
     Drop-in replacement for Backbone.Collection. Supports server-side and
     client-side pagination and sorting. Client-side mode also support fully
     multi-directional synchronization of changes between pages.

     @class Backbone.PageableCollection
     @extends Backbone.Collection
  */
  var PageableCollection = Backbone.PageableCollection = Backbone.Collection.extend({

    /**
       The container object to store all pagination states.

       You can override the default state by extending this class or specifying
       them in an `options` hash to the constructor.

       @property {Object} state

       @property {0|1} [state.firstPage=1] The first page index. Set to 0 if
       your server API uses 0-based indices. You should only override this value
       during extension, initialization or reset by the server after
       fetching. This value should be read only at other times.

       @property {number} [state.lastPage=null] The last page index. This value
       is __read only__ and it's calculated based on whether `firstPage` is 0 or
       1, during bootstrapping, fetching and resetting. Please don't change this
       value under any circumstances.

       @property {number} [state.currentPage=null] The current page index. You
       should only override this value during extension, initialization or reset
       by the server after fetching. This value should be read only at other
       times. Can be a 0-based or 1-based index, depending on whether
       `firstPage` is 0 or 1. If left as default, it will be set to `firstPage`
       on initialization.

       @property {number} [state.pageSize=25] How many records to show per
       page. This value is __read only__ after initialization, if you want to
       change the page size after initialization, you must call #setPageSize.

       @property {number} [state.totalPages=null] How many pages there are. This
       value is __read only__ and it is calculated from `totalRecords`.

       @property {number} [state.totalRecords=null] How many records there
       are. This value is __required__ under server mode. This value is optional
       for client mode as the number will be the same as the number of models
       during bootstrapping and during fetching, either supplied by the server
       in the metadata, or calculated from the size of the response.

       @property {string} [state.sortKey=null] The model attribute to use for
       sorting.

       @property {-1|0|1} [state.order=-1] The order to use for sorting. Specify
       -1 for ascending order or 1 for descending order. If 0, no client side
       sorting will be done and the order query parameter will not be sent to
       the server during a fetch.
    */
    state: {
      firstPage: 1,
      lastPage: null,
      currentPage: null,
      pageSize: 25,
      totalPages: null,
      totalRecords: null,
      sortKey: null,
      order: -1
    },

    /**
       @property {"server"|"client"|"infinite"} [mode="server"] The mode of
       operations for this collection. `"server"` paginates on the server-side,
       `"client"` paginates on the client-side and `"infinite"` paginates on the
       server-side for APIs that do not support `totalRecords`.
    */
    mode: "server",

    /**
       A translation map to convert Backbone.PageableCollection state attributes
       to the query parameters accepted by your server API.

       You can override the default state by extending this class or specifying
       them in `options.queryParams` object hash to the constructor.

       @property {Object} queryParams
       @property {string} [queryParams.currentPage="page"]
       @property {string} [queryParams.pageSize="per_page"]
       @property {string} [queryParams.totalPages="total_pages"]
       @property {string} [queryParams.totalRecords="total_entries"]
       @property {string} [queryParams.sortKey="sort_by"]
       @property {string} [queryParams.order="order"]
       @property {string} [queryParams.directions={"-1": "asc", "1": "desc"}] A
       map for translating a Backbone.PageableCollection#state.order constant to
       the ones your server API accepts.
    */
    queryParams: {
      currentPage: "page",
      pageSize: "per_page",
      totalPages: "total_pages",
      totalRecords: "total_entries",
      sortKey: "sort_by",
      order: "order",
      directions: {
        "-1": "asc",
        "1": "desc"
      }
    },

    /**
       __CLIENT MODE ONLY__

       This collection is the internal storage for the bootstrapped or fetched
       models. You can use this if you want to operate on all the pages.

       @property {Backbone.Collection} fullCollection
    */

    /**
       Given a list of models or model attributues, bootstraps the full
       collection in client mode or infinite mode, or just the page you want in
       server mode.

       If you want to initialize a collection to a different state than the
       default, you can specify them in `options.state`. Any state parameters
       supplied will be merged with the default. If you want to change the
       default mapping from #state keys to your server API's query parameter
       names, you can specifiy an object hash in `option.queryParams`. Likewise,
       any mapping provided will be merged with the default. Lastly, all
       Backbone.Collection constructor options are also accepted.

       See:

       - Backbone.PageableCollection#state
       - Backbone.PageableCollection#queryParams
       - [Backbone.Collection#initialize](http://backbonejs.org/#Collection-constructor)

       @param {Array.<Object>} [models]

       @param {Object} [options]

       @param {function(*, *): number} [options.comparator] If specified, this
       comparator is set to the current page under server mode, or the #fullCollection
       otherwise.

       @param {boolean} [options.full] If `false` and either a
       `options.comparator` or `sortKey` is defined, the comparator is attached
       to the current page. Default is `true` under client or infinite mode and
       the comparator will be attached to the #fullCollection.

       @param {Object} [options.state] The state attributes overriding the defaults.

       @param {string} [options.state.sortKey] The model attribute to use for
       sorting. If specified instead of `options.comparator`, a comparator will
       be automatically created using this value, and optionally a sorting order
       specified in `options.state.order`. The comparator is then attached to
       the new collection instance.

       @param {-1|1} [options.state.order] The order to use for sorting. Specify
       -1 for ascending order and 1 for descending order.

       @param {Object} [options.queryParam]
    */
    constructor: function (models, options) {

      BBColProto.constructor.apply(this, arguments);

      options = options || {};

      var mode = this.mode = options.mode || this.mode || PageableProto.mode;

      var queryParams = _extend({}, PageableProto.queryParams, this.queryParams,
                                options.queryParams || {});

      queryParams.directions = _extend({},
                                       PageableProto.queryParams.directions,
                                       this.queryParams.directions,
                                       queryParams.directions || {});

      this.queryParams = queryParams;

      var state = this.state = _extend({}, PageableProto.state, this.state,
                                       options.state || {});

      state.currentPage = state.currentPage == null ?
        state.firstPage :
        state.currentPage;

      if (!_isArray(models)) models = models ? [models] : [];

      if (mode != "server" && state.totalRecords == null && !_isEmpty(models)) {
        state.totalRecords = models.length;
      }

      this.switchMode(mode, _extend({fetch: false,
                                     resetState: false,
                                     models: models}, options));

      var comparator = options.comparator;

      if (state.sortKey && !comparator) {
        this.setSorting(state.sortKey, state.order, options);
      }

      if (mode != "server") {
        var fullCollection = this.fullCollection;

        if (comparator && options.full) {
          this.comparator = null;
          fullCollection.comparator = comparator;
        }

        if (options.full) fullCollection.sort();

        // make sure the models in the current page and full collection have the
        // same references
        if (models && !_isEmpty(models)) {
          this.reset([].slice.call(models), _extend({silent: true}, options));
          this.getPage(state.currentPage);
          models.splice.apply(models, [0, models.length].concat(this.models));
        }
      }

      this._initState = _clone(this.state);
    },

    /**
       Makes a Backbone.Collection that contains all the pages.

       @private
       @param {Array.<Object|Backbone.Model>} models
       @param {Object} options Options for Backbone.Collection constructor.
       @return {Backbone.Collection}
    */
    _makeFullCollection: function (models, options) {

      var properties = ["url", "model", "sync", "comparator"];
      var thisProto = this.constructor.prototype;
      var i, length, prop;

      var proto = {};
      for (i = 0, length = properties.length; i < length; i++) {
        prop = properties[i];
        if (!_isUndefined(thisProto[prop])) {
          proto[prop] = thisProto[prop];
        }
      }

      var fullCollection = new (Backbone.Collection.extend(proto))(models, options);

      for (i = 0, length = properties.length; i < length; i++) {
        prop = properties[i];
        if (this[prop] !== thisProto[prop]) {
          fullCollection[prop] = this[prop];
        }
      }

      return fullCollection;
    },

    /**
       Factory method that returns a Backbone event handler that responses to
       the `add`, `remove`, `reset`, and the `sort` events. The returned event
       handler will synchronize the current page collection and the full
       collection's models.

       @private

       @param {Backbone.PageableCollection} pageCol
       @param {Backbone.Collection} fullCol

       @return {function(string, Backbone.Model, Backbone.Collection, Object)}
       Collection event handler
    */
    _makeCollectionEventHandler: function (pageCol, fullCol) {

      return function collectionEventHandler (event, model, collection, options) {

        var handlers = pageCol._handlers;
        _each(_keys(handlers), function (event) {
          var handler = handlers[event];
          pageCol.off(event, handler);
          fullCol.off(event, handler);
        });

        var state = _clone(pageCol.state);
        var firstPage = state.firstPage;
        var currentPage = firstPage === 0 ?
          state.currentPage :
          state.currentPage - 1;
        var pageSize = state.pageSize;
        var pageStart = currentPage * pageSize, pageEnd = pageStart + pageSize;

        if (event == "add") {
          var pageIndex, fullIndex, addAt, colToAdd, options = options || {};
          if (collection == fullCol) {
            fullIndex = fullCol.indexOf(model);
            if (fullIndex >= pageStart && fullIndex < pageEnd) {
              colToAdd = pageCol;
              pageIndex = addAt = fullIndex - pageStart;
            }
          }
          else {
            pageIndex = pageCol.indexOf(model);
            fullIndex = pageStart + pageIndex;
            colToAdd = fullCol;
            var addAt = !_isUndefined(options.at) ?
              options.at + pageStart :
              fullIndex;
          }

          ++state.totalRecords;
          pageCol.state = pageCol._checkState(state);

          if (colToAdd) {
            colToAdd.add(model, _extend({}, options || {}, {at: addAt}));
            var modelToRemove = pageIndex >= pageSize ?
              model :
              !_isUndefined(options.at) && addAt < pageEnd && pageCol.length > pageSize ?
              pageCol.at(pageSize) :
              null;
            if (modelToRemove) {
              var popOptions = {onAdd: true};
              runOnceAtLastHandler(collection, event, function () {
                pageCol.remove(modelToRemove, popOptions);
              });
            }
          }
        }

        // remove the model from the other collection as well
        if (event == "remove") {
          if (!options.onAdd) {
            // decrement totalRecords and update totalPages and lastPage
            if (!--state.totalRecords) {
              state.totalRecords = null;
              state.totalPages = null;
            }
            else {
              var totalPages = state.totalPages = ceil(state.totalRecords / pageSize);
              state.lastPage = firstPage === 0 ? totalPages - 1 : totalPages || firstPage;
              if (state.currentPage > totalPages) state.currentPage = state.lastPage;
            }
            pageCol.state = pageCol._checkState(state);

            var nextModel, removedIndex = options.index;
            if (collection == pageCol) {
              if (nextModel = fullCol.at(pageEnd)) {
                runOnceAtLastHandler(pageCol, event, function () {
                  pageCol.push(nextModel);
                });
              }
              fullCol.remove(model);
            }
            else if (removedIndex >= pageStart && removedIndex < pageEnd) {
              pageCol.remove(model);
              var at = removedIndex + 1
              nextModel = fullCol.at(at) || fullCol.last();
              if (nextModel) pageCol.add(nextModel, {at: at});
            }
          }
          else delete options.onAdd;
        }

        if (event == "reset") {
          options = collection;
          collection = model;

          // Reset that's not a result of getPage
          if (collection == pageCol && options.from == null &&
              options.to == null) {
            var head = fullCol.models.slice(0, pageStart);
            var tail = fullCol.models.slice(pageStart + pageCol.models.length);
            fullCol.reset(head.concat(pageCol.models).concat(tail), options);
          }
          else if (collection == fullCol) {
            if (!(state.totalRecords = fullCol.models.length)) {
              state.totalRecords = null;
              state.totalPages = null;
            }
            if (pageCol.mode == "client") {
              state.lastPage = state.currentPage = state.firstPage;
            }
            pageCol.state = pageCol._checkState(state);
            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                          _extend({}, options, {parse: false}));
          }
        }

        if (event == "sort") {
          options = collection;
          collection = model;
          if (collection === fullCol) {
            pageCol.reset(fullCol.models.slice(pageStart, pageEnd),
                          _extend({}, options, {parse: false}));
          }
        }

        _each(_keys(handlers), function (event) {
          var handler = handlers[event];
          _each([pageCol, fullCol], function (col) {
            col.on(event, handler);
            var callbacks = col._events[event] || [];
            callbacks.unshift(callbacks.pop());
          });
        });
      };
    },

    /**
       Sanity check this collection's pagination states. Only perform checks
       when all the required pagination state values are defined and not null.
       If `totalPages` is undefined or null, it is set to `totalRecords` /
       `pageSize`. `lastPage` is set according to whether `firstPage` is 0 or 1
       when no error occurs.

       @private

       @throws {TypeError} If `totalRecords`, `pageSize`, `currentPage` or
       `firstPage` is not a finite integer.

       @throws {RangeError} If `pageSize`, `currentPage` or `firstPage` is out
       of bounds.

       @return {Object} Returns the `state` object if no error was found.
    */
    _checkState: function (state) {

      var mode = this.mode;
      var links = this.links;
      var totalRecords = state.totalRecords;
      var pageSize = state.pageSize;
      var currentPage = state.currentPage;
      var firstPage = state.firstPage;
      var totalPages = state.totalPages;

      if (totalRecords != null && pageSize != null && currentPage != null &&
          firstPage != null && (mode == "infinite" ? links : true)) {

        totalRecords = finiteInt(totalRecords, "totalRecords");
        pageSize = finiteInt(pageSize, "pageSize");
        currentPage = finiteInt(currentPage, "currentPage");
        firstPage = finiteInt(firstPage, "firstPage");

        if (pageSize < 1) {
          throw new RangeError("`pageSize` must be >= 1");
        }

        totalPages = state.totalPages = ceil(totalRecords / pageSize);

        if (firstPage < 0 || firstPage > 1) {
          throw new RangeError("`firstPage must be 0 or 1`");
        }

        state.lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;

        if (mode == "infinite") {
          if (!links[currentPage + '']) {
            throw new RangeError("No link found for page " + currentPage);
          }
        }
        else if (currentPage < firstPage ||
                 (totalPages > 0 &&
                  (firstPage ? currentPage > totalPages : currentPage >= totalPages))) {
          var op = firstPage ? ">=" : ">";

          throw new RangeError("`currentPage` must be firstPage <= currentPage " +
                               (firstPage ? ">" : ">=") +
                               " totalPages if " + firstPage + "-based. Got " +
                               currentPage + '.');
        }
      }

      return state;
    },

    /**
       Change the page size of this collection.

       Under most if not all circumstances, you should call this method to
       change the page size of a pageable collection because it will keep the
       pagination state sane. By default, the method will recalculate the
       current page number to one that will retain the current page's models
       when increasing the page size. When decreasing the page size, this method
       will retain the last models to the current page that will fit into the
       smaller page size.

       If `options.first` is true, changing the page size will also reset the
       current page back to the first page instead of trying to be smart.

       For server mode operations, changing the page size will trigger a #fetch
       and subsequently a `reset` event.

       For client mode operations, changing the page size will `reset` the
       current page by recalculating the current page boundary on the client
       side.

       If `options.fetch` is true, a fetch can be forced if the collection is in
       client mode.

       @param {number} pageSize The new page size to set to #state.
       @param {Object} [options] {@link #fetch} options.
       @param {boolean} [options.first=false] Reset the current page number to
       the first page if `true`.
       @param {boolean} [options.fetch] If `true`, force a fetch in client mode.

       @throws {TypeError} If `pageSize` is not a finite integer.
       @throws {RangeError} If `pageSize` is less than 1.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    setPageSize: function (pageSize, options) {
      pageSize = finiteInt(pageSize, "pageSize");

      options = options || {first: false};

      var state = this.state;
      var totalPages = ceil(state.totalRecords / pageSize);
      var currentPage = totalPages ?
        max(state.firstPage,
            floor(totalPages *
                  (state.firstPage ?
                   state.currentPage :
                   state.currentPage + 1) /
                  state.totalPages)) :
        state.firstPage;

      state = this.state = this._checkState(_extend({}, state, {
        pageSize: pageSize,
        currentPage: options.first ? state.firstPage : currentPage,
        totalPages: totalPages
      }));

      return this.getPage(state.currentPage, _omit(options, ["first"]));
    },

    /**
       Switching between client, server and infinite mode.

       If switching from client to server mode, the #fullCollection is emptied
       first and then deleted and a fetch is immediately issued for the current
       page from the server. Pass `false` to `options.fetch` to skip fetching.

       If switching to infinite mode, and if `options.models` is given for an
       array of models, #links will be populated with a URL per page, using the
       default URL for this collection.

       If switching from server to client mode, all of the pages are immediately
       refetched. If you have too many pages, you can pass `false` to
       `options.fetch` to skip fetching.

       If switching to any mode from infinite mode, the #links will be deleted.

       @param {"server"|"client"|"infinite"} [mode] The mode to switch to.

       @param {Object} [options]

       @param {boolean} [options.fetch=true] If `false`, no fetching is done.

       @param {boolean} [options.resetState=true] If 'false', the state is not
       reset, but checked for sanity instead.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this if `options.fetch` is `false`.
    */
    switchMode: function (mode, options) {

      if (!_contains(["server", "client", "infinite"], mode)) {
        throw new TypeError('`mode` must be one of "server", "client" or "infinite"');
      }

      options = options || {fetch: true, resetState: true};

      var state = this.state = options.resetState ?
        _clone(this._initState) :
        this._checkState(_extend({}, this.state));

      this.mode = mode;

      var self = this;
      var fullCollection = this.fullCollection;
      var handlers = this._handlers = this._handlers || {}, handler;
      if (mode != "server" && !fullCollection) {
        fullCollection = this._makeFullCollection(options.models || [], options);
        fullCollection.pageableCollection = this;
        this.fullCollection = fullCollection;
        var allHandler = this._makeCollectionEventHandler(this, fullCollection);
        _each(["add", "remove", "reset", "sort"], function (event) {
          handlers[event] = handler = _.bind(allHandler, {}, event);
          self.on(event, handler);
          fullCollection.on(event, handler);
        });
        fullCollection.comparator = this._fullComparator;
      }
      else if (mode == "server" && fullCollection) {
        _each(_keys(handlers), function (event) {
          handler = handlers[event];
          self.off(event, handler);
          fullCollection.off(event, handler);
        });
        delete this._handlers;
        this._fullComparator = fullCollection.comparator;
        delete this.fullCollection;
      }

      if (mode == "infinite") {
        var links = this.links = {};
        var firstPage = state.firstPage;
        var totalPages = ceil(state.totalRecords / state.pageSize);
        var lastPage = firstPage === 0 ? max(0, totalPages - 1) : totalPages || firstPage;
        for (var i = state.firstPage; i <= lastPage; i++) {
          links[i] = this.url;
        }
      }
      else if (this.links) delete this.links;

      return options.fetch ?
        this.fetch(_omit(options, "fetch", "resetState")) :
        this;
    },

    /**
       @return {boolean} `true` if this collection can page backward, `false`
       otherwise.
    */
    hasPrevious: function () {
      var state = this.state;
      var currentPage = state.currentPage;
      if (this.mode != "infinite") return currentPage > state.firstPage;
      return !!this.links[currentPage - 1];
    },

    /**
       @return {boolean} `true` if this collection can page forward, `false`
       otherwise.
    */
    hasNext: function () {
      var state = this.state;
      var currentPage = this.state.currentPage;
      if (this.mode != "infinite") return currentPage < state.lastPage;
      return !!this.links[currentPage + 1];
    },

    /**
       Fetch the first page in server mode, or reset the current page of this
       collection to the first page in client or infinite mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getFirstPage: function (options) {
      return this.getPage("first", options);
    },

    /**
       Fetch the previous page in server mode, or reset the current page of this
       collection to the previous page in client or infinite mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPreviousPage: function (options) {
      return this.getPage("prev", options);
    },

    /**
       Fetch the next page in server mode, or reset the current page of this
       collection to the next page in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getNextPage: function (options) {
      return this.getPage("next", options);
    },

    /**
       Fetch the last page in server mode, or reset the current page of this
       collection to the last page in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getLastPage: function (options) {
      return this.getPage("last", options);
    },

    /**
       Given a page index, set #state.currentPage to that index. If this
       collection is in server mode, fetch the page using the updated state,
       otherwise, reset the current page of this collection to the page
       specified by `index` in client mode. If `options.fetch` is true, a fetch
       can be forced in client mode before resetting the current page. Under
       infinite mode, if the index is less than the current page, a reset is
       done as in client mode. If the index is greater than the current page
       number, a fetch is made with the results **appended** to #fullCollection.
       The current page will then be reset after fetching.

       @param {number|string} index The page index to go to, or the page name to
       look up from #links in infinite mode.
       @param {Object} [options] {@link #fetch} options or
       [reset](http://backbonejs.org/#Collection-reset) options for client mode
       when `options.fetch` is `false`.
       @param {boolean} [options.fetch=false] If true, force a {@link #fetch} in
       client mode.

       @throws {TypeError} If `index` is not a finite integer under server or
       client mode, or does not yield a URL from #links under infinite mode.

       @throws {RangeError} If `index` is out of bounds.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPage: function (index, options) {

      var mode = this.mode, fullCollection = this.fullCollection;

      options = options || {fetch: false};

      var state = this.state,
      firstPage = state.firstPage,
      currentPage = state.currentPage,
      lastPage = state.lastPage,
      pageSize = state.pageSize;

      var pageNum = index;
      switch (index) {
        case "first": pageNum = firstPage; break;
        case "prev": pageNum = currentPage - 1; break;
        case "next": pageNum = currentPage + 1; break;
        case "last": pageNum = lastPage; break;
        default: pageNum = finiteInt(index, "index");
      }

      this.state = this._checkState(_extend({}, state, {currentPage: pageNum}));

      options.from = currentPage, options.to = pageNum;

      var pageStart = (firstPage === 0 ? pageNum : pageNum - 1) * pageSize;
      var pageModels = fullCollection && fullCollection.length ?
        fullCollection.models.slice(pageStart, pageStart + pageSize) :
        [];
      if ((mode == "client" || (mode == "infinite" && !_isEmpty(pageModels))) &&
          !options.fetch) {
        this.reset(pageModels, _omit(options, "fetch"));
        return this;
      }

      if (mode == "infinite") options.url = this.links[pageNum];

      return this.fetch(_omit(options, "fetch"));
    },

    /**
       Fetch the page for the provided item offset in server mode, or reset the current page of this
       collection to the page for the provided item offset in client mode.

       @param {Object} options {@link #getPage} options.

       @chainable
       @return {XMLHttpRequest|Backbone.PageableCollection} The XMLHttpRequest
       from fetch or this.
    */
    getPageByOffset: function (offset, options) {
      if (offset < 0) {
        throw new RangeError("`offset must be > 0`");
      }
      offset = finiteInt(offset);

      var page = floor(offset / this.state.pageSize);
      if (this.state.firstPage !== 0) page++;
      if (page > this.state.lastPage) page = this.state.lastPage;
      return this.getPage(page, options);
    },

    /**
       Overidden to make `getPage` compatible with Zepto.

       @param {string} method
       @param {Backbone.Model|Backbone.Collection} model
       @param {Object} [options]

       @return {XMLHttpRequest}
    */
    sync: function (method, model, options) {
      var self = this;
      if (self.mode == "infinite") {
        var success = options.success;
        var currentPage = self.state.currentPage;
        options.success = function (resp, status, xhr) {
          var links = self.links;
          var newLinks = self.parseLinks(resp, _extend({xhr: xhr}, options));
          if (newLinks.first) links[self.state.firstPage] = newLinks.first;
          if (newLinks.prev) links[currentPage - 1] = newLinks.prev;
          if (newLinks.next) links[currentPage + 1] = newLinks.next;
          if (success) success(resp, status, xhr);
        };
      }

      return (BBColProto.sync || Backbone.sync).call(self, method, model, options);
    },

    /**
       Parse pagination links from the server response. Only valid under
       infinite mode.

       Given a response body and a XMLHttpRequest object, extract pagination
       links from them for infinite paging.

       This default implementation parses the RFC 5988 `Link` header and extract
       3 links from it - `first`, `prev`, `next`. If a `previous` link is found,
       it will be found in the `prev` key in the returned object hash. Any
       subclasses overriding this method __must__ return an object hash having
       only the keys above. If `first` is missing, the collection's default URL
       is assumed to be the `first` URL. If `prev` or `next` is missing, it is
       assumed to be `null`. An empty object hash must be returned if there are
       no links found. If either the response or the header contains information
       pertaining to the total number of records on the server, #state.totalRecords
       must be set to that number. The default implementation uses the `last`
       link from the header to calculate it.

       @param {*} resp The deserialized response body.
       @param {Object} [options]
       @param {XMLHttpRequest} [options.xhr] The XMLHttpRequest object for this
       response.
       @return {Object}
    */
    parseLinks: function (resp, options) {
      var links = {};
      var linkHeader = options.xhr.getResponseHeader("Link");
      if (linkHeader) {
        var relations = ["first", "prev", "previous", "next", "last"];
        _each(linkHeader.split(","), function (linkValue) {
          var linkParts = linkValue.split(";");
          var url = linkParts[0].replace(URL_TRIM_RE, '');
          var params = linkParts.slice(1);
          _each(params, function (param) {
            var paramParts = param.split("=");
            var key = paramParts[0].replace(PARAM_TRIM_RE, '');
            var value = paramParts[1].replace(PARAM_TRIM_RE, '');
            if (key == "rel" && _contains(relations, value)) {
              if (value == "previous") links.prev = url;
              else links[value] = url;
            }
          });
        });

        var last = links.last || '', qsi, qs;
        if (qs = (qsi = last.indexOf('?')) ? last.slice(qsi + 1) : '') {
          var params = queryStringToParams(qs);

          var state = _clone(this.state);
          var queryParams = this.queryParams;
          var pageSize = state.pageSize;

          var totalRecords = params[queryParams.totalRecords] * 1;
          var pageNum = params[queryParams.currentPage] * 1;
          var totalPages = params[queryParams.totalPages];

          if (!totalRecords) {
            if (pageNum) totalRecords = (state.firstPage === 0 ?
                                         pageNum + 1 :
                                         pageNum) * pageSize;
            else if (totalPages) totalRecords = totalPages * pageSize;
          }

          if (totalRecords) state.totalRecords = totalRecords;

          this.state = this._checkState(state);
        }
      }

      delete links.last;

      return links;
    },

    /**
       Parse server response data.

       This default implementation assumes the response data is in one of two
       structures:

           [
             {}, // Your new pagination state
             [{}, ...] // An array of JSON objects
           ]

       Or,

           [{}] // An array of JSON objects

       The first structure is the preferred form because the pagination states
       may have been updated on the server side, sending them down again allows
       this collection to update its states. If the response has a pagination
       state object, it is checked for errors.

       The second structure is the
       [Backbone.Collection#parse](http://backbonejs.org/#Collection-parse)
       default.

       **Note:** this method has been further simplified since 1.1.7. While
       existing #parse implementations will continue to work, new code is
       encouraged to override #parseState and #parseRecords instead.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} the options for the ajax request

       @return {Array.<Object>} An array of model objects
    */
    parse: function (resp, options) {
      var newState = this.parseState(resp, _clone(this.queryParams), _clone(this.state), options);
      if (newState) this.state = this._checkState(_extend({}, this.state, newState));
      return this.parseRecords(resp, options);
    },

    /**
       Parse server response for server pagination state updates.

       This default implementation first checks whether the response has any
       state object as documented in #parse. If it exists, a state object is
       returned by mapping the server state keys to this pageable collection
       instance's query parameter keys using `queryParams`.

       It is __NOT__ neccessary to return a full state object complete with all
       the mappings defined in #queryParams. Any state object resulted is merged
       with a copy of the current pageable collection state and checked for
       sanity before actually updating. Most of the time, simply providing a new
       `totalRecords` value is enough to trigger a full pagination state
       recalculation.

           parseState: function (resp, queryParams, state, options) {
             return {totalRecords: resp.total_entries};
           }

       If you want to use header fields use:

           parseState: function (resp, queryParams, state, options) {
               return {totalRecords: options.xhr.getResponseHeader("X-total")};
           }

       This method __MUST__ return a new state object instead of directly
       modifying the #state object. The behavior of directly modifying #state is
       undefined.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} queryParams A copy of #queryParams.
       @param {Object} state A copy of #state.
       @param {Object} [options] The options passed through from
       `parse`. (backbone >= 0.9.10 only)

       @return {Object} A new (partial) state object.
     */
    parseState: function (resp, queryParams, state, options) {
      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {

        var newState = _clone(state);
        var serverState = resp[0];

        _each(_pairs(_omit(queryParams, "directions")), function (kvp) {
          var k = kvp[0], v = kvp[1];
          var serverVal = serverState[v];
          if (!_isUndefined(serverVal) && !_.isNull(serverVal)) newState[k] = serverState[v];
        });

        if (serverState.order) {
          newState.order = _invert(queryParams.directions)[serverState.order] * 1;
        }

        return newState;
      }
    },

    /**
       Parse server response for an array of model objects.

       This default implementation first checks whether the response has any
       state object as documented in #parse. If it exists, the array of model
       objects is assumed to be the second element, otherwise the entire
       response is returned directly.

       @param {Object} resp The deserialized response data from the server.
       @param {Object} [options] The options passed through from the
       `parse`. (backbone >= 0.9.10 only)

       @return {Array.<Object>} An array of model objects
     */
    parseRecords: function (resp, options) {
      if (resp && resp.length === 2 && _isObject(resp[0]) && _isArray(resp[1])) {
        return resp[1];
      }

      return resp;
    },

    /**
       Fetch a page from the server in server mode, or all the pages in client
       mode. Under infinite mode, the current page is refetched by default and
       then reset.

       The query string is constructed by translating the current pagination
       state to your server API query parameter using #queryParams.  The current
       page will reset after fetch.

       @param {Object} [options] Accepts all
       [Backbone.Collection#fetch](http://backbonejs.org/#Collection-fetch)
       options.

       @return {XMLHttpRequest}
    */
    fetch: function (options) {

      options = options || {};

      var state = this._checkState(this.state);

      var mode = this.mode;

      if (mode == "infinite" && !options.url) {
        options.url = this.links[state.currentPage];
      }

      var data = options.data || {};

      // dedup query params
      var url = _result(options, "url") || _result(this, "url") || '';
      var qsi = url.indexOf('?');
      if (qsi != -1) {
        _extend(data, queryStringToParams(url.slice(qsi + 1)));
        url = url.slice(0, qsi);
      }

      options.url = url;
      options.data = data;

      // map params except directions
      var queryParams = this.mode == "client" ?
        _pick(this.queryParams, "sortKey", "order") :
        _omit(_pick(this.queryParams, _keys(PageableProto.queryParams)),
              "directions");

      var i, kvp, k, v, kvps = _pairs(queryParams), thisCopy = _clone(this);
      for (i = 0; i < kvps.length; i++) {
        kvp = kvps[i], k = kvp[0], v = kvp[1];
        v = _isFunction(v) ? v.call(thisCopy) : v;
        if (state[k] != null && v != null) {
          data[v] = state[k];
        }
      }

      // fix up sorting parameters
      if (state.sortKey && state.order) {
        data[queryParams.order] = this.queryParams.directions[state.order + ""];
      }
      else if (!state.sortKey) delete data[queryParams.order];

      // map extra query parameters
      var extraKvps = _pairs(_omit(this.queryParams,
                                   _keys(PageableProto.queryParams)));
      for (i = 0; i < extraKvps.length; i++) {
        kvp = extraKvps[i];
        v = kvp[1];
        v = _isFunction(v) ? v.call(thisCopy) : v;
        if (v != null) data[kvp[0]] = v;
      }

      if (mode != "server") {
        var self = this, fullCol = this.fullCollection;
        var success = options.success;
        options.success = function (col, resp, opts) {

          // make sure the caller's intent is obeyed
          opts = opts || {};
          if (_isUndefined(options.silent)) delete opts.silent;
          else opts.silent = options.silent;

          var models = col.models;
          if (mode == "client") fullCol.reset(models, opts);
          else fullCol.add(models, _extend({at: fullCol.length}, opts));

          if (success) success(col, resp, opts);
        };

        // silent the first reset from backbone
        return BBColProto.fetch.call(self, _extend({}, options, {silent: true}));
      }

      return BBColProto.fetch.call(this, options);
    },

    /**
       Convenient method for making a `comparator` sorted by a model attribute
       identified by `sortKey` and ordered by `order`.

       Like a Backbone.Collection, a Backbone.PageableCollection will maintain
       the __current page__ in sorted order on the client side if a `comparator`
       is attached to it. If the collection is in client mode, you can attach a
       comparator to #fullCollection to have all the pages reflect the global
       sorting order by specifying an option `full` to `true`. You __must__ call
       `sort` manually or #fullCollection.sort after calling this method to
       force a resort.

       While you can use this method to sort the current page in server mode,
       the sorting order may not reflect the global sorting order due to the
       additions or removals of the records on the server since the last
       fetch. If you want the most updated page in a global sorting order, it is
       recommended that you set #state.sortKey and optionally #state.order, and
       then call #fetch.

       @protected

       @param {string} [sortKey=this.state.sortKey] See `state.sortKey`.
       @param {number} [order=this.state.order] See `state.order`.
       @param {(function(Backbone.Model, string): Object) | string} [sortValue] See #setSorting.

       See [Backbone.Collection.comparator](http://backbonejs.org/#Collection-comparator).
    */
    _makeComparator: function (sortKey, order, sortValue) {
      var state = this.state;

      sortKey = sortKey || state.sortKey;
      order = order || state.order;

      if (!sortKey || !order) return;

      if (!sortValue) sortValue = function (model, attr) {
        return model.get(attr);
      };

      return function (left, right) {
        var l = sortValue(left, sortKey), r = sortValue(right, sortKey), t;
        if (order === 1) t = l, l = r, r = t;
        if (l === r) return 0;
        else if (l < r) return -1;
        return 1;
      };
    },

    /**
       Adjusts the sorting for this pageable collection.

       Given a `sortKey` and an `order`, sets `state.sortKey` and
       `state.order`. A comparator can be applied on the client side to sort in
       the order defined if `options.side` is `"client"`. By default the
       comparator is applied to the #fullCollection. Set `options.full` to
       `false` to apply a comparator to the current page under any mode. Setting
       `sortKey` to `null` removes the comparator from both the current page and
       the full collection.

       If a `sortValue` function is given, it will be passed the `(model,
       sortKey)` arguments and is used to extract a value from the model during
       comparison sorts. If `sortValue` is not given, `model.get(sortKey)` is
       used for sorting.

       @chainable

       @param {string} sortKey See `state.sortKey`.
       @param {number} [order=this.state.order] See `state.order`.
       @param {Object} [options]
       @param {"server"|"client"} [options.side] By default, `"client"` if
       `mode` is `"client"`, `"server"` otherwise.
       @param {boolean} [options.full=true]
       @param {(function(Backbone.Model, string): Object) | string} [options.sortValue]
    */
    setSorting: function (sortKey, order, options) {

      var state = this.state;

      state.sortKey = sortKey;
      state.order = order = order || state.order;

      var fullCollection = this.fullCollection;

      var delComp = false, delFullComp = false;

      if (!sortKey) delComp = delFullComp = true;

      var mode = this.mode;
      options = _extend({side: mode == "client" ? mode : "server", full: true},
                        options);

      var comparator = this._makeComparator(sortKey, order, options.sortValue);

      var full = options.full, side = options.side;

      if (side == "client") {
        if (full) {
          if (fullCollection) fullCollection.comparator = comparator;
          delComp = true;
        }
        else {
          this.comparator = comparator;
          delFullComp = true;
        }
      }
      else if (side == "server" && !full) {
        this.comparator = comparator;
      }

      if (delComp) this.comparator = null;
      if (delFullComp && fullCollection) fullCollection.comparator = null;

      return this;
    }

  });

  var PageableProto = PageableCollection.prototype;

  return PageableCollection;

}));

});
require.register("wyuenho-backgrid/lib/backgrid.js", function(exports, require, module){
/*!
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors <wyuenho@gmail.com>
  Licensed under the MIT license.
*/

(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(module.exports,
                             require("underscore"),
                             require("backbone"));
  }
  // Browser
  else if (typeof _ !== "undefined" &&
    typeof Backbone !== "undefined") {
    factory(window, _, Backbone);
  }
}(function (root, _, Backbone) {

  "use strict";
/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

// Copyright 2009, 2010 Kristopher Michael Kowal
// https://github.com/kriskowal/es5-shim
// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
  "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
  "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
  // http://blog.stevenlevithan.com/archives/faster-trim-javascript
  // http://perfectionkills.com/whitespace-deviations/
  ws = "[" + ws + "]";
  var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
  trimEndRegexp = new RegExp(ws + ws + "*$");
  String.prototype.trim = function trim() {
    if (this === undefined || this === null) {
      throw new TypeError("can't convert " + this + " to object");
    }
    return String(this)
      .replace(trimBeginRegexp, "")
      .replace(trimEndRegexp, "");
  };
}

function lpad(str, length, padstr) {
  var paddingLen = length - (str + '').length;
  paddingLen =  paddingLen < 0 ? 0 : paddingLen;
  var padding = '';
  for (var i = 0; i < paddingLen; i++) {
    padding = padding + padstr;
  }
  return padding + str;
}

var $ = Backbone.$;

var Backgrid = root.Backgrid = {

  VERSION: "0.3.0",

  Extension: {},

  resolveNameToClass: function (name, suffix) {
    if (_.isString(name)) {
      var key = _.map(name.split('-'), function (e) {
        return e.slice(0, 1).toUpperCase() + e.slice(1);
      }).join('') + suffix;
      var klass = Backgrid[key] || Backgrid.Extension[key];
      if (_.isUndefined(klass)) {
        throw new ReferenceError("Class '" + key + "' not found");
      }
      return klass;
    }

    return name;
  },

  callByNeed: function () {
    var value = arguments[0];
    if (!_.isFunction(value)) return value;

    var context = arguments[1];
    var args = [].slice.call(arguments, 2);
    return value.apply(context, !!(args + '') ? args : void 0);
  }

};
_.extend(Backgrid, Backbone.Events);

/**
   Command translates a DOM Event into commands that Backgrid
   recognizes. Interested parties can listen on selected Backgrid events that
   come with an instance of this class and act on the commands.

   It is also possible to globally rebind the keyboard shortcuts by replacing
   the methods in this class' prototype.

   @class Backgrid.Command
   @constructor
 */
var Command = Backgrid.Command = function (evt) {
  _.extend(this, {
    altKey: !!evt.altKey,
    "char": evt["char"],
    charCode: evt.charCode,
    ctrlKey: !!evt.ctrlKey,
    key: evt.key,
    keyCode: evt.keyCode,
    locale: evt.locale,
    location: evt.location,
    metaKey: !!evt.metaKey,
    repeat: !!evt.repeat,
    shiftKey: !!evt.shiftKey,
    which: evt.which
  });
};
_.extend(Command.prototype, {
  /**
     Up Arrow

     @member Backgrid.Command
   */
  moveUp: function () { return this.keyCode == 38; },
  /**
     Down Arrow

     @member Backgrid.Command
   */
  moveDown: function () { return this.keyCode === 40; },
  /**
     Shift Tab

     @member Backgrid.Command
   */
  moveLeft: function () { return this.shiftKey && this.keyCode === 9; },
  /**
     Tab

     @member Backgrid.Command
   */
  moveRight: function () { return !this.shiftKey && this.keyCode === 9; },
  /**
     Enter

     @member Backgrid.Command
   */
  save: function () { return this.keyCode === 13; },
  /**
     Esc

     @member Backgrid.Command
   */
  cancel: function () { return this.keyCode === 27; },
  /**
     None of the above.

     @member Backgrid.Command
   */
  passThru: function () {
    return !(this.moveUp() || this.moveDown() || this.moveLeft() ||
             this.moveRight() || this.save() || this.cancel());
  }
});


/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

/**
   Just a convenient class for interested parties to subclass.

   The default Cell classes don't require the formatter to be a subclass of
   Formatter as long as the fromRaw(rawData) and toRaw(formattedData) methods
   are defined.

   @abstract
   @class Backgrid.CellFormatter
   @constructor
*/
var CellFormatter = Backgrid.CellFormatter = function () {};
_.extend(CellFormatter.prototype, {

  /**
     Takes a raw value from a model and returns an optionally formatted string
     for display. The default implementation simply returns the supplied value
     as is without any type conversion.

     @member Backgrid.CellFormatter
     @param {*} rawData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {*}
  */
  fromRaw: function (rawData, model) {
    return rawData;
  },

  /**
     Takes a formatted string, usually from user input, and returns a
     appropriately typed value for persistence in the model.

     If the user input is invalid or unable to be converted to a raw value
     suitable for persistence in the model, toRaw must return `undefined`.

     @member Backgrid.CellFormatter
     @param {string} formattedData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {*|undefined}
  */
  toRaw: function (formattedData, model) {
    return formattedData;
  }

});

/**
   A floating point number formatter. Doesn't understand scientific notation at
   the moment.

   @class Backgrid.NumberFormatter
   @extends Backgrid.CellFormatter
   @constructor
   @throws {RangeError} If decimals < 0 or > 20.
*/
var NumberFormatter = Backgrid.NumberFormatter = function (options) {
  _.extend(this, this.defaults, options || {});

  if (this.decimals < 0 || this.decimals > 20) {
    throw new RangeError("decimals must be between 0 and 20");
  }
};
NumberFormatter.prototype = new CellFormatter();
_.extend(NumberFormatter.prototype, {

  /**
     @member Backgrid.NumberFormatter
     @cfg {Object} options

     @cfg {number} [options.decimals=2] Number of decimals to display. Must be an integer.

     @cfg {string} [options.decimalSeparator='.'] The separator to use when
     displaying decimals.

     @cfg {string} [options.orderSeparator=','] The separator to use to
     separator thousands. May be an empty string.
   */
  defaults: {
    decimals: 2,
    decimalSeparator: '.',
    orderSeparator: ','
  },

  HUMANIZED_NUM_RE: /(\d)(?=(?:\d{3})+$)/g,

  /**
     Takes a floating point number and convert it to a formatted string where
     every thousand is separated by `orderSeparator`, with a `decimal` number of
     decimals separated by `decimalSeparator`. The number returned is rounded
     the usual way.

     @member Backgrid.NumberFormatter
     @param {number} number
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string}
  */
  fromRaw: function (number, model) {
    if (_.isNull(number) || _.isUndefined(number)) return '';

    number = number.toFixed(~~this.decimals);

    var parts = number.split('.');
    var integerPart = parts[0];
    var decimalPart = parts[1] ? (this.decimalSeparator || '.') + parts[1] : '';

    return integerPart.replace(this.HUMANIZED_NUM_RE, '$1' + this.orderSeparator) + decimalPart;
  },

  /**
     Takes a string, possibly formatted with `orderSeparator` and/or
     `decimalSeparator`, and convert it back to a number.

     @member Backgrid.NumberFormatter
     @param {string} formattedData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {number|undefined} Undefined if the string cannot be converted to
     a number.
  */
  toRaw: function (formattedData, model) {
    formattedData = formattedData.trim();

    if (formattedData === '') return null;

    var rawData = '';

    var thousands = formattedData.split(this.orderSeparator);
    for (var i = 0; i < thousands.length; i++) {
      rawData += thousands[i];
    }

    var decimalParts = rawData.split(this.decimalSeparator);
    rawData = '';
    for (var i = 0; i < decimalParts.length; i++) {
      rawData = rawData + decimalParts[i] + '.';
    }

    if (rawData[rawData.length - 1] === '.') {
      rawData = rawData.slice(0, rawData.length - 1);
    }

    var result = (rawData * 1).toFixed(~~this.decimals) * 1;
    if (_.isNumber(result) && !_.isNaN(result)) return result;
  }

});

/**
   Formatter to converts between various datetime formats.

   This class only understands ISO-8601 formatted datetime strings and UNIX
   offset (number of milliseconds since UNIX Epoch). See
   Backgrid.Extension.MomentFormatter if you need a much more flexible datetime
   formatter.

   @class Backgrid.DatetimeFormatter
   @extends Backgrid.CellFormatter
   @constructor
   @throws {Error} If both `includeDate` and `includeTime` are false.
*/
var DatetimeFormatter = Backgrid.DatetimeFormatter = function (options) {
  _.extend(this, this.defaults, options || {});

  if (!this.includeDate && !this.includeTime) {
    throw new Error("Either includeDate or includeTime must be true");
  }
};
DatetimeFormatter.prototype = new CellFormatter();
_.extend(DatetimeFormatter.prototype, {

  /**
     @member Backgrid.DatetimeFormatter

     @cfg {Object} options

     @cfg {boolean} [options.includeDate=true] Whether the values include the
     date part.

     @cfg {boolean} [options.includeTime=true] Whether the values include the
     time part.

     @cfg {boolean} [options.includeMilli=false] If `includeTime` is true,
     whether to include the millisecond part, if it exists.
   */
  defaults: {
    includeDate: true,
    includeTime: true,
    includeMilli: false
  },

  DATE_RE: /^([+\-]?\d{4})-(\d{2})-(\d{2})$/,
  TIME_RE: /^(\d{2}):(\d{2}):(\d{2})(\.(\d{3}))?$/,
  ISO_SPLITTER_RE: /T|Z| +/,

  _convert: function (data, validate) {
    if ((data + '').trim() === '') return null;

    var date, time = null;
    if (_.isNumber(data)) {
      var jsDate = new Date(data);
      date = lpad(jsDate.getUTCFullYear(), 4, 0) + '-' + lpad(jsDate.getUTCMonth() + 1, 2, 0) + '-' + lpad(jsDate.getUTCDate(), 2, 0);
      time = lpad(jsDate.getUTCHours(), 2, 0) + ':' + lpad(jsDate.getUTCMinutes(), 2, 0) + ':' + lpad(jsDate.getUTCSeconds(), 2, 0);
    }
    else {
      data = data.trim();
      var parts = data.split(this.ISO_SPLITTER_RE) || [];
      date = this.DATE_RE.test(parts[0]) ? parts[0] : '';
      time = date && parts[1] ? parts[1] : this.TIME_RE.test(parts[0]) ? parts[0] : '';
    }

    var YYYYMMDD = this.DATE_RE.exec(date) || [];
    var HHmmssSSS = this.TIME_RE.exec(time) || [];

    if (validate) {
      if (this.includeDate && _.isUndefined(YYYYMMDD[0])) return;
      if (this.includeTime && _.isUndefined(HHmmssSSS[0])) return;
      if (!this.includeDate && date) return;
      if (!this.includeTime && time) return;
    }

    var jsDate = new Date(Date.UTC(YYYYMMDD[1] * 1 || 0,
                                   YYYYMMDD[2] * 1 - 1 || 0,
                                   YYYYMMDD[3] * 1 || 0,
                                   HHmmssSSS[1] * 1 || null,
                                   HHmmssSSS[2] * 1 || null,
                                   HHmmssSSS[3] * 1 || null,
                                   HHmmssSSS[5] * 1 || null));

    var result = '';

    if (this.includeDate) {
      result = lpad(jsDate.getUTCFullYear(), 4, 0) + '-' + lpad(jsDate.getUTCMonth() + 1, 2, 0) + '-' + lpad(jsDate.getUTCDate(), 2, 0);
    }

    if (this.includeTime) {
      result = result + (this.includeDate ? 'T' : '') + lpad(jsDate.getUTCHours(), 2, 0) + ':' + lpad(jsDate.getUTCMinutes(), 2, 0) + ':' + lpad(jsDate.getUTCSeconds(), 2, 0);

      if (this.includeMilli) {
        result = result + '.' + lpad(jsDate.getUTCMilliseconds(), 3, 0);
      }
    }

    if (this.includeDate && this.includeTime) {
      result += "Z";
    }

    return result;
  },

  /**
     Converts an ISO-8601 formatted datetime string to a datetime string, date
     string or a time string. The timezone is ignored if supplied.

     @member Backgrid.DatetimeFormatter
     @param {string} rawData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string|null|undefined} ISO-8601 string in UTC. Null and undefined
     values are returned as is.
  */
  fromRaw: function (rawData, model) {
    if (_.isNull(rawData) || _.isUndefined(rawData)) return '';
    return this._convert(rawData);
  },

  /**
     Converts an ISO-8601 formatted datetime string to a datetime string, date
     string or a time string. The timezone is ignored if supplied. This method
     parses the input values exactly the same way as
     Backgrid.Extension.MomentFormatter#fromRaw(), in addition to doing some
     sanity checks.

     @member Backgrid.DatetimeFormatter
     @param {string} formattedData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string|undefined} ISO-8601 string in UTC. Undefined if a date is
     found when `includeDate` is false, or a time is found when `includeTime` is
     false, or if `includeDate` is true and a date is not found, or if
     `includeTime` is true and a time is not found.
  */
  toRaw: function (formattedData, model) {
    return this._convert(formattedData, true);
  }

});

/**
   Formatter to convert any value to string.

   @class Backgrid.StringFormatter
   @extends Backgrid.CellFormatter
   @constructor
 */
var StringFormatter = Backgrid.StringFormatter = function () {};
StringFormatter.prototype = new CellFormatter();
_.extend(StringFormatter.prototype, {
  /**
     Converts any value to a string using Ecmascript's implicit type
     conversion. If the given value is `null` or `undefined`, an empty string is
     returned instead.

     @member Backgrid.StringFormatter
     @param {*} rawValue
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string}
   */
  fromRaw: function (rawValue, model) {
    if (_.isUndefined(rawValue) || _.isNull(rawValue)) return '';
    return rawValue + '';
  }
});

/**
   Simple email validation formatter.

   @class Backgrid.EmailFormatter
   @extends Backgrid.CellFormatter
   @constructor
 */
var EmailFormatter = Backgrid.EmailFormatter = function () {};
EmailFormatter.prototype = new CellFormatter();
_.extend(EmailFormatter.prototype, {
  /**
     Return the input if it is a string that contains an '@' character and if
     the strings before and after '@' are non-empty. If the input does not
     validate, `undefined` is returned.

     @member Backgrid.EmailFormatter
     @param {*} formattedData
     @param {Backbone.Model} model Used for more complicated formatting
     @return {string|undefined}
   */
  toRaw: function (formattedData, model) {
    var parts = formattedData.trim().split("@");
    if (parts.length === 2 && _.all(parts)) {
      return formattedData;
    }
  }
});

/**
   Formatter for SelectCell.

   @class Backgrid.SelectFormatter
   @extends Backgrid.CellFormatter
   @constructor
*/
var SelectFormatter = Backgrid.SelectFormatter = function () {};
SelectFormatter.prototype = new CellFormatter();
_.extend(SelectFormatter.prototype, {

  /**
     Normalizes raw scalar or array values to an array.

     @member Backgrid.SelectFormatter
     @param {*} rawValue
     @param {Backbone.Model} model Used for more complicated formatting
     @return {Array.<*>}
  */
  fromRaw: function (rawValue, model) {
    return _.isArray(rawValue) ? rawValue : rawValue != null ? [rawValue] : [];
  }
});


/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

/**
   Generic cell editor base class. Only defines an initializer for a number of
   required parameters.

   @abstract
   @class Backgrid.CellEditor
   @extends Backbone.View
*/
var CellEditor = Backgrid.CellEditor = Backbone.View.extend({

  /**
     Initializer.

     @param {Object} options
     @param {Backgrid.CellFormatter} options.formatter
     @param {Backgrid.Column} options.column
     @param {Backbone.Model} options.model

     @throws {TypeError} If `formatter` is not a formatter instance, or when
     `model` or `column` are undefined.
  */
  initialize: function (options) {
    this.formatter = options.formatter;
    this.column = options.column;
    if (!(this.column instanceof Column)) {
      this.column = new Column(this.column);
    }

    this.listenTo(this.model, "backgrid:editing", this.postRender);
  },

  /**
     Post-rendering setup and initialization. Focuses the cell editor's `el` in
     this default implementation. **Should** be called by Cell classes after
     calling Backgrid.CellEditor#render.
  */
  postRender: function (model, column) {
    if (column == null || column.get("name") == this.column.get("name")) {
      this.$el.focus();
    }
    return this;
  }

});

/**
   InputCellEditor the cell editor type used by most core cell types. This cell
   editor renders a text input box as its editor. The input will render a
   placeholder if the value is empty on supported browsers.

   @class Backgrid.InputCellEditor
   @extends Backgrid.CellEditor
*/
var InputCellEditor = Backgrid.InputCellEditor = CellEditor.extend({

  /** @property */
  tagName: "input",

  /** @property */
  attributes: {
    type: "text"
  },

  /** @property */
  events: {
    "blur": "saveOrCancel",
    "keydown": "saveOrCancel"
  },

  /**
     Initializer. Removes this `el` from the DOM when a `done` event is
     triggered.

     @param {Object} options
     @param {Backgrid.CellFormatter} options.formatter
     @param {Backgrid.Column} options.column
     @param {Backbone.Model} options.model
     @param {string} [options.placeholder]
  */
  initialize: function (options) {
    InputCellEditor.__super__.initialize.apply(this, arguments);

    if (options.placeholder) {
      this.$el.attr("placeholder", options.placeholder);
    }
  },

  /**
     Renders a text input with the cell value formatted for display, if it
     exists.
  */
  render: function () {
    var model = this.model
    this.$el.val(this.formatter.fromRaw(model.get(this.column.get("name")), model));
    return this;
  },

  /**
     If the key pressed is `enter`, `tab`, `up`, or `down`, converts the value
     in the editor to a raw value for saving into the model using the formatter.

     If the key pressed is `esc` the changes are undone.

     If the editor goes out of focus (`blur`) but the value is invalid, the
     event is intercepted and cancelled so the cell remains in focus pending for
     further action. The changes are saved otherwise.

     Triggers a Backbone `backgrid:edited` event from the model when successful,
     and `backgrid:error` if the value cannot be converted. Classes listening to
     the `error` event, usually the Cell classes, should respond appropriately,
     usually by rendering some kind of error feedback.

     @param {Event} e
  */
  saveOrCancel: function (e) {

    var formatter = this.formatter;
    var model = this.model;
    var column = this.column;

    var command = new Command(e);
    var blurred = e.type === "blur";

    if (command.moveUp() || command.moveDown() || command.moveLeft() || command.moveRight() ||
        command.save() || blurred) {

      e.preventDefault();
      e.stopPropagation();

      var val = this.$el.val();
      var newValue = formatter.toRaw(val, model);
      if (_.isUndefined(newValue)) {
        model.trigger("backgrid:error", model, column, val);
      }
      else {
        model.set(column.get("name"), newValue);
        model.trigger("backgrid:edited", model, column, command);
      }
    }
    // esc
    else if (command.cancel()) {
      // undo
      e.stopPropagation();
      model.trigger("backgrid:edited", model, column, command);
    }
  },

  postRender: function (model, column) {
    if (column == null || column.get("name") == this.column.get("name")) {
      // move the cursor to the end on firefox if text is right aligned
      if (this.$el.css("text-align") === "right") {
        var val = this.$el.val();
        this.$el.focus().val(null).val(val);
      }
      else this.$el.focus();
    }
    return this;
  }

});

/**
   The super-class for all Cell types. By default, this class renders a plain
   table cell with the model value converted to a string using the
   formatter. The table cell is clickable, upon which the cell will go into
   editor mode, which is rendered by a Backgrid.InputCellEditor instance by
   default. Upon encountering any formatting errors, this class will add an
   `error` CSS class to the table cell.

   @abstract
   @class Backgrid.Cell
   @extends Backbone.View
*/
var Cell = Backgrid.Cell = Backbone.View.extend({

  /** @property */
  tagName: "td",

  /**
     @property {Backgrid.CellFormatter|Object|string} [formatter=CellFormatter]
  */
  formatter: CellFormatter,

  /**
     @property {Backgrid.CellEditor} [editor=Backgrid.InputCellEditor] The
     default editor for all cell instances of this class. This value must be a
     class, it will be automatically instantiated upon entering edit mode.

     See Backgrid.CellEditor
  */
  editor: InputCellEditor,

  /** @property */
  events: {
    "click": "enterEditMode"
  },

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column

     @throws {ReferenceError} If formatter is a string but a formatter class of
     said name cannot be found in the Backgrid module.
  */
  initialize: function (options) {
    this.column = options.column;
    if (!(this.column instanceof Column)) {
      this.column = new Column(this.column);
    }

    var column = this.column, model = this.model, $el = this.$el;

    var formatter = Backgrid.resolveNameToClass(column.get("formatter") ||
                                                this.formatter, "Formatter");

    if (!_.isFunction(formatter.fromRaw) && !_.isFunction(formatter.toRaw)) {
      formatter = new formatter();
    }

    this.formatter = formatter;

    this.editor = Backgrid.resolveNameToClass(this.editor, "CellEditor");

    this.listenTo(model, "change:" + column.get("name"), function () {
      if (!$el.hasClass("editor")) this.render();
    });

    this.listenTo(model, "backgrid:error", this.renderError);

    this.listenTo(column, "change:editable change:sortable change:renderable",
                  function (column) {
                    var changed = column.changedAttributes();
                    for (var key in changed) {
                      if (changed.hasOwnProperty(key)) {
                        $el.toggleClass(key, changed[key]);
                      }
                    }
                  });

    if (column.get("editable")) $el.addClass("editable");
    if (column.get("sortable")) $el.addClass("sortable");
    if (column.get("renderable")) $el.addClass("renderable");
  },

  /**
     Render a text string in a table cell. The text is converted from the
     model's raw value for this cell's column.
  */
  render: function () {
    this.$el.empty();
    var model = this.model;
    this.$el.text(this.formatter.fromRaw(model.get(this.column.get("name")), model));
    this.delegateEvents();
    return this;
  },

  /**
     If this column is editable, a new CellEditor instance is instantiated with
     its required parameters. An `editor` CSS class is added to the cell upon
     entering edit mode.

     This method triggers a Backbone `backgrid:edit` event from the model when
     the cell is entering edit mode and an editor instance has been constructed,
     but before it is rendered and inserted into the DOM. The cell and the
     constructed cell editor instance are sent as event parameters when this
     event is triggered.

     When this cell has finished switching to edit mode, a Backbone
     `backgrid:editing` event is triggered from the model. The cell and the
     constructed cell instance are also sent as parameters in the event.

     When the model triggers a `backgrid:error` event, it means the editor is
     unable to convert the current user input to an apprpriate value for the
     model's column, and an `error` CSS class is added to the cell accordingly.
  */
  enterEditMode: function () {
    var model = this.model;
    var column = this.column;

    var editable = Backgrid.callByNeed(column.editable(), column, model);
    if (editable) {

      this.currentEditor = new this.editor({
        column: this.column,
        model: this.model,
        formatter: this.formatter
      });

      model.trigger("backgrid:edit", model, column, this, this.currentEditor);

      // Need to redundantly undelegate events for Firefox
      this.undelegateEvents();
      this.$el.empty();
      this.$el.append(this.currentEditor.$el);
      this.currentEditor.render();
      this.$el.addClass("editor");

      model.trigger("backgrid:editing", model, column, this, this.currentEditor);
    }
  },

  /**
     Put an `error` CSS class on the table cell.
  */
  renderError: function (model, column) {
    if (column == null || column.get("name") == this.column.get("name")) {
      this.$el.addClass("error");
    }
  },

  /**
     Removes the editor and re-render in display mode.
  */
  exitEditMode: function () {
    this.$el.removeClass("error");
    this.currentEditor.remove();
    this.stopListening(this.currentEditor);
    delete this.currentEditor;
    this.$el.removeClass("editor");
    this.render();
  },

  /**
     Clean up this cell.

     @chainable
  */
  remove: function () {
    if (this.currentEditor) {
      this.currentEditor.remove.apply(this.currentEditor, arguments);
      delete this.currentEditor;
    }
    return Cell.__super__.remove.apply(this, arguments);
  }

});

/**
   StringCell displays HTML escaped strings and accepts anything typed in.

   @class Backgrid.StringCell
   @extends Backgrid.Cell
*/
var StringCell = Backgrid.StringCell = Cell.extend({

  /** @property */
  className: "string-cell",

  formatter: StringFormatter

});

/**
   UriCell renders an HTML `<a>` anchor for the value and accepts URIs as user
   input values. No type conversion or URL validation is done by the formatter
   of this cell. Users who need URL validation are encourage to subclass UriCell
   to take advantage of the parsing capabilities of the HTMLAnchorElement
   available on HTML5-capable browsers or using a third-party library like
   [URI.js](https://github.com/medialize/URI.js).

   @class Backgrid.UriCell
   @extends Backgrid.Cell
*/
var UriCell = Backgrid.UriCell = Cell.extend({

  /** @property */
  className: "uri-cell",

  /**
     @property {string} [title] The title attribute of the generated anchor. It
     uses the display value formatted by the `formatter.fromRaw` by default.
  */
  title: null,

  /**
     @property {string} [target="_blank"] The target attribute of the generated
     anchor.
  */
  target: "_blank",

  initialize: function (options) {
    UriCell.__super__.initialize.apply(this, arguments);
    this.title = options.title || this.title;
    this.target = options.target || this.target;
  },

  render: function () {
    this.$el.empty();
    var rawValue = this.model.get(this.column.get("name"));
    var formattedValue = this.formatter.fromRaw(rawValue, this.model);
    this.$el.append($("<a>", {
      tabIndex: -1,
      href: rawValue,
      title: this.title || formattedValue,
      target: this.target,
    }).text(formattedValue));
    this.delegateEvents();
    return this;
  }

});

/**
   Like Backgrid.UriCell, EmailCell renders an HTML `<a>` anchor for the
   value. The `href` in the anchor is prefixed with `mailto:`. EmailCell will
   complain if the user enters a string that doesn't contain the `@` sign.

   @class Backgrid.EmailCell
   @extends Backgrid.StringCell
*/
var EmailCell = Backgrid.EmailCell = StringCell.extend({

  /** @property */
  className: "email-cell",

  formatter: EmailFormatter,

  render: function () {
    this.$el.empty();
    var model = this.model;
    var formattedValue = this.formatter.fromRaw(model.get(this.column.get("name")), model);
    this.$el.append($("<a>", {
      tabIndex: -1,
      href: "mailto:" + formattedValue,
      title: formattedValue
    }).text(formattedValue));
    this.delegateEvents();
    return this;
  }

});

/**
   NumberCell is a generic cell that renders all numbers. Numbers are formatted
   using a Backgrid.NumberFormatter.

   @class Backgrid.NumberCell
   @extends Backgrid.Cell
*/
var NumberCell = Backgrid.NumberCell = Cell.extend({

  /** @property */
  className: "number-cell",

  /**
     @property {number} [decimals=2] Must be an integer.
  */
  decimals: NumberFormatter.prototype.defaults.decimals,

  /** @property {string} [decimalSeparator='.'] */
  decimalSeparator: NumberFormatter.prototype.defaults.decimalSeparator,

  /** @property {string} [orderSeparator=','] */
  orderSeparator: NumberFormatter.prototype.defaults.orderSeparator,

  /** @property {Backgrid.CellFormatter} [formatter=Backgrid.NumberFormatter] */
  formatter: NumberFormatter,

  /**
     Initializes this cell and the number formatter.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column
  */
  initialize: function (options) {
    NumberCell.__super__.initialize.apply(this, arguments);
    var formatter = this.formatter;
    formatter.decimals = this.decimals;
    formatter.decimalSeparator = this.decimalSeparator;
    formatter.orderSeparator = this.orderSeparator;
  }

});

/**
   An IntegerCell is just a Backgrid.NumberCell with 0 decimals. If a floating
   point number is supplied, the number is simply rounded the usual way when
   displayed.

   @class Backgrid.IntegerCell
   @extends Backgrid.NumberCell
*/
var IntegerCell = Backgrid.IntegerCell = NumberCell.extend({

  /** @property */
  className: "integer-cell",

  /**
     @property {number} decimals Must be an integer.
  */
  decimals: 0
});

/**
   DatetimeCell is a basic cell that accepts datetime string values in RFC-2822
   or W3C's subset of ISO-8601 and displays them in ISO-8601 format. For a much
   more sophisticated date time cell with better datetime formatting, take a
   look at the Backgrid.Extension.MomentCell extension.

   @class Backgrid.DatetimeCell
   @extends Backgrid.Cell

   See:

   - Backgrid.Extension.MomentCell
   - Backgrid.DatetimeFormatter
*/
var DatetimeCell = Backgrid.DatetimeCell = Cell.extend({

  /** @property */
  className: "datetime-cell",

  /**
     @property {boolean} [includeDate=true]
  */
  includeDate: DatetimeFormatter.prototype.defaults.includeDate,

  /**
     @property {boolean} [includeTime=true]
  */
  includeTime: DatetimeFormatter.prototype.defaults.includeTime,

  /**
     @property {boolean} [includeMilli=false]
  */
  includeMilli: DatetimeFormatter.prototype.defaults.includeMilli,

  /** @property {Backgrid.CellFormatter} [formatter=Backgrid.DatetimeFormatter] */
  formatter: DatetimeFormatter,

  /**
     Initializes this cell and the datetime formatter.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column
  */
  initialize: function (options) {
    DatetimeCell.__super__.initialize.apply(this, arguments);
    var formatter = this.formatter;
    formatter.includeDate = this.includeDate;
    formatter.includeTime = this.includeTime;
    formatter.includeMilli = this.includeMilli;

    var placeholder = this.includeDate ? "YYYY-MM-DD" : "";
    placeholder += (this.includeDate && this.includeTime) ? "T" : "";
    placeholder += this.includeTime ? "HH:mm:ss" : "";
    placeholder += (this.includeTime && this.includeMilli) ? ".SSS" : "";

    this.editor = this.editor.extend({
      attributes: _.extend({}, this.editor.prototype.attributes, this.editor.attributes, {
        placeholder: placeholder
      })
    });
  }

});

/**
   DateCell is a Backgrid.DatetimeCell without the time part.

   @class Backgrid.DateCell
   @extends Backgrid.DatetimeCell
*/
var DateCell = Backgrid.DateCell = DatetimeCell.extend({

  /** @property */
  className: "date-cell",

  /** @property */
  includeTime: false

});

/**
   TimeCell is a Backgrid.DatetimeCell without the date part.

   @class Backgrid.TimeCell
   @extends Backgrid.DatetimeCell
*/
var TimeCell = Backgrid.TimeCell = DatetimeCell.extend({

  /** @property */
  className: "time-cell",

  /** @property */
  includeDate: false

});

/**
   BooleanCellEditor renders a checkbox as its editor.

   @class Backgrid.BooleanCellEditor
   @extends Backgrid.CellEditor
*/
var BooleanCellEditor = Backgrid.BooleanCellEditor = CellEditor.extend({

  /** @property */
  tagName: "input",

  /** @property */
  attributes: {
    tabIndex: -1,
    type: "checkbox"
  },

  /** @property */
  events: {
    "mousedown": function () {
      this.mouseDown = true;
    },
    "blur": "enterOrExitEditMode",
    "mouseup": function () {
      this.mouseDown = false;
    },
    "change": "saveOrCancel",
    "keydown": "saveOrCancel"
  },

  /**
     Renders a checkbox and check it if the model value of this column is true,
     uncheck otherwise.
  */
  render: function () {
    var model = this.model;
    var val = this.formatter.fromRaw(model.get(this.column.get("name")), model);
    this.$el.prop("checked", val);
    return this;
  },

  /**
     Event handler. Hack to deal with the case where `blur` is fired before
     `change` and `click` on a checkbox.
  */
  enterOrExitEditMode: function (e) {
    if (!this.mouseDown) {
      var model = this.model;
      model.trigger("backgrid:edited", model, this.column, new Command(e));
    }
  },

  /**
     Event handler. Save the value into the model if the event is `change` or
     one of the keyboard navigation key presses. Exit edit mode without saving
     if `escape` was pressed.
  */
  saveOrCancel: function (e) {
    var model = this.model;
    var column = this.column;
    var formatter = this.formatter;
    var command = new Command(e);
    // skip ahead to `change` when space is pressed
    if (command.passThru() && e.type != "change") return true;
    if (command.cancel()) {
      e.stopPropagation();
      model.trigger("backgrid:edited", model, column, command);
    }

    var $el = this.$el;
    if (command.save() || command.moveLeft() || command.moveRight() || command.moveUp() ||
        command.moveDown()) {
      e.preventDefault();
      e.stopPropagation();
      var val = formatter.toRaw($el.prop("checked"), model);
      model.set(column.get("name"), val);
      model.trigger("backgrid:edited", model, column, command);
    }
    else if (e.type == "change") {
      var val = formatter.toRaw($el.prop("checked"), model);
      model.set(column.get("name"), val);
      $el.focus();
    }
  }

});

/**
   BooleanCell renders a checkbox both during display mode and edit mode. The
   checkbox is checked if the model value is true, unchecked otherwise.

   @class Backgrid.BooleanCell
   @extends Backgrid.Cell
*/
var BooleanCell = Backgrid.BooleanCell = Cell.extend({

  /** @property */
  className: "boolean-cell",

  /** @property */
  editor: BooleanCellEditor,

  /** @property */
  events: {
    "click": "enterEditMode"
  },

  /**
     Renders a checkbox and check it if the model value of this column is true,
     uncheck otherwise.
  */
  render: function () {
    this.$el.empty();
    var model = this.model, column = this.column;
    var editable = Backgrid.callByNeed(column.editable(), column, model);
    this.$el.append($("<input>", {
      tabIndex: -1,
      type: "checkbox",
      checked: this.formatter.fromRaw(model.get(column.get("name")), model),
      disabled: !editable
    }));
    this.delegateEvents();
    return this;
  }

});

/**
   SelectCellEditor renders an HTML `<select>` fragment as the editor.

   @class Backgrid.SelectCellEditor
   @extends Backgrid.CellEditor
*/
var SelectCellEditor = Backgrid.SelectCellEditor = CellEditor.extend({

  /** @property */
  tagName: "select",

  /** @property */
  events: {
    "change": "save",
    "blur": "close",
    "keydown": "close"
  },

  /** @property {function(Object, ?Object=): string} template */
  template: _.template('<option value="<%- value %>" <%= selected ? \'selected="selected"\' : "" %>><%- text %></option>', null, {variable: null}),

  setOptionValues: function (optionValues) {
    this.optionValues = optionValues;
    this.optionValues = _.result(this, "optionValues");
  },

  setMultiple: function (multiple) {
    this.multiple = multiple;
    this.$el.prop("multiple", multiple);
  },

  _renderOptions: function (nvps, selectedValues) {
    var options = '';
    for (var i = 0; i < nvps.length; i++) {
      options = options + this.template({
        text: nvps[i][0],
        value: nvps[i][1],
        selected: selectedValues.indexOf(nvps[i][1]) > -1
      });
    }
    return options;
  },

  /**
     Renders the options if `optionValues` is a list of name-value pairs. The
     options are contained inside option groups if `optionValues` is a list of
     object hashes. The name is rendered at the option text and the value is the
     option value. If `optionValues` is a function, it is called without a
     parameter.
  */
  render: function () {
    this.$el.empty();

    var optionValues = _.result(this, "optionValues");
    var model = this.model;
    var selectedValues = this.formatter.fromRaw(model.get(this.column.get("name")), model);

    if (!_.isArray(optionValues)) throw new TypeError("optionValues must be an array");

    var optionValue = null;
    var optionText = null;
    var optionValue = null;
    var optgroupName = null;
    var optgroup = null;

    for (var i = 0; i < optionValues.length; i++) {
      var optionValue = optionValues[i];

      if (_.isArray(optionValue)) {
        optionText  = optionValue[0];
        optionValue = optionValue[1];

        this.$el.append(this.template({
          text: optionText,
          value: optionValue,
          selected: selectedValues.indexOf(optionValue) > -1
        }));
      }
      else if (_.isObject(optionValue)) {
        optgroupName = optionValue.name;
        optgroup = $("<optgroup></optgroup>", { label: optgroupName });
        optgroup.append(this._renderOptions(optionValue.values, selectedValues));
        this.$el.append(optgroup);
      }
      else {
        throw new TypeError("optionValues elements must be a name-value pair or an object hash of { name: 'optgroup label', value: [option name-value pairs] }");
      }
    }

    this.delegateEvents();

    return this;
  },

  /**
     Saves the value of the selected option to the model attribute. Triggers a
     `backgrid:edited` Backbone event from the model.
  */
  save: function (e) {
    var model = this.model;
    var column = this.column;
    model.set(column.get("name"), this.formatter.toRaw(this.$el.val(), model));
    model.trigger("backgrid:edited", model, column, new Command(e));
  },

  /**
     Triggers a `backgrid:edited` event from the model so the body can close
     this editor.
  */
  close: function (e) {
    var model = this.model;
    var column = this.column;
    var command = new Command(e);
    if (command.cancel()) {
      e.stopPropagation();
      model.trigger("backgrid:edited", model, column, new Command(e));
    }
    else if (command.save() || command.moveLeft() || command.moveRight() ||
             command.moveUp() || command.moveDown() || e.type == "blur") {
      e.preventDefault();
      e.stopPropagation();
      if (e.type == "blur" && this.$el.find("option").length === 1) {
        model.set(column.get("name"), this.formatter.toRaw(this.$el.val(), model));
      }
      model.trigger("backgrid:edited", model, column, new Command(e));
    }
  }

});

/**
   SelectCell is also a different kind of cell in that upon going into edit mode
   the cell renders a list of options to pick from, as opposed to an input box.

   SelectCell cannot be referenced by its string name when used in a column
   definition because it requires an `optionValues` class attribute to be
   defined. `optionValues` can either be a list of name-value pairs, to be
   rendered as options, or a list of object hashes which consist of a key *name*
   which is the option group name, and a key *values* which is a list of
   name-value pairs to be rendered as options under that option group.

   In addition, `optionValues` can also be a parameter-less function that
   returns one of the above. If the options are static, it is recommended the
   returned values to be memoized. `_.memoize()` is a good function to help with
   that.

   During display mode, the default formatter will normalize the raw model value
   to an array of values whether the raw model value is a scalar or an
   array. Each value is compared with the `optionValues` values using
   Ecmascript's implicit type conversion rules. When exiting edit mode, no type
   conversion is performed when saving into the model. This behavior is not
   always desirable when the value type is anything other than string. To
   control type conversion on the client-side, you should subclass SelectCell to
   provide a custom formatter or provide the formatter to your column
   definition.

   See:
     [$.fn.val()](http://api.jquery.com/val/)

   @class Backgrid.SelectCell
   @extends Backgrid.Cell
*/
var SelectCell = Backgrid.SelectCell = Cell.extend({

  /** @property */
  className: "select-cell",

  /** @property */
  editor: SelectCellEditor,

  /** @property */
  multiple: false,

  /** @property */
  formatter: SelectFormatter,

  /**
     @property {Array.<Array>|Array.<{name: string, values: Array.<Array>}>} optionValues
  */
  optionValues: undefined,

  /** @property */
  delimiter: ', ',

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Model} options.model
     @param {Backgrid.Column} options.column

     @throws {TypeError} If `optionsValues` is undefined.
  */
  initialize: function (options) {
    SelectCell.__super__.initialize.apply(this, arguments);
    this.listenTo(this.model, "backgrid:edit", function (model, column, cell, editor) {
      if (column.get("name") == this.column.get("name")) {
        editor.setOptionValues(this.optionValues);
        editor.setMultiple(this.multiple);
      }
    });
  },

  /**
     Renders the label using the raw value as key to look up from `optionValues`.

     @throws {TypeError} If `optionValues` is malformed.
  */
  render: function () {
    this.$el.empty();

    var optionValues = _.result(this, "optionValues");
    var model = this.model;
    var rawData = this.formatter.fromRaw(model.get(this.column.get("name")), model);

    var selectedText = [];

    try {
      if (!_.isArray(optionValues) || _.isEmpty(optionValues)) throw new TypeError;

      for (var k = 0; k < rawData.length; k++) {
        var rawDatum = rawData[k];

        for (var i = 0; i < optionValues.length; i++) {
          var optionValue = optionValues[i];

          if (_.isArray(optionValue)) {
            var optionText  = optionValue[0];
            var optionValue = optionValue[1];

            if (optionValue == rawDatum) selectedText.push(optionText);
          }
          else if (_.isObject(optionValue)) {
            var optionGroupValues = optionValue.values;

            for (var j = 0; j < optionGroupValues.length; j++) {
              var optionGroupValue = optionGroupValues[j];
              if (optionGroupValue[1] == rawDatum) {
                selectedText.push(optionGroupValue[0]);
              }
            }
          }
          else {
            throw new TypeError;
          }
        }
      }

      this.$el.append(selectedText.join(this.delimiter));
    }
    catch (ex) {
      if (ex instanceof TypeError) {
        throw new TypeError("'optionValues' must be of type {Array.<Array>|Array.<{name: string, values: Array.<Array>}>}");
      }
      throw ex;
    }

    this.delegateEvents();

    return this;
  }

});

/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

/**
   A Column is a placeholder for column metadata.

   You usually don't need to create an instance of this class yourself as a
   collection of column instances will be created for you from a list of column
   attributes in the Backgrid.js view class constructors.

   @class Backgrid.Column
   @extends Backbone.Model
*/
var Column = Backgrid.Column = Backbone.Model.extend({

  /**
     @cfg {Object} defaults Column defaults. To override any of these default
     values, you can either change the prototype directly to override
     Column.defaults globally or extend Column and supply the custom class to
     Backgrid.Grid:

         // Override Column defaults globally
         Column.prototype.defaults.sortable = false;

         // Override Column defaults locally
         var MyColumn = Column.extend({
           defaults: _.defaults({
             editable: false
           }, Column.prototype.defaults)
         });

         var grid = new Backgrid.Grid(columns: new Columns([{...}, {...}], {
           model: MyColumn
         }));

     @cfg {string} [defaults.name] The default name of the model attribute.

     @cfg {string} [defaults.label] The default label to show in the header.

     @cfg {string|Backgrid.Cell} [defaults.cell] The default cell type. If this
     is a string, the capitalized form will be used to look up a cell class in
     Backbone, i.e.: string => StringCell. If a Cell subclass is supplied, it is
     initialized with a hash of parameters. If a Cell instance is supplied, it
     is used directly.

     @cfg {string|Backgrid.HeaderCell} [defaults.headerCell] The default header
     cell type.

     @cfg {boolean|string} [defaults.sortable=true] Whether this column is
     sortable. If the value is a string, a method will the same name will be
     looked up from the column instance to determine whether the column should
     be sortable. The method's signature must be `function (Backgrid.Column,
     Backbone.Model): boolean`.

     @cfg {boolean|string} [defaults.editable=true] Whether this column is
     editable. If the value is a string, a method will the same name will be
     looked up from the column instance to determine whether the column should
     be editable. The method's signature must be `function (Backgrid.Column,
     Backbone.Model): boolean`.

     @cfg {boolean|string} [defaults.renderable=true] Whether this column is
     renderable. If the value is a string, a method will the same name will be
     looked up from the column instance to determine whether the column should
     be renderable. The method's signature must be `function (Backrid.Column,
     Backbone.Model): boolean`.

     @cfg {Backgrid.CellFormatter | Object | string} [defaults.formatter] The
     formatter to use to convert between raw model values and user input.

     @cfg {"toggle"|"cycle"} [defaults.sortType="cycle"] Whether sorting will
     toggle between ascending and descending order, or cycle between insertion
     order, ascending and descending order.

     @cfg {(function(Backbone.Model, string): *) | string} [defaults.sortValue]
     The function to use to extract a value from the model for comparison during
     sorting. If this value is a string, a method with the same name will be
     looked up from the column instance.

     @cfg {"ascending"|"descending"|null} [defaults.direction=null] The initial
     sorting direction for this column. The default is ordered by
     Backbone.Model.cid, which usually means the collection is ordered by
     insertion order.
  */
  defaults: {
    name: undefined,
    label: undefined,
    sortable: true,
    editable: true,
    renderable: true,
    formatter: undefined,
    sortType: "cycle",
    sortValue: undefined,
    direction: null,
    cell: undefined,
    headerCell: undefined
  },

  /**
     Initializes this Column instance.

     @param {Object} attrs

     @param {string} attrs.name The model attribute this column is responsible
     for.

     @param {string|Backgrid.Cell} attrs.cell The cell type to use to render
     this column.

     @param {string} [attrs.label]

     @param {string|Backgrid.HeaderCell} [attrs.headerCell]

     @param {boolean|string} [attrs.sortable=true]

     @param {boolean|string} [attrs.editable=true]

     @param {boolean|string} [attrs.renderable=true]

     @param {Backgrid.CellFormatter | Object | string} [attrs.formatter]

     @param {"toggle"|"cycle"}  [attrs.sortType="cycle"]

     @param {(function(Backbone.Model, string): *) | string} [attrs.sortValue]

     @throws {TypeError} If attrs.cell or attrs.options are not supplied.

     @throws {ReferenceError} If formatter is a string but a formatter class of
     said name cannot be found in the Backgrid module.

     See:

     - Backgrid.Column.defaults
     - Backgrid.Cell
     - Backgrid.CellFormatter
   */
  initialize: function (attrs) {
    if (!this.has("label")) {
      this.set({ label: this.get("name") }, { silent: true });
    }

    var headerCell = Backgrid.resolveNameToClass(this.get("headerCell"), "HeaderCell");

    var cell = Backgrid.resolveNameToClass(this.get("cell"), "Cell");

    this.set({cell: cell, headerCell: headerCell}, { silent: true });
  },

  /**
     Returns an appropriate value extraction function from a model for sorting.

     If the column model contains an attribute `sortValue`, if it is a string, a
     method from the column instance identifified by the `sortValue` string is
     returned. If it is a function, it it returned as is. If `sortValue` isn't
     found from the column model's attributes, a default value extraction
     function is returned which will compare according to the natural order of
     the value's type.

     @return {function(Backbone.Model, string): *}
   */
  sortValue: function () {
    var sortValue = this.get("sortValue");
    if (_.isString(sortValue)) return this[sortValue];
    else if (_.isFunction(sortValue)) return sortValue;

    return function (model, colName) {
      return model.get(colName);
    };
  }

  /**
     @member Backgrid.Column
     @protected
     @method sortable
     @return {function(Backgrid.Column, Backbone.Model): boolean | boolean}
  */

  /**
     @member Backgrid.Column
     @protected
     @method editable
     @return {function(Backgrid.Column, Backbone.Model): boolean | boolean}
  */

  /**
     @member Backgrid.Column
     @protected
     @method renderable
     @return {function(Backgrid.Column, Backbone.Model): boolean | boolean}
  */
});

_.each(["sortable", "renderable", "editable"], function (key) {
  Column.prototype[key] = function () {
    var value = this.get(key);
    if (_.isString(value)) return this[value];
    return !!value;
  };
});

/**
   A Backbone collection of Column instances.

   @class Backgrid.Columns
   @extends Backbone.Collection
 */
var Columns = Backgrid.Columns = Backbone.Collection.extend({

  /**
     @property {Backgrid.Column} model
   */
  model: Column
});

/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

/**
   Row is a simple container view that takes a model instance and a list of
   column metadata describing how each of the model's attribute is to be
   rendered, and apply the appropriate cell to each attribute.

   @class Backgrid.Row
   @extends Backbone.View
*/
var Row = Backgrid.Row = Backbone.View.extend({

  /** @property */
  tagName: "tr",

  /**
     Initializes a row view instance.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
     @param {Backbone.Model} options.model The model instance to render.

     @throws {TypeError} If options.columns or options.model is undefined.
  */
  initialize: function (options) {

    var columns = this.columns = options.columns;
    if (!(columns instanceof Backbone.Collection)) {
      columns = this.columns = new Columns(columns);
    }

    var cells = this.cells = [];
    for (var i = 0; i < columns.length; i++) {
      cells.push(this.makeCell(columns.at(i), options));
    }

    this.listenTo(columns, "add", function (column, columns) {
      var i = columns.indexOf(column);
      var cell = this.makeCell(column, options);
      cells.splice(i, 0, cell);

      var $el = this.$el;
      if (i === 0) {
        $el.prepend(cell.render().$el);
      }
      else if (i === columns.length - 1) {
        $el.append(cell.render().$el);
      }
      else {
        $el.children().eq(i).before(cell.render().$el);
      }
    });

    this.listenTo(columns, "remove", function (column, columns, opts) {
      cells[opts.index].remove();
      cells.splice(opts.index, 1);
    });
  },

  /**
     Factory method for making a cell. Used by #initialize internally. Override
     this to provide an appropriate cell instance for a custom Row subclass.

     @protected

     @param {Backgrid.Column} column
     @param {Object} options The options passed to #initialize.

     @return {Backgrid.Cell}
  */
  makeCell: function (column) {
    return new (column.get("cell"))({
      column: column,
      model: this.model
    });
  },

  /**
     Renders a row of cells for this row's model.
  */
  render: function () {
    this.$el.empty();

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < this.cells.length; i++) {
      fragment.appendChild(this.cells[i].render().el);
    }

    this.el.appendChild(fragment);

    this.delegateEvents();

    return this;
  },

  /**
     Clean up this row and its cells.

     @chainable
  */
  remove: function () {
    for (var i = 0; i < this.cells.length; i++) {
      var cell = this.cells[i];
      cell.remove.apply(cell, arguments);
    }
    return Backbone.View.prototype.remove.apply(this, arguments);
  }

});

/**
   EmptyRow is a simple container view that takes a list of column and render a
   row with a single column.

   @class Backgrid.EmptyRow
   @extends Backbone.View
*/
var EmptyRow = Backgrid.EmptyRow = Backbone.View.extend({

  /** @property */
  tagName: "tr",

  /** @property */
  emptyText: null,

  /**
     Initializer.

     @param {Object} options
     @param {string} options.emptyText
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
   */
  initialize: function (options) {
    this.emptyText = options.emptyText;
    this.columns =  options.columns;
  },

  /**
     Renders an empty row.
  */
  render: function () {
    this.$el.empty();

    var td = document.createElement("td");
    td.setAttribute("colspan", this.columns.length);
    td.textContent = this.emptyText;

    this.el.setAttribute("class", "empty");
    this.el.appendChild(td);

    return this;
  }
});

/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

/**
   HeaderCell is a special cell class that renders a column header cell. If the
   column is sortable, a sorter is also rendered and will trigger a table
   refresh after sorting.

   @class Backgrid.HeaderCell
   @extends Backbone.View
 */
var HeaderCell = Backgrid.HeaderCell = Backbone.View.extend({

  /** @property */
  tagName: "th",

  /** @property */
  events: {
    "click a": "onClick"
  },

  /**
     Initializer.

     @param {Object} options
     @param {Backgrid.Column|Object} options.column

     @throws {TypeError} If options.column or options.collection is undefined.
   */
  initialize: function (options) {
    this.column = options.column;
    if (!(this.column instanceof Column)) {
      this.column = new Column(this.column);
    }

    this.listenTo(this.collection, "backgrid:sort", this._resetCellDirection);

    var column = this.column, $el = this.$el;

    this.listenTo(column, "change:editable change:sortable change:renderable",
                  function (column) {
                    var changed = column.changedAttributes();
                    for (var key in changed) {
                      if (changed.hasOwnProperty(key)) {
                        $el.toggleClass(key, changed[key]);
                      }
                    }
                  });

    this.listenTo(column, "change:name change:label", this.render);

    if (column.get("editable")) $el.addClass("editable");
    if (column.get("sortable")) $el.addClass("sortable");
    if (column.get("renderable")) $el.addClass("renderable");
  },

  /**
     Gets or sets the direction of this cell. If called directly without
     parameters, returns the current direction of this cell, otherwise sets
     it. If a `null` is given, sets this cell back to the default order.

     @param {null|"ascending"|"descending"} dir
     @return {null|string} The current direction or the changed direction.
   */
  direction: function (dir) {
    if (arguments.length) {
      var direction = this.column.get('direction');
      if (direction) this.$el.removeClass(direction);
      if (dir) this.$el.addClass(dir);
      this.column.set('direction', dir)
    }

    return this.column.get('direction');
  },

  /**
     Event handler for the Backbone `backgrid:sort` event. Resets this cell's
     direction to default if sorting is being done on another column.

     @private
   */
  _resetCellDirection: function (columnToSort, direction) {
    if (columnToSort !== this.column) this.direction(null);
    else this.direction(direction);
  },

  /**
     Event handler for the `click` event on the cell's anchor. If the column is
     sortable, clicking on the anchor will cycle through 3 sorting orderings -
     `ascending`, `descending`, and default.
   */
  onClick: function (e) {
    e.preventDefault();

    var collection = this.collection, event = "backgrid:sort";

    function cycleSort(header, col) {
      if (header.direction() === "ascending") collection.trigger(event, col, "descending");
      else if (header.direction() === "descending") collection.trigger(event, col, null);
      else collection.trigger(event, col, "ascending");
    }

    function toggleSort(header, col) {
      if (header.direction() === "ascending") collection.trigger(event, col, "descending");
      else collection.trigger(event, col, "ascending");
    }

    var column = this.column;
    var sortable = Backgrid.callByNeed(column.sortable(), column, this.collection);
    if (sortable) {
      var sortType = column.get("sortType");
      if (sortType === "toggle") toggleSort(this, column);
      else cycleSort(this, column);
    }
  },

  /**
     Renders a header cell with a sorter, a label, and a class name for this
     column.
   */
  render: function () {
    this.$el.empty();
    var column = this.column;
    var $label = $("<a>").text(column.get("label"));
    var sortable = Backgrid.callByNeed(column.sortable(), column, this.collection);
    if (sortable) $label.append("<b class='sort-caret'></b>");
    this.$el.append($label);
    this.$el.addClass(column.get("name"));
    this.delegateEvents();
    this.direction(column.get("direction"));
    return this;
  }

});

/**
   HeaderRow is a controller for a row of header cells.

   @class Backgrid.HeaderRow
   @extends Backgrid.Row
 */
var HeaderRow = Backgrid.HeaderRow = Backgrid.Row.extend({

  requiredOptions: ["columns", "collection"],

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
     @param {Backgrid.HeaderCell} [options.headerCell] Customized default
     HeaderCell for all the columns. Supply a HeaderCell class or instance to a
     the `headerCell` key in a column definition for column-specific header
     rendering.

     @throws {TypeError} If options.columns or options.collection is undefined.
   */
  initialize: function () {
    Backgrid.Row.prototype.initialize.apply(this, arguments);
  },

  makeCell: function (column, options) {
    var headerCell = column.get("headerCell") || options.headerCell || HeaderCell;
    headerCell = new headerCell({
      column: column,
      collection: this.collection
    });
    return headerCell;
  }

});

/**
   Header is a special structural view class that renders a table head with a
   single row of header cells.

   @class Backgrid.Header
   @extends Backbone.View
 */
var Header = Backgrid.Header = Backbone.View.extend({

  /** @property */
  tagName: "thead",

  /**
     Initializer. Initializes this table head view to contain a single header
     row view.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
     @param {Backbone.Model} options.model The model instance to render.

     @throws {TypeError} If options.columns or options.model is undefined.
   */
  initialize: function (options) {
    this.columns = options.columns;
    if (!(this.columns instanceof Backbone.Collection)) {
      this.columns = new Columns(this.columns);
    }

    this.row = new Backgrid.HeaderRow({
      columns: this.columns,
      collection: this.collection
    });
  },

  /**
     Renders this table head with a single row of header cells.
   */
  render: function () {
    this.$el.append(this.row.render().$el);
    this.delegateEvents();
    return this;
  },

  /**
     Clean up this header and its row.

     @chainable
   */
  remove: function () {
    this.row.remove.apply(this.row, arguments);
    return Backbone.View.prototype.remove.apply(this, arguments);
  }

});

/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

/**
   Body is the table body which contains the rows inside a table. Body is
   responsible for refreshing the rows after sorting, insertion and removal.

   @class Backgrid.Body
   @extends Backbone.View
*/
var Body = Backgrid.Body = Backbone.View.extend({

  /** @property */
  tagName: "tbody",

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection} options.collection
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
     Column metadata.
     @param {Backgrid.Row} [options.row=Backgrid.Row] The Row class to use.
     @param {string} [options.emptyText] The text to display in the empty row.

     @throws {TypeError} If options.columns or options.collection is undefined.

     See Backgrid.Row.
  */
  initialize: function (options) {

    this.columns = options.columns;
    if (!(this.columns instanceof Backbone.Collection)) {
      this.columns = new Columns(this.columns);
    }

    this.row = options.row || Row;
    this.rows = this.collection.map(function (model) {
      var row = new this.row({
        columns: this.columns,
        model: model
      });

      return row;
    }, this);

    this.emptyText = options.emptyText;
    this._unshiftEmptyRowMayBe();

    var collection = this.collection;
    this.listenTo(collection, "add", this.insertRow);
    this.listenTo(collection, "remove", this.removeRow);
    this.listenTo(collection, "sort", this.refresh);
    this.listenTo(collection, "reset", this.refresh);
    this.listenTo(collection, "backgrid:sort", this.sort);
    this.listenTo(collection, "backgrid:edited", this.moveToNextCell);
  },

  _unshiftEmptyRowMayBe: function () {
    if (this.rows.length === 0 && this.emptyText != null) {
      this.rows.unshift(new EmptyRow({
        emptyText: this.emptyText,
        columns: this.columns
      }));
    }
  },

  /**
     This method can be called either directly or as a callback to a
     [Backbone.Collecton#add](http://backbonejs.org/#Collection-add) event.

     When called directly, it accepts a model or an array of models and an
     option hash just like
     [Backbone.Collection#add](http://backbonejs.org/#Collection-add) and
     delegates to it. Once the model is added, a new row is inserted into the
     body and automatically rendered.

     When called as a callback of an `add` event, splices a new row into the
     body and renders it.

     @param {Backbone.Model} model The model to render as a row.
     @param {Backbone.Collection} collection When called directly, this
     parameter is actually the options to
     [Backbone.Collection#add](http://backbonejs.org/#Collection-add).
     @param {Object} options When called directly, this must be null.

     See:

     - [Backbone.Collection#add](http://backbonejs.org/#Collection-add)
  */
  insertRow: function (model, collection, options) {

    if (this.rows[0] instanceof EmptyRow) this.rows.pop().remove();

    // insertRow() is called directly
    if (!(collection instanceof Backbone.Collection) && !options) {
      this.collection.add(model, (options = collection));
      return;
    }

    options = _.extend({render: true}, options || {});

    var row = new this.row({
      columns: this.columns,
      model: model
    });

    var index = collection.indexOf(model);
    this.rows.splice(index, 0, row);

    var $el = this.$el;
    var $children = $el.children();
    var $rowEl = row.render().$el;

    if (options.render) {
      if (index >= $children.length) {
        $el.append($rowEl);
      }
      else {
        $children.eq(index).before($rowEl);
      }
    }

    return this;
  },

  /**
     The method can be called either directly or as a callback to a
     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove)
     event.

     When called directly, it accepts a model or an array of models and an
     option hash just like
     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove) and
     delegates to it. Once the model is removed, a corresponding row is removed
     from the body.

     When called as a callback of a `remove` event, splices into the rows and
     removes the row responsible for rendering the model.

     @param {Backbone.Model} model The model to remove from the body.
     @param {Backbone.Collection} collection When called directly, this
     parameter is actually the options to
     [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove).
     @param {Object} options When called directly, this must be null.

     See:

     - [Backbone.Collection#remove](http://backbonejs.org/#Collection-remove)
  */
  removeRow: function (model, collection, options) {

    // removeRow() is called directly
    if (!options) {
      this.collection.remove(model, (options = collection));
      this._unshiftEmptyRowMayBe();
      return;
    }

    if (_.isUndefined(options.render) || options.render) {
      this.rows[options.index].remove();
    }

    this.rows.splice(options.index, 1);
    this._unshiftEmptyRowMayBe();

    return this;
  },

  /**
     Reinitialize all the rows inside the body and re-render them. Triggers a
     Backbone `backgrid:refresh` event from the collection along with the body
     instance as its sole parameter when done.
  */
  refresh: function () {
    for (var i = 0; i < this.rows.length; i++) {
      this.rows[i].remove();
    }

    this.rows = this.collection.map(function (model) {
      var row = new this.row({
        columns: this.columns,
        model: model
      });

      return row;
    }, this);
    this._unshiftEmptyRowMayBe();

    this.render();

    this.collection.trigger("backgrid:refresh", this);

    return this;
  },

  /**
     Renders all the rows inside this body. If the collection is empty and
     `options.emptyText` is defined and not null in the constructor, an empty
     row is rendered, otherwise no row is rendered.
  */
  render: function () {
    this.$el.empty();

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < this.rows.length; i++) {
      var row = this.rows[i];
      fragment.appendChild(row.render().el);
    }

    this.el.appendChild(fragment);

    this.delegateEvents();

    return this;
  },

  /**
     Clean up this body and it's rows.

     @chainable
  */
  remove: function () {
    for (var i = 0; i < this.rows.length; i++) {
      var row = this.rows[i];
      row.remove.apply(row, arguments);
    }
    return Backbone.View.prototype.remove.apply(this, arguments);
  },

  /**
     If the underlying collection is a Backbone.PageableCollection in
     server-mode or infinite-mode, a page of models is fetched after sorting is
     done on the server.

     If the underlying collection is a Backbone.PageableCollection in
     client-mode, or any
     [Backbone.Collection](http://backbonejs.org/#Collection) instance, sorting
     is done on the client side. If the collection is an instance of a
     Backbone.PageableCollection, sorting will be done globally on all the pages
     and the current page will then be returned.

     Triggers a Backbone `backgrid:sort` event from the collection when done
     with the column, direction, comparator and a reference to the collection.

     @param {Backgrid.Column} column
     @param {null|"ascending"|"descending"} direction

     See [Backbone.Collection#comparator](http://backbonejs.org/#Collection-comparator)
  */
  sort: function (column, direction) {

    if (_.isString(column)) column = this.columns.findWhere({name: column});

    var collection = this.collection;

    var order;
    if (direction === "ascending") order = -1;
    else if (direction === "descending") order = 1;
    else order = null;

    var comparator = this.makeComparator(column.get("name"), order,
                                         order ?
                                         column.sortValue() :
                                         function (model) {
                                           return model.cid;
                                         });

    if (Backbone.PageableCollection &&
        collection instanceof Backbone.PageableCollection) {

      collection.setSorting(order && column.get("name"), order,
                            {sortValue: column.sortValue()});

      if (collection.mode == "client") {
        if (collection.fullCollection.comparator == null) {
          collection.fullCollection.comparator = comparator;
        }
        collection.fullCollection.sort();
      }
      else collection.fetch({reset: true});
    }
    else {
      collection.comparator = comparator;
      collection.sort();
    }

    return this;
  },

  makeComparator: function (attr, order, func) {

    return function (left, right) {
      // extract the values from the models
      var l = func(left, attr), r = func(right, attr), t;

      // if descending order, swap left and right
      if (order === 1) t = l, l = r, r = t;

      // compare as usual
      if (l === r) return 0;
      else if (l < r) return -1;
      return 1;
    };
  },

  /**
     Moves focus to the next renderable and editable cell and return the
     currently editing cell to display mode.

     @param {Backbone.Model} model The originating model
     @param {Backgrid.Column} column The originating model column
     @param {Backgrid.Command} command The Command object constructed from a DOM
     Event
  */
  moveToNextCell: function (model, column, command) {
    var i = this.collection.indexOf(model);
    var j = this.columns.indexOf(column);
    var cell, renderable, editable;

    this.rows[i].cells[j].exitEditMode();

    if (command.moveUp() || command.moveDown() || command.moveLeft() ||
        command.moveRight() || command.save()) {
      var l = this.columns.length;
      var maxOffset = l * this.collection.length;

      if (command.moveUp() || command.moveDown()) {
        var row = this.rows[i + (command.moveUp() ? -1 : 1)];
        if (row) {
          cell = row.cells[j];
          if (Backgrid.callByNeed(cell.column.editable(), cell.column, model)) {
            cell.enterEditMode();
          }
        }
      }
      else if (command.moveLeft() || command.moveRight()) {
        var right = command.moveRight();
        for (var offset = i * l + j + (right ? 1 : -1);
             offset >= 0 && offset < maxOffset;
             right ? offset++ : offset--) {
          var m = ~~(offset / l);
          var n = offset - m * l;
          cell = this.rows[m].cells[n];
          renderable = Backgrid.callByNeed(cell.column.renderable(), cell.column, cell.model);
          editable = Backgrid.callByNeed(cell.column.editable(), cell.column, model);
          if (renderable && editable) {
            cell.enterEditMode();
            break;
          }
        }
      }
    }

    return this;
  }
});

/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

/**
   A Footer is a generic class that only defines a default tag `tfoot` and
   number of required parameters in the initializer.

   @abstract
   @class Backgrid.Footer
   @extends Backbone.View
 */
var Footer = Backgrid.Footer = Backbone.View.extend({

  /** @property */
  tagName: "tfoot",

  /**
     Initializer.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Column>|Array.<Backgrid.Column>|Array.<Object>} options.columns
     Column metadata.
     @param {Backbone.Collection} options.collection

     @throws {TypeError} If options.columns or options.collection is undefined.
  */
  initialize: function (options) {
    this.columns = options.columns;
    if (!(this.columns instanceof Backbone.Collection)) {
      this.columns = new Backgrid.Columns(this.columns);
    }
  }

});

/*
  backgrid
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT license.
*/

/**
   Grid represents a data grid that has a header, body and an optional footer.

   By default, a Grid treats each model in a collection as a row, and each
   attribute in a model as a column. To render a grid you must provide a list of
   column metadata and a collection to the Grid constructor. Just like any
   Backbone.View class, the grid is rendered as a DOM node fragment when you
   call render().

       var grid = Backgrid.Grid({
         columns: [{ name: "id", label: "ID", type: "string" },
          // ...
         ],
         collections: books
       });

       $("#table-container").append(grid.render().el);

   Optionally, if you want to customize the rendering of the grid's header and
   footer, you may choose to extend Backgrid.Header and Backgrid.Footer, and
   then supply that class or an instance of that class to the Grid constructor.
   See the documentation for Header and Footer for further details.

       var grid = Backgrid.Grid({
         columns: [{ name: "id", label: "ID", type: "string" }],
         collections: books,
         header: Backgrid.Header.extend({
              //...
         }),
         footer: Backgrid.Paginator
       });

   Finally, if you want to override how the rows are rendered in the table body,
   you can supply a Body subclass as the `body` attribute that uses a different
   Row class.

   @class Backgrid.Grid
   @extends Backbone.View

   See:

   - Backgrid.Column
   - Backgrid.Header
   - Backgrid.Body
   - Backgrid.Row
   - Backgrid.Footer
*/
var Grid = Backgrid.Grid = Backbone.View.extend({

  /** @property */
  tagName: "table",

  /** @property */
  className: "backgrid",

  /** @property */
  header: Header,

  /** @property */
  body: Body,

  /** @property */
  footer: null,

  /**
     Initializes a Grid instance.

     @param {Object} options
     @param {Backbone.Collection.<Backgrid.Columns>|Array.<Backgrid.Column>|Array.<Object>} options.columns Column metadata.
     @param {Backbone.Collection} options.collection The collection of tabular model data to display.
     @param {Backgrid.Header} [options.header=Backgrid.Header] An optional Header class to override the default.
     @param {Backgrid.Body} [options.body=Backgrid.Body] An optional Body class to override the default.
     @param {Backgrid.Row} [options.row=Backgrid.Row] An optional Row class to override the default.
     @param {Backgrid.Footer} [options.footer=Backgrid.Footer] An optional Footer class.
   */
  initialize: function (options) {
    // Convert the list of column objects here first so the subviews don't have
    // to.
    if (!(options.columns instanceof Backbone.Collection)) {
      options.columns = new Columns(options.columns);
    }
    this.columns = options.columns;

    var filteredOptions = _.omit(options, ["el", "id", "attributes",
                                           "className", "tagName", "events"]);

    // must construct body first so it listens to backgrid:sort first
    this.body = options.body || this.body;
    this.body = new this.body(filteredOptions);

    this.header = options.header || this.header;
    if (this.header) {
      this.header = new this.header(filteredOptions);
    }

    this.footer = options.footer || this.footer;
    if (this.footer) {
      this.footer = new this.footer(filteredOptions);
    }

    this.listenTo(this.columns, "reset", function () {
      if (this.header) {
        this.header = new (this.header.remove().constructor)(filteredOptions);
      }
      this.body = new (this.body.remove().constructor)(filteredOptions);
      if (this.footer) {
        this.footer = new (this.footer.remove().constructor)(filteredOptions);
      }
      this.render();
    });
  },

  /**
     Delegates to Backgrid.Body#insertRow.
   */
  insertRow: function (model, collection, options) {
    this.body.insertRow(model, collection, options);
    return this;
  },

  /**
     Delegates to Backgrid.Body#removeRow.
   */
  removeRow: function (model, collection, options) {
    this.body.removeRow(model, collection, options);
    return this;
  },

  /**
     Delegates to Backgrid.Columns#add for adding a column. Subviews can listen
     to the `add` event from their internal `columns` if rerendering needs to
     happen.

     @param {Object} [options] Options for `Backgrid.Columns#add`.
     @param {boolean} [options.render=true] Whether to render the column
     immediately after insertion.
   */
  insertColumn: function (column, options) {
    options = options || {render: true};
    this.columns.add(column, options);
    return this;
  },

  /**
     Delegates to Backgrid.Columns#remove for removing a column. Subviews can
     listen to the `remove` event from the internal `columns` if rerendering
     needs to happen.

     @param {Object} [options] Options for `Backgrid.Columns#remove`.
   */
  removeColumn: function (column, options) {
    this.columns.remove(column, options);
    return this;
  },

  /**
     Delegates to Backgrid.Body#sort.
   */
  sort: function () {
    this.body.sort(arguments);
    return this;
  },

  /**
     Renders the grid's header, then footer, then finally the body. Triggers a
     Backbone `backgrid:rendered` event along with a reference to the grid when
     the it has successfully been rendered.
   */
  render: function () {
    this.$el.empty();

    if (this.header) {
      this.$el.append(this.header.render().$el);
    }

    if (this.footer) {
      this.$el.append(this.footer.render().$el);
    }

    this.$el.append(this.body.render().$el);

    this.delegateEvents();

    this.trigger("backgrid:rendered", this);

    return this;
  },

  /**
     Clean up this grid and its subviews.

     @chainable
   */
  remove: function () {
    this.header && this.header.remove.apply(this.header, arguments);
    this.body.remove.apply(this.body, arguments);
    this.footer && this.footer.remove.apply(this.footer, arguments);
    return Backbone.View.prototype.remove.apply(this, arguments);
  }

});
return Backgrid;
}));
});
require.register("wyuenho-backgrid-paginator/backgrid-paginator.js", function(exports, require, module){
/*
  backgrid-paginator
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("underscore"),
                             require("backbone"),
                             require("backgrid"),
                             require("backbone-pageable"));
  }
  // Browser
  else if (typeof _ !== "undefined" &&
           typeof Backbone !== "undefined" &&
           typeof Backgrid !== "undefined") {
    factory(_, Backbone, Backgrid);
  }

}(function (_, Backbone, Backgrid) {

  "use strict";

  /**
     PageHandle is a class that renders the actual page handles and reacts to
     click events for pagination.

     This class acts in two modes - control or discrete page handle modes. If
     one of the `is*` flags is `true`, an instance of this class is under
     control page handle mode. Setting a `pageIndex` to an instance of this
     class under control mode has no effect and the correct page index will
     always be inferred from the `is*` flag. Only one of the `is*` flags should
     be set to `true` at a time. For example, an instance of this class cannot
     simultaneously be a rewind control and a fast forward control. A `label`
     and a `title` template or a string are required to be passed to the
     constuctor under this mode. If a `title` template is provided, it __MUST__
     accept a parameter `label`. When the `label` is provided to the `title`
     template function, its result will be used to render the generated anchor's
     title attribute.

     If all of the `is*` flags is set to `false`, which is the default, an
     instance of this class will be in discrete page handle mode. An instance
     under this mode requires the `pageIndex` to be passed from the constructor
     as an option and it __MUST__ be a 0-based index of the list of page numbers
     to render. The constuctor will normalize the base to the same base the
     underlying PageableCollection collection instance uses. A `label` is not
     required under this mode, which will default to the equivalent 1-based page
     index calculated from `pageIndex` and the underlying PageableCollection
     instance. A provided `label` will still be honored however. The `title`
     parameter is also not required under this mode, in which case the default
     `title` template will be used. You are encouraged to provide your own
     `title` template however if you wish to localize the title strings.

     If this page handle represents the current page, an `active` class will be
     placed on the root list element.

     if this page handle is at the border of the list of pages, a `disabled`
     class will be placed on the root list element.

     Only page handles that are neither `active` nor `disabled` will respond to
     click events and triggers pagination.

     @class Backgrid.Extension.PageHandle
  */
  var PageHandle = Backgrid.Extension.PageHandle = Backbone.View.extend({

    /** @property */
    tagName: "li",

    /** @property */
    events: {
      "click a": "changePage"
    },

    /**
       @property {string|function(Object.<string, string>): string} title
       The title to use for the `title` attribute of the generated page handle
       anchor elements. It can be a string or an Underscore template function
       that takes a mandatory `label` parameter.
    */
    title: _.template('Page <%- label %>', null, {variable: null}),

    /**
       @property {boolean} isRewind Whether this handle represents a rewind
       control
    */
    isRewind: false,

    /**
       @property {boolean} isBack Whether this handle represents a back
       control
    */
    isBack: false,

    /**
       @property {boolean} isForward Whether this handle represents a forward
       control
    */
    isForward: false,

    /**
       @property {boolean} isFastForward Whether this handle represents a fast
       forward control
    */
    isFastForward: false,

    /**
       Initializer.

       @param {Object} options
       @param {Backbone.Collection} options.collection
       @param {number} pageIndex 0-based index of the page number this handle
       handles. This parameter will be normalized to the base the underlying
       PageableCollection uses.
       @param {string} [options.label] If provided it is used to render the
       anchor text, otherwise the normalized pageIndex will be used
       instead. Required if any of the `is*` flags is set to `true`.
       @param {string} [options.title]
       @param {boolean} [options.isRewind=false]
       @param {boolean} [options.isBack=false]
       @param {boolean} [options.isForward=false]
       @param {boolean} [options.isFastForward=false]
    */
    initialize: function (options) {
      Backbone.View.prototype.initialize.apply(this, arguments);

      var collection = this.collection;
      var state = collection.state;
      var currentPage = state.currentPage;
      var firstPage = state.firstPage;
      var lastPage = state.lastPage;

      _.extend(this, _.pick(options,
                            ["isRewind", "isBack", "isForward", "isFastForward"]));

      var pageIndex;
      if (this.isRewind) pageIndex = firstPage;
      else if (this.isBack) pageIndex = Math.max(firstPage, currentPage - 1);
      else if (this.isForward) pageIndex = Math.min(lastPage, currentPage + 1);
      else if (this.isFastForward) pageIndex = lastPage;
      else {
        pageIndex = +options.pageIndex;
        pageIndex = (firstPage ? pageIndex + 1 : pageIndex);
      }
      this.pageIndex = pageIndex;

      if (((this.isRewind || this.isBack) && currentPage == firstPage) ||
          ((this.isForward || this.isFastForward) && currentPage == lastPage)) {
        this.$el.addClass("disabled");
      }
      else if (!(this.isRewind ||
                 this.isBack ||
                 this.isForward ||
                 this.isFastForward) &&
               currentPage == pageIndex) {
        this.$el.addClass("active");
      }

      this.label = (options.label || (firstPage ? pageIndex : pageIndex + 1)) + '';
      var title = options.title || this.title;
      this.title = _.isFunction(title) ? title({label: this.label}) : title;
    },

    /**
       Renders a clickable anchor element under a list item.
    */
    render: function () {
      this.$el.empty();
      var anchor = document.createElement("a");
      anchor.href = '#';
      if (this.title) anchor.title = this.title;
      anchor.innerHTML = this.label;
      this.el.appendChild(anchor);
      this.delegateEvents();
      return this;
    },

    /**
       jQuery click event handler. Goes to the page this PageHandle instance
       represents. No-op if this page handle is currently active or disabled.
    */
    changePage: function (e) {
      e.preventDefault();
      var $el = this.$el;
      if (!$el.hasClass("active") && !$el.hasClass("disabled")) {
        this.collection.getPage(this.pageIndex);
      }
      return this;
    }

  });

  /**
     Paginator is a Backgrid extension that renders a series of configurable
     pagination handles. This extension is best used for splitting a large data
     set across multiple pages. If the number of pages is larger then a
     threshold, which is set to 10 by default, the page handles are rendered
     within a sliding window, plus the rewind, back, forward and fast forward
     control handles. The individual control handles can be turned off.

     @class Backgrid.Extension.Paginator
  */
  Backgrid.Extension.Paginator = Backbone.View.extend({

    /** @property */
    className: "backgrid-paginator",

    /** @property */
    windowSize: 10,

    /**
       @property {Object.<string, Object.<string, string>>} controls You can
       disable specific control handles by omitting certain keys.
    */
    controls: {
      rewind: {
        label: "《",
        title: "First"
      },
      back: {
        label: "〈",
        title: "Previous"
      },
      forward: {
        label: "〉",
        title: "Next"
      },
      fastForward: {
        label: "》",
        title: "Last"
      }
    },

    /**
       @property {Backgrid.Extension.PageHandle} pageHandle. The PageHandle
       class to use for rendering individual handles
    */
    pageHandle: PageHandle,

    /** @property */
    goBackFirstOnSort: true,

    /**
       Initializer.

       @param {Object} options
       @param {Backbone.Collection} options.collection
       @param {boolean} [options.controls]
       @param {boolean} [options.pageHandle=Backgrid.Extension.PageHandle]
       @param {boolean} [options.goBackFirstOnSort=true]
    */
    initialize: function (options) {
      this.controls = options.controls || this.controls;
      this.pageHandle = options.pageHandle || this.pageHandle;

      var collection = this.collection;
      this.listenTo(collection, "add", this.render);
      this.listenTo(collection, "remove", this.render);
      this.listenTo(collection, "reset", this.render);
      if ((options.goBackFirstOnSort || this.goBackFirstOnSort) &&
          collection.fullCollection) {
        this.listenTo(collection.fullCollection, "sort", function () {
          collection.getFirstPage();
        });
      }
    },

    _calculateWindow: function () {
      var collection = this.collection;
      var state = collection.state;

      // convert all indices to 0-based here
      var firstPage = state.firstPage;
      var lastPage = +state.lastPage;
      lastPage = Math.max(0, firstPage ? lastPage - 1 : lastPage);
      var currentPage = Math.max(state.currentPage, state.firstPage);
      currentPage = firstPage ? currentPage - 1 : currentPage;
      var windowStart = Math.floor(currentPage / this.windowSize) * this.windowSize;
      var windowEnd = Math.min(lastPage + 1, windowStart + this.windowSize);
      return [windowStart, windowEnd];
    },

    /**
       Creates a list of page handle objects for rendering.

       @return {Array.<Object>} an array of page handle objects hashes
    */
    makeHandles: function () {

      var handles = [];
      var collection = this.collection;

      var window = this._calculateWindow();
      var winStart = window[0], winEnd = window[1];

      for (var i = winStart; i < winEnd; i++) {
        handles.push(new this.pageHandle({
          collection: collection,
          pageIndex: i
        }));
      }

      var controls = this.controls;
      _.each(["back", "rewind", "forward", "fastForward"], function (key) {
        var value = controls[key];
        if (value) {
          var handleCtorOpts = {
            collection: collection,
            title: value.title,
            label: value.label
          };
          handleCtorOpts["is" + key.slice(0, 1).toUpperCase() + key.slice(1)] = true;
          var handle = new this.pageHandle(handleCtorOpts);
          if (key == "rewind" || key == "back") handles.unshift(handle);
          else handles.push(handle);
        }
      }, this);

      return handles;
    },

    /**
       Render the paginator handles inside an unordered list.
    */
    render: function () {
      this.$el.empty();

      if (this.handles) {
        for (var i = 0, l = this.handles.length; i < l; i++) {
          this.handles[i].remove();
        }
      }

      var handles = this.handles = this.makeHandles();

      var ul = document.createElement("ul");
      for (var i = 0; i < handles.length; i++) {
        ul.appendChild(handles[i].render().el);
      }

      this.el.appendChild(ul);

      return this;
    }

  });

}));

});
require.register("olivernn-lunr.js/lunr.js", function(exports, require, module){
/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 0.4.3
 * Copyright (C) 2013 Oliver Nightingale
 * MIT Licensed
 * @license
 */

/**
 * Convenience function for instantiating a new lunr index and configuring it
 * with the default pipeline functions and the passed config function.
 *
 * When using this convenience function a new index will be created with the
 * following functions already in the pipeline:
 *
 * lunr.StopWordFilter - filters out any stop words before they enter the
 * index
 *
 * lunr.stemmer - stems the tokens before entering the index.
 *
 * Example:
 *
 *     var idx = lunr(function () {
 *       this.field('title', 10)
 *       this.field('tags', 100)
 *       this.field('body')
 *       
 *       this.ref('cid')
 *       
 *       this.pipeline.add(function () {
 *         // some custom pipeline function
 *       })
 *       
 *     })
 *
 * @param {Function} config A function that will be called with the new instance
 * of the lunr.Index as both its context and first parameter. It can be used to
 * customize the instance of new lunr.Index.
 * @namespace
 * @module
 * @returns {lunr.Index}
 *
 */
var lunr = function (config) {
  var idx = new lunr.Index

  idx.pipeline.add(lunr.stopWordFilter, lunr.stemmer)

  if (config) config.call(idx, idx)

  return idx
}

lunr.version = "0.4.3"

if (typeof module !== 'undefined') {
  module.exports = lunr
}
/*!
 * lunr.utils
 * Copyright (C) 2013 Oliver Nightingale
 */

/**
 * A namespace containing utils for the rest of the lunr library
 */
lunr.utils = {}

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf Utils
 */
lunr.utils.warn = (function (global) {
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message)
    }
  }
})(this)

/**
 * Returns a zero filled array of the length specified.
 *
 * @param {Number} length The number of zeros required.
 * @returns {Array}
 * @memberOf Utils
 */
lunr.utils.zeroFillArray = (function () {
  var zeros = [0]

  return function (length) {
    while (zeros.length < length) {
      zeros = zeros.concat(zeros)
    }

    return zeros.slice(0, length)
  }
})()
/*!
 * lunr.EventEmitter
 * Copyright (C) 2013 Oliver Nightingale
 */

/**
 * lunr.EventEmitter is an event emitter for lunr. It manages adding and removing event handlers and triggering events and their handlers.
 *
 * @constructor
 */
lunr.EventEmitter = function () {
  this.events = {}
}

/**
 * Binds a handler function to a specific event(s).
 *
 * Can bind a single function to many different events in one call.
 *
 * @param {String} [eventName] The name(s) of events to bind this function to.
 * @param {Function} handler The function to call when an event is fired.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.addListener = function () {
  var args = Array.prototype.slice.call(arguments),
      fn = args.pop(),
      names = args

  if (typeof fn !== "function") throw new TypeError ("last argument must be a function")

  names.forEach(function (name) {
    if (!this.hasHandler(name)) this.events[name] = []
    this.events[name].push(fn)
  }, this)
}

/**
 * Removes a handler function from a specific event.
 *
 * @param {String} eventName The name of the event to remove this function from.
 * @param {Function} handler The function to remove from an event.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.removeListener = function (name, fn) {
  if (!this.hasHandler(name)) return

  var fnIndex = this.events[name].indexOf(fn)
  this.events[name].splice(fnIndex, 1)

  if (!this.events[name].length) delete this.events[name]
}

/**
 * Calls all functions bound to the given event.
 *
 * Additional data can be passed to the event handler as arguments to `emit`
 * after the event name.
 *
 * @param {String} eventName The name of the event to emit.
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.emit = function (name) {
  if (!this.hasHandler(name)) return

  var args = Array.prototype.slice.call(arguments, 1)

  this.events[name].forEach(function (fn) {
    fn.apply(undefined, args)
  })
}

/**
 * Checks whether a handler has ever been stored against an event.
 *
 * @param {String} eventName The name of the event to check.
 * @private
 * @memberOf EventEmitter
 */
lunr.EventEmitter.prototype.hasHandler = function (name) {
  return name in this.events
}

/*!
 * lunr.tokenizer
 * Copyright (C) 2013 Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index.
 *
 * @module
 * @param {String} obj The string to convert into tokens
 * @returns {Array}
 */
lunr.tokenizer = function (obj) {
  if (!arguments.length || obj == null || obj == undefined) return []
  if (Array.isArray(obj)) return obj.map(function (t) { return t.toLowerCase() })

  var str = obj.toString().replace(/^\s+/, '')

  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1)
      break
    }
  }

  return str
    .split(/\s+/)
    .map(function (token) {
      return token.replace(/^\W+/, '').replace(/\W+$/, '').toLowerCase()
    })
}
/*!
 * lunr.Pipeline
 * Copyright (C) 2013 Oliver Nightingale
 */

/**
 * lunr.Pipelines maintain an ordered list of functions to be applied to all
 * tokens in documents entering the search index and queries being ran against
 * the index.
 *
 * An instance of lunr.Index created with the lunr shortcut will contain a
 * pipeline with a stop word filter and an English language stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline will call each function in turn, passing a token, the
 * index of that token in the original list of all tokens and finally a list of
 * all the original tokens.
 *
 * The output of functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with lunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
lunr.Pipeline = function () {
  this._stack = []
}

lunr.Pipeline.registeredFunctions = {}

/**
 * Register a function with the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {Function} fn The function to check for.
 * @param {String} label The label to register this function with
 * @memberOf Pipeline
 */
lunr.Pipeline.registerFunction = function (fn, label) {
  if (label in this.registeredFunctions) {
    lunr.utils.warn('Overwriting existing registered function: ' + label)
  }

  fn.label = label
  lunr.Pipeline.registeredFunctions[fn.label] = fn
}

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {Function} fn The function to check for.
 * @private
 * @memberOf Pipeline
 */
lunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions)

  if (!isRegistered) {
    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn)
  }
}

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with lunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised The serialised pipeline to load.
 * @returns {lunr.Pipeline}
 * @memberOf Pipeline
 */
lunr.Pipeline.load = function (serialised) {
  var pipeline = new lunr.Pipeline

  serialised.forEach(function (fnName) {
    var fn = lunr.Pipeline.registeredFunctions[fnName]

    if (fn) {
      pipeline.add(fn)
    } else {
      throw new Error ('Cannot load un-registered function: ' + fnName)
    }
  })

  return pipeline
}

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} functions Any number of functions to add to the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments)

  fns.forEach(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)
    this._stack.push(fn)
  }, this)
}

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.after = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn) + 1
  this._stack.splice(pos, 0, newFn)
}

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {Function} existingFn A function that already exists in the pipeline.
 * @param {Function} newFn The new function to add to the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.before = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  this._stack.splice(pos, 0, newFn)
}

/**
 * Removes a function from the pipeline.
 *
 * @param {Function} fn The function to remove from the pipeline.
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._stack.indexOf(fn)
  this._stack.splice(pos, 1)
}

/**
 * Runs the current list of functions that make up the pipeline against the
 * passed tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @returns {Array}
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.run = function (tokens) {
  var out = [],
      tokenLength = tokens.length,
      stackLength = this._stack.length

  for (var i = 0; i < tokenLength; i++) {
    var token = tokens[i]

    for (var j = 0; j < stackLength; j++) {
      token = this._stack[j](token, i, tokens)
      if (token === void 0) break
    };

    if (token !== void 0) out.push(token)
  };

  return out
}

/**
 * Returns a representation of the pipeline ready for serialisation.
 *
 * Logs a warning if the function has not been registered.
 *
 * @returns {Array}
 * @memberOf Pipeline
 */
lunr.Pipeline.prototype.toJSON = function () {
  return this._stack.map(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)

    return fn.label
  })
}
/*!
 * lunr.Vector
 * Copyright (C) 2013 Oliver Nightingale
 */

/**
 * lunr.Vectors wrap arrays and add vector related operations for the array
 * elements.
 *
 * @constructor
 * @param {Array} elements Elements that make up the vector.
 */
lunr.Vector = function (elements) {
  this.elements = elements
}

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.magnitude = function () {
  if (this._magnitude) return this._magnitude

  var sumOfSquares = 0,
      elems = this.elements,
      len = elems.length,
      el

  for (var i = 0; i < len; i++) {
    el = elems[i]
    sumOfSquares += el * el
  };

  return this._magnitude = Math.sqrt(sumOfSquares)
}

/**
 * Calculates the dot product of this vector and another vector.
 *
 * @param {lunr.Vector} otherVector The vector to compute the dot product with.
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.dot = function (otherVector) {
  var elem1 = this.elements,
      elem2 = otherVector.elements,
      length = elem1.length,
      dotProduct = 0

  for (var i = 0; i < length; i++) {
    dotProduct += elem1[i] * elem2[i]
  };

  return dotProduct
}

/**
 * Calculates the cosine similarity between this vector and another
 * vector.
 *
 * @param {lunr.Vector} otherVector The other vector to calculate the
 * similarity with.
 * @returns {Number}
 * @memberOf Vector
 */
lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())
}

/**
 * Converts this vector back into an array.
 *
 * @returns {Array}
 * @memberOf Vector
 */
lunr.Vector.prototype.toArray = function () {
  return this.elements
}
/*!
 * lunr.SortedSet
 * Copyright (C) 2013 Oliver Nightingale
 */

/**
 * lunr.SortedSets are used to maintain an array of uniq values in a sorted
 * order.
 *
 * @constructor
 */
lunr.SortedSet = function () {
  this.length = 0
  this.elements = []
}

/**
 * Loads a previously serialised sorted set.
 *
 * @param {Array} serialisedData The serialised set to load.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.load = function (serialisedData) {
  var set = new this

  set.elements = serialisedData
  set.length = serialisedData.length

  return set
}

/**
 * Inserts new items into the set in the correct position to maintain the
 * order.
 *
 * @param {Object} The objects to add to this set.
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.add = function () {
  Array.prototype.slice.call(arguments).forEach(function (element) {
    if (~this.indexOf(element)) return
    this.elements.splice(this.locationFor(element), 0, element)
  }, this)

  this.length = this.elements.length
}

/**
 * Converts this sorted set into an array.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toArray = function () {
  return this.elements.slice()
}

/**
 * Creates a new array with the results of calling a provided function on every
 * element in this sorted set.
 *
 * Delegates to Array.prototype.map and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * for the function fn.
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.map = function (fn, ctx) {
  return this.elements.map(fn, ctx)
}

/**
 * Executes a provided function once per sorted set element.
 *
 * Delegates to Array.prototype.forEach and has the same signature.
 *
 * @param {Function} fn The function that is called on each element of the
 * set.
 * @param {Object} ctx An optional object that can be used as the context
 * @memberOf SortedSet
 * for the function fn.
 */
lunr.SortedSet.prototype.forEach = function (fn, ctx) {
  return this.elements.forEach(fn, ctx)
}

/**
 * Returns the index at which a given element can be found in the
 * sorted set, or -1 if it is not present.
 *
 * @param {Object} elem The object to locate in the sorted set.
 * @param {Number} start An optional index at which to start searching from
 * within the set.
 * @param {Number} end An optional index at which to stop search from within
 * the set.
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.indexOf = function (elem, start, end) {
  var start = start || 0,
      end = end || this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

  if (sectionLength <= 1) {
    if (pivotElem === elem) {
      return pivot
    } else {
      return -1
    }
  }

  if (pivotElem < elem) return this.indexOf(elem, pivot, end)
  if (pivotElem > elem) return this.indexOf(elem, start, pivot)
  if (pivotElem === elem) return pivot
}

/**
 * Returns the position within the sorted set that an element should be
 * inserted at to maintain the current order of the set.
 *
 * This function assumes that the element to search for does not already exist
 * in the sorted set.
 *
 * @param {Object} elem The elem to find the position for in the set
 * @param {Number} start An optional index at which to start searching from
 * within the set.
 * @param {Number} end An optional index at which to stop search from within
 * the set.
 * @returns {Number}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.locationFor = function (elem, start, end) {
  var start = start || 0,
      end = end || this.elements.length,
      sectionLength = end - start,
      pivot = start + Math.floor(sectionLength / 2),
      pivotElem = this.elements[pivot]

  if (sectionLength <= 1) {
    if (pivotElem > elem) return pivot
    if (pivotElem < elem) return pivot + 1
  }

  if (pivotElem < elem) return this.locationFor(elem, pivot, end)
  if (pivotElem > elem) return this.locationFor(elem, start, pivot)
}

/**
 * Creates a new lunr.SortedSet that contains the elements in the intersection
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to intersect with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.intersect = function (otherSet) {
  var intersectSet = new lunr.SortedSet,
      i = 0, j = 0,
      a_len = this.length, b_len = otherSet.length,
      a = this.elements, b = otherSet.elements

  while (true) {
    if (i > a_len - 1 || j > b_len - 1) break

    if (a[i] === b[j]) {
      intersectSet.add(a[i])
      i++, j++
      continue
    }

    if (a[i] < b[j]) {
      i++
      continue
    }

    if (a[i] > b[j]) {
      j++
      continue
    }
  };

  return intersectSet
}

/**
 * Makes a copy of this set
 *
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.clone = function () {
  var clone = new lunr.SortedSet

  clone.elements = this.toArray()
  clone.length = clone.elements.length

  return clone
}

/**
 * Creates a new lunr.SortedSet that contains the elements in the union
 * of this set and the passed set.
 *
 * @param {lunr.SortedSet} otherSet The set to union with this set.
 * @returns {lunr.SortedSet}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.union = function (otherSet) {
  var longSet, shortSet, unionSet

  if (this.length >= otherSet.length) {
    longSet = this, shortSet = otherSet
  } else {
    longSet = otherSet, shortSet = this
  }

  unionSet = longSet.clone()

  unionSet.add.apply(unionSet, shortSet.toArray())

  return unionSet
}

/**
 * Returns a representation of the sorted set ready for serialisation.
 *
 * @returns {Array}
 * @memberOf SortedSet
 */
lunr.SortedSet.prototype.toJSON = function () {
  return this.toArray()
}
/*!
 * lunr.Index
 * Copyright (C) 2013 Oliver Nightingale
 */

/**
 * lunr.Index is object that manages a search index.  It contains the indexes
 * and stores all the tokens and document lookups.  It also provides the main
 * user facing API for the library.
 *
 * @constructor
 */
lunr.Index = function () {
  this._fields = []
  this._ref = 'id'
  this.pipeline = new lunr.Pipeline
  this.documentStore = new lunr.Store
  this.tokenStore = new lunr.TokenStore
  this.corpusTokens = new lunr.SortedSet
  this.eventEmitter =  new lunr.EventEmitter

  this._idfCache = {}

  this.on('add', 'remove', 'update', (function () {
    this._idfCache = {}
  }).bind(this))
}

/**
 * Bind a handler to events being emitted by the index.
 *
 * The handler can be bound to many events at the same time.
 *
 * @param {String} [eventName] The name(s) of events to bind the function to.
 * @param {Function} handler The serialised set to load.
 * @memberOf Index
 */
lunr.Index.prototype.on = function () {
  var args = Array.prototype.slice.call(arguments)
  return this.eventEmitter.addListener.apply(this.eventEmitter, args)
}

/**
 * Removes a handler from an event being emitted by the index.
 *
 * @param {String} eventName The name of events to remove the function from.
 * @param {Function} handler The serialised set to load.
 * @memberOf Index
 */
lunr.Index.prototype.off = function (name, fn) {
  return this.eventEmitter.removeListener(name, fn)
}

/**
 * Loads a previously serialised index.
 *
 * Issues a warning if the index being imported was serialised
 * by a different version of lunr.
 *
 * @param {Object} serialisedData The serialised set to load.
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.load = function (serialisedData) {
  if (serialisedData.version !== lunr.version) {
    lunr.utils.warn('version mismatch: current ' + lunr.version + ' importing ' + serialisedData.version)
  }

  var idx = new this

  idx._fields = serialisedData.fields
  idx._ref = serialisedData.ref

  idx.documentStore = lunr.Store.load(serialisedData.documentStore)
  idx.tokenStore = lunr.TokenStore.load(serialisedData.tokenStore)
  idx.corpusTokens = lunr.SortedSet.load(serialisedData.corpusTokens)
  idx.pipeline = lunr.Pipeline.load(serialisedData.pipeline)

  return idx
}

/**
 * Adds a field to the list of fields that will be searchable within documents
 * in the index.
 *
 * An optional boost param can be passed to affect how much tokens in this field
 * rank in search results, by default the boost value is 1.
 *
 * Fields should be added before any documents are added to the index, fields
 * that are added after documents are added to the index will only apply to new
 * documents added to the index.
 *
 * @param {String} fieldName The name of the field within the document that
 * should be indexed
 * @param {Number} boost An optional boost that can be applied to terms in this
 * field.
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.prototype.field = function (fieldName, opts) {
  var opts = opts || {},
      field = { name: fieldName, boost: opts.boost || 1 }

  this._fields.push(field)
  return this
}

/**
 * Sets the property used to uniquely identify documents added to the index,
 * by default this property is 'id'.
 *
 * This should only be changed before adding documents to the index, changing
 * the ref property without resetting the index can lead to unexpected results.
 *
 * @param {String} refName The property to use to uniquely identify the
 * documents in the index.
 * @param {Boolean} emitEvent Whether to emit add events, defaults to true
 * @returns {lunr.Index}
 * @memberOf Index
 */
lunr.Index.prototype.ref = function (refName) {
  this._ref = refName
  return this
}

/**
 * Add a document to the index.
 *
 * This is the way new documents enter the index, this function will run the
 * fields from the document through the index's pipeline and then add it to
 * the index, it will then show up in search results.
 *
 * An 'add' event is emitted with the document that has been added and the index
 * the document has been added to. This event can be silenced by passing false
 * as the second argument to add.
 *
 * @param {Object} doc The document to add to the index.
 * @param {Boolean} emitEvent Whether or not to emit events, default true.
 * @memberOf Index
 */
lunr.Index.prototype.add = function (doc, emitEvent) {
  var docTokens = {},
      allDocumentTokens = new lunr.SortedSet,
      docRef = doc[this._ref],
      emitEvent = emitEvent === undefined ? true : emitEvent

  this._fields.forEach(function (field) {
    var fieldTokens = this.pipeline.run(lunr.tokenizer(doc[field.name]))

    docTokens[field.name] = fieldTokens
    lunr.SortedSet.prototype.add.apply(allDocumentTokens, fieldTokens)
  }, this)

  this.documentStore.set(docRef, allDocumentTokens)
  lunr.SortedSet.prototype.add.apply(this.corpusTokens, allDocumentTokens.toArray())

  for (var i = 0; i < allDocumentTokens.length; i++) {
    var token = allDocumentTokens.elements[i]
    var tf = this._fields.reduce(function (memo, field) {
      var fieldLength = docTokens[field.name].length

      if (!fieldLength) return memo

      var tokenCount = docTokens[field.name].filter(function (t) { return t === token }).length

      return memo + (tokenCount / fieldLength * field.boost)
    }, 0)

    this.tokenStore.add(token, { ref: docRef, tf: tf })
  };

  if (emitEvent) this.eventEmitter.emit('add', doc, this)
}

/**
 * Removes a document from the index.
 *
 * To make sure documents no longer show up in search results they can be
 * removed from the index using this method.
 *
 * The document passed only needs to have the same ref property value as the
 * document that was added to the index, they could be completely different
 * objects.
 *
 * A 'remove' event is emitted with the document that has been removed and the index
 * the document has been removed from. This event can be silenced by passing false
 * as the second argument to remove.
 *
 * @param {Object} doc The document to remove from the index.
 * @param {Boolean} emitEvent Whether to emit remove events, defaults to true
 * @memberOf Index
 */
lunr.Index.prototype.remove = function (doc, emitEvent) {
  var docRef = doc[this._ref],
      emitEvent = emitEvent === undefined ? true : emitEvent

  if (!this.documentStore.has(docRef)) return

  var docTokens = this.documentStore.get(docRef)

  this.documentStore.remove(docRef)

  docTokens.forEach(function (token) {
    this.tokenStore.remove(token, docRef)
  }, this)

  if (emitEvent) this.eventEmitter.emit('remove', doc, this)
}

/**
 * Updates a document in the index.
 *
 * When a document contained within the index gets updated, fields changed,
 * added or removed, to make sure it correctly matched against search queries,
 * it should be updated in the index.
 *
 * This method is just a wrapper around `remove` and `add`
 *
 * An 'update' event is emitted with the document that has been updated and the index.
 * This event can be silenced by passing false as the second argument to update. Only
 * an update event will be fired, the 'add' and 'remove' events of the underlying calls
 * are silenced.
 *
 * @param {Object} doc The document to update in the index.
 * @param {Boolean} emitEvent Whether to emit update events, defaults to true
 * @see Index.prototype.remove
 * @see Index.prototype.add
 * @memberOf Index
 */
lunr.Index.prototype.update = function (doc, emitEvent) {
  var emitEvent = emitEvent === undefined ? true : emitEvent

  this.remove(doc, false)
  this.add(doc, false)

  if (emitEvent) this.eventEmitter.emit('update', doc, this)
}

/**
 * Calculates the inverse document frequency for a token within the index.
 *
 * @param {String} token The token to calculate the idf of.
 * @see Index.prototype.idf
 * @private
 * @memberOf Index
 */
lunr.Index.prototype.idf = function (term) {
  if (this._idfCache[term]) return this._idfCache[term]

  var documentFrequency = this.tokenStore.count(term),
      idf = 1

  if (documentFrequency > 0) {
    idf = 1 + Math.log(this.tokenStore.length / documentFrequency)
  }

  return this._idfCache[term] = idf
}

/**
 * Searches the index using the passed query.
 *
 * Queries should be a string, multiple words are allowed and will lead to an
 * AND based query, e.g. `idx.search('foo bar')` will run a search for
 * documents containing both 'foo' and 'bar'.
 *
 * All query tokens are passed through the same pipeline that document tokens
 * are passed through, so any language processing involved will be run on every
 * query term.
 *
 * Each query term is expanded, so that the term 'he' might be expanded to
 * 'hello' and 'help' if those terms were already included in the index.
 *
 * Matching documents are returned as an array of objects, each object contains
 * the matching document ref, as set for this index, and the similarity score
 * for this document against the query.
 *
 * @param {String} query The query to search the index with.
 * @returns {Object}
 * @see Index.prototype.idf
 * @see Index.prototype.documentVector
 * @memberOf Index
 */
lunr.Index.prototype.search = function (query) {
  var queryTokens = this.pipeline.run(lunr.tokenizer(query)),
      queryArr = lunr.utils.zeroFillArray(this.corpusTokens.length),
      documentSets = [],
      fieldBoosts = this._fields.reduce(function (memo, f) { return memo + f.boost }, 0)

  var hasSomeToken = queryTokens.some(function (token) {
    return this.tokenStore.has(token)
  }, this)

  if (!hasSomeToken) return []

  queryTokens
    .forEach(function (token, i, tokens) {
      var tf = 1 / tokens.length * this._fields.length * fieldBoosts,
          self = this

      var set = this.tokenStore.expand(token).reduce(function (memo, key) {
        var pos = self.corpusTokens.indexOf(key),
            idf = self.idf(key),
            similarityBoost = 1,
            set = new lunr.SortedSet

        // if the expanded key is not an exact match to the token then
        // penalise the score for this key by how different the key is
        // to the token.
        if (key !== token) {
          var diff = Math.max(3, key.length - token.length)
          similarityBoost = 1 / Math.log(diff)
        }

        // calculate the query tf-idf score for this token
        // applying an similarityBoost to ensure exact matches
        // these rank higher than expanded terms
        if (pos > -1) queryArr[pos] = tf * idf * similarityBoost

        // add all the documents that have this key into a set
        Object.keys(self.tokenStore.get(key)).forEach(function (ref) { set.add(ref) })

        return memo.union(set)
      }, new lunr.SortedSet)

      documentSets.push(set)
    }, this)

  var documentSet = documentSets.reduce(function (memo, set) {
    return memo.intersect(set)
  })

  var queryVector = new lunr.Vector (queryArr)

  return documentSet
    .map(function (ref) {
      return { ref: ref, score: queryVector.similarity(this.documentVector(ref)) }
    }, this)
    .sort(function (a, b) {
      return b.score - a.score
    })
}

/**
 * Generates a vector containing all the tokens in the document matching the
 * passed documentRef.
 *
 * The vector contains the tf-idf score for each token contained in the
 * document with the passed documentRef.  The vector will contain an element
 * for every token in the indexes corpus, if the document does not contain that
 * token the element will be 0.
 *
 * @param {Object} documentRef The ref to find the document with.
 * @returns {lunr.Vector}
 * @private
 * @memberOf Index
 */
lunr.Index.prototype.documentVector = function (documentRef) {
  var documentTokens = this.documentStore.get(documentRef),
      documentTokensLength = documentTokens.length,
      documentArr = lunr.utils.zeroFillArray(this.corpusTokens.length)

  for (var i = 0; i < documentTokensLength; i++) {
    var token = documentTokens.elements[i],
        tf = this.tokenStore.get(token)[documentRef].tf,
        idf = this.idf(token)

    documentArr[this.corpusTokens.indexOf(token)] = tf * idf
  };

  return new lunr.Vector (documentArr)
}

/**
 * Returns a representation of the index ready for serialisation.
 *
 * @returns {Object}
 * @memberOf Index
 */
lunr.Index.prototype.toJSON = function () {
  return {
    version: lunr.version,
    fields: this._fields,
    ref: this._ref,
    documentStore: this.documentStore.toJSON(),
    tokenStore: this.tokenStore.toJSON(),
    corpusTokens: this.corpusTokens.toJSON(),
    pipeline: this.pipeline.toJSON()
  }
}
/*!
 * lunr.Store
 * Copyright (C) 2013 Oliver Nightingale
 */

/**
 * lunr.Store is a simple key-value store used for storing sets of tokens for
 * documents stored in index.
 *
 * @constructor
 * @module
 */
lunr.Store = function () {
  this.store = {}
  this.length = 0
}

/**
 * Loads a previously serialised store
 *
 * @param {Object} serialisedData The serialised store to load.
 * @returns {lunr.Store}
 * @memberOf Store
 */
lunr.Store.load = function (serialisedData) {
  var store = new this

  store.length = serialisedData.length
  store.store = Object.keys(serialisedData.store).reduce(function (memo, key) {
    memo[key] = lunr.SortedSet.load(serialisedData.store[key])
    return memo
  }, {})

  return store
}

/**
 * Stores the given tokens in the store against the given id.
 *
 * @param {Object} id The key used to store the tokens against.
 * @param {Object} tokens The tokens to store against the key.
 * @memberOf Store
 */
lunr.Store.prototype.set = function (id, tokens) {
  this.store[id] = tokens
  this.length = Object.keys(this.store).length
}

/**
 * Retrieves the tokens from the store for a given key.
 *
 * @param {Object} id The key to lookup and retrieve from the store.
 * @returns {Object}
 * @memberOf Store
 */
lunr.Store.prototype.get = function (id) {
  return this.store[id]
}

/**
 * Checks whether the store contains a key.
 *
 * @param {Object} id The id to look up in the store.
 * @returns {Boolean}
 * @memberOf Store
 */
lunr.Store.prototype.has = function (id) {
  return id in this.store
}

/**
 * Removes the value for a key in the store.
 *
 * @param {Object} id The id to remove from the store.
 * @memberOf Store
 */
lunr.Store.prototype.remove = function (id) {
  if (!this.has(id)) return

  delete this.store[id]
  this.length--
}

/**
 * Returns a representation of the store ready for serialisation.
 *
 * @returns {Object}
 * @memberOf Store
 */
lunr.Store.prototype.toJSON = function () {
  return {
    store: this.store,
    length: this.length
  }
}

/*!
 * lunr.stemmer
 * Copyright (C) 2013 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartaurs.org/~martin
 *
 * @module
 * @param {String} str The string to stem
 * @returns {String}
 * @see lunr.Pipeline
 */
lunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  return function (w) {
    var   stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = /^(.+?)(ss|i)es$/;
    re2 = /^(.+?)([^s])s$/;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = /^(.+?)eed$/;
    re2 = /^(.+?)(ed|ing)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = new RegExp(mgr0);
      if (re.test(fp[1])) {
        re = /.$/;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = new RegExp(s_v);
      if (re2.test(stem)) {
        w = stem;
        re2 = /(at|bl|iz)$/;
        re3 = new RegExp("([^aeiouylsz])\\1$");
        re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
        if (re2.test(w)) {  w = w + "e"; }
        else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c
    re = /^(.+?)y$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(s_v);
      if (re.test(stem)) { w = stem + "i"; }
    }

    // Step 2
    re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    re2 = /^(.+?)(s|t)(ion)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = new RegExp(mgr1);
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = /^(.+?)e$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      re2 = new RegExp(meq1);
      re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = /ll$/;
    re2 = new RegExp(mgr1);
    if (re.test(w) && re2.test(w)) {
      re = /.$/;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  }
})();

lunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer')
/*!
 * lunr.stopWordFilter
 * Copyright (C) 2013 Oliver Nightingale
 */

/**
 * lunr.stopWordFilter is an English language stop word list filter, any words
 * contained in the list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 *
 * @module
 * @param {String} token The token to pass through the filter
 * @returns {String}
 * @see lunr.Pipeline
 */
lunr.stopWordFilter = function (token) {
  if (lunr.stopWordFilter.stopWords.indexOf(token) === -1) return token
}

lunr.stopWordFilter.stopWords = new lunr.SortedSet
lunr.stopWordFilter.stopWords.length = 119
lunr.stopWordFilter.stopWords.elements = [
  "",
  "a",
  "able",
  "about",
  "across",
  "after",
  "all",
  "almost",
  "also",
  "am",
  "among",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "but",
  "by",
  "can",
  "cannot",
  "could",
  "dear",
  "did",
  "do",
  "does",
  "either",
  "else",
  "ever",
  "every",
  "for",
  "from",
  "get",
  "got",
  "had",
  "has",
  "have",
  "he",
  "her",
  "hers",
  "him",
  "his",
  "how",
  "however",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "just",
  "least",
  "let",
  "like",
  "likely",
  "may",
  "me",
  "might",
  "most",
  "must",
  "my",
  "neither",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "often",
  "on",
  "only",
  "or",
  "other",
  "our",
  "own",
  "rather",
  "said",
  "say",
  "says",
  "she",
  "should",
  "since",
  "so",
  "some",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "tis",
  "to",
  "too",
  "twas",
  "us",
  "wants",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "would",
  "yet",
  "you",
  "your"
]

lunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter')
/*!
 * lunr.stemmer
 * Copyright (C) 2013 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.TokenStore is used for efficient storing and lookup of the reverse
 * index of token to document ref.
 *
 * @constructor
 */
lunr.TokenStore = function () {
  this.root = { docs: {} }
  this.length = 0
}

/**
 * Loads a previously serialised token store
 *
 * @param {Object} serialisedData The serialised token store to load.
 * @returns {lunr.TokenStore}
 * @memberOf TokenStore
 */
lunr.TokenStore.load = function (serialisedData) {
  var store = new this

  store.root = serialisedData.root
  store.length = serialisedData.length

  return store
}

/**
 * Adds a new token doc pair to the store.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to store the doc under
 * @param {Object} doc The doc to store against the token
 * @param {Object} root An optional node at which to start looking for the
 * correct place to enter the doc, by default the root of this lunr.TokenStore
 * is used.
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.add = function (token, doc, root) {
  var root = root || this.root,
      key = token[0],
      rest = token.slice(1)

  if (!(key in root)) root[key] = {docs: {}}

  if (rest.length === 0) {
    root[key].docs[doc.ref] = doc
    this.length += 1
    return
  } else {
    return this.add(rest, doc, root[key])
  }
}

/**
 * Checks whether this key is contained within this lunr.TokenStore.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to check for
 * @param {Object} root An optional node at which to start
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.has = function (token) {
  if (!token) return false

  var node = this.root

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return false

    node = node[token[i]]
  }

  return true
}

/**
 * Retrieve a node from the token store for a given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the node for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @see TokenStore.prototype.get
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.getNode = function (token) {
  if (!token) return {}

  var node = this.root

  for (var i = 0; i < token.length; i++) {
    if (!node[token[i]]) return {}

    node = node[token[i]]
  }

  return node
}

/**
 * Retrieve the documents for a node for the given token.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.get = function (token, root) {
  return this.getNode(token, root).docs || {}
}

lunr.TokenStore.prototype.count = function (token, root) {
  return Object.keys(this.get(token, root)).length
}

/**
 * Remove the document identified by ref from the token in the store.
 *
 * By default this function starts at the root of the current store, however
 * it can start at any node of any token store if required.
 *
 * @param {String} token The token to get the documents for.
 * @param {String} ref The ref of the document to remove from this token.
 * @param {Object} root An optional node at which to start.
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.remove = function (token, ref) {
  if (!token) return
  var node = this.root

  for (var i = 0; i < token.length; i++) {
    if (!(token[i] in node)) return
    node = node[token[i]]
  }

  delete node.docs[ref]
}

/**
 * Find all the possible suffixes of the passed token using tokens
 * currently in the store.
 *
 * @param {String} token The token to expand.
 * @returns {Array}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.expand = function (token, memo) {
  var root = this.getNode(token),
      docs = root.docs || {},
      memo = memo || []

  if (Object.keys(docs).length) memo.push(token)

  Object.keys(root)
    .forEach(function (key) {
      if (key === 'docs') return

      memo.concat(this.expand(token + key, memo))
    }, this)

  return memo
}

/**
 * Returns a representation of the token store ready for serialisation.
 *
 * @returns {Object}
 * @memberOf TokenStore
 */
lunr.TokenStore.prototype.toJSON = function () {
  return {
    root: this.root,
    length: this.length
  }
}


});
require.register("wyuenho-backgrid-filter/backgrid-filter.js", function(exports, require, module){
/*
  backgrid-filter
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("underscore"),
                             require("backbone"),
                             require("backgrid"),
                             require("lunr"));
  }
  // Browser
  else if (typeof _ !== "undefined" &&
           typeof Backbone !== "undefined" &&
           typeof Backgrid !== "undefined" &&
           typeof lunr !== "undefined") {
    factory(_, Backbone, Backgrid, lunr);
  }

}(function (_, Backbone, Backgrid, lunr) {

  "use strict";

  /**
     ServerSideFilter is a search form widget that submits a query to the server
     for filtering the current collection.

     @class Backgrid.Extension.ServerSideFilter
  */
  var ServerSideFilter = Backgrid.Extension.ServerSideFilter = Backbone.View.extend({

    /** @property */
    tagName: "form",

    /** @property */
    className: "backgrid-filter form-search",

    /** @property {function(Object, ?Object=): string} template */
    template: _.template('<span class="search">&nbsp;</span><input type="search" <% if (placeholder) { %> placeholder="<%- placeholder %>" <% } %> name="<%- name %>" /><a class="clear" data-backgrid-action="clear" href="#">&times;</a>', null, {variable: null}),

    /** @property */
    events: {
      "keyup input[type=search]": "showClearButtonMaybe",
      "click a[data-backgrid-action=clear]": "clear",
      "submit": "search"
    },

    /** @property {string} [name='q'] Query key */
    name: "q",

    /**
       @property {string} [placeholder] The HTML5 placeholder to appear beneath
       the search box.
    */
    placeholder: null,

    /**
       @param {Object} options
       @param {Backbone.Collection} options.collection
       @param {string} [options.name]
       @param {string} [options.placeholder]
    */
    initialize: function (options) {
      ServerSideFilter.__super__.initialize.apply(this, arguments);
      this.name = options.name || this.name;
      this.placeholder = options.placeholder || this.placeholder;

      // Persist the query on pagination
      var collection = this.collection, self = this;
      if (Backbone.PageableCollection &&
          collection instanceof Backbone.PageableCollection &&
          collection.mode == "server") {
        collection.queryParams[this.name] = function () {
          return self.searchBox().val() || null;
        };
      }
    },

    /**
       Event handler. Show the clear button when the search box has text, hide
       it otherwise.
     */
    showClearButtonMaybe: function () {
      var $clearButton = this.clearButton();
      var searchTerms = this.searchBox().val();
      if (searchTerms) $clearButton.show();
      else $clearButton.hide();
    },

    /**
       Returns the search input box.
     */
    searchBox: function () {
      return this.$el.find("input[type=search]");
    },

    /**
       Returns the clear button.
     */
    clearButton: function () {
      return this.$el.find("a[data-backgrid-action=clear]");
    },

    /**
       Upon search form submission, this event handler constructs a query
       parameter object and pass it to Collection#fetch for server-side
       filtering.
    */
    search: function (e) {
      if (e) e.preventDefault();

      var data = {};

      // go back to the first page on search
      var collection = this.collection;
      if (Backbone.PageableCollection &&
          collection instanceof Backbone.PageableCollection &&
          collection.mode == "server") {
        collection.state.currentPage = collection.state.firstPage;
      }
      else {
        var query = this.searchBox().val();
        if (query) data[this.name] = query;
      }

      collection.fetch({data: data, reset: true});
    },

    /**
       Event handler for the clear button. Clears the search box and refetch the
       collection.
    */
    clear: function (e) {
      if (e) e.preventDefault();
      this.searchBox().val(null);
      this.showClearButtonMaybe();
      this.collection.fetch({reset: true});
    },

    /**
       Renders a search form with a text box, optionally with a placeholder and
       a preset value if supplied during initialization.
    */
    render: function () {
      this.$el.empty().append(this.template({
        name: this.name,
        placeholder: this.placeholder,
        value: this.value
      }));
      this.showClearButtonMaybe();
      this.delegateEvents();
      return this;
    }

  });

  /**
     ClientSideFilter is a search form widget that searches a collection for
     model matches against a query on the client side. The exact matching
     algorithm can be overriden by subclasses.

     @class Backgrid.Extension.ClientSideFilter
     @extends Backgrid.Extension.ServerSideFilter
  */
  var ClientSideFilter = Backgrid.Extension.ClientSideFilter = ServerSideFilter.extend({

    /** @property */
    events: _.extend({}, ServerSideFilter.prototype.events, {
      "click a[data-backgrid-action=clear]": function (e) {
        e.preventDefault();
        this.clear();
      },
      "keydown input[type=search]": "search",
      "submit": function (e) {
        e.preventDefault();
        this.search();
      }
    }),

    /**
       @property {?Array.<string>} [fields] A list of model field names to
       search for matches. If null, all of the fields will be searched.
    */
    fields: null,

    /**
       @property [wait=149] The time in milliseconds to wait since the last
       change to the search box's value before searching. This value can be
       adjusted depending on how often the search box is used and how large the
       search index is.
    */
    wait: 149,

    /**
       Debounces the #search and #clear methods and makes a copy of the given
       collection for searching.

       @param {Object} options
       @param {Backbone.Collection} options.collection
       @param {string} [options.placeholder]
       @param {string} [options.fields]
       @param {string} [options.wait=149]
    */
    initialize: function (options) {
      ClientSideFilter.__super__.initialize.apply(this, arguments);

      this.fields = options.fields || this.fields;
      this.wait = options.wait || this.wait;

      this._debounceMethods(["search", "clear"]);

      var collection = this.collection = this.collection.fullCollection || this.collection;
      var shadowCollection = this.shadowCollection = collection.clone();

      this.listenTo(collection, "add", function (model, collection, options) {
        shadowCollection.add(model, options);
      });
      this.listenTo(collection, "remove", function (model, collection, options) {
        shadowCollection.remove(model, options);
      });
      this.listenTo(collection, "sort", function (col) {
        if (!this.searchBox().val()) shadowCollection.reset(col.models);
      });
      this.listenTo(collection, "reset", function (col, options) {
        options = _.extend({reindex: true}, options || {});
        if (options.reindex && col === collection &&
            options.from == null && options.to == null) {
          shadowCollection.reset(col.models);
        }
      });
    },

    _debounceMethods: function (methodNames) {
      if (_.isString(methodNames)) methodNames = [methodNames];

      this.undelegateEvents();

      for (var i = 0, l = methodNames.length; i < l; i++) {
        var methodName = methodNames[i];
        var method = this[methodName];
        this[methodName] = _.debounce(method, this.wait);
      }

      this.delegateEvents();
    },

    /**
       Constructs a Javascript regular expression object for #makeMatcher.

       This default implementation takes a query string and returns a Javascript
       RegExp object that matches any of the words contained in the query string
       case-insensitively. Override this method to return a different regular
       expression matcher if this behavior is not desired.

       @param {string} query The search query in the search box.
       @return {RegExp} A RegExp object to match against model #fields.
     */
    makeRegExp: function (query) {
      return new RegExp(query.trim().split(/\s+/).join("|"), "i");
    },

    /**
       This default implementation takes a query string and returns a matcher
       function that looks for matches in the model's #fields or all of its
       fields if #fields is null, for any of the words in the query
       case-insensitively using the regular expression object returned from
       #makeRegExp.

       Most of time, you'd want to override the regular expression used for
       matching. If so, please refer to the #makeRegExp documentation,
       otherwise, you can override this method to return a custom matching
       function.

       Subclasses overriding this method must take care to conform to the
       signature of the matcher function. The matcher function is a function
       that takes a model as paramter and returns true if the model matches a
       search, or false otherwise.

       In addition, when the matcher function is called, its context will be
       bound to this ClientSideFilter object so it has access to the filter's
       attributes and methods.

       @param {string} query The search query in the search box.
       @return {function(Backbone.Model):boolean} A matching function.
    */
    makeMatcher: function (query) {
      var regexp = this.makeRegExp(query);
      return function (model) {
        var keys = this.fields || model.keys();
        for (var i = 0, l = keys.length; i < l; i++) {
          if (regexp.test(model.get(keys[i]) + "")) return true;
        }
        return false;
      };
    },

    /**
       Takes the query from the search box, constructs a matcher with it and
       loops through collection looking for matches. Reset the given collection
       when all the matches have been found.
    */
    search: function () {
      var matcher = _.bind(this.makeMatcher(this.searchBox().val()), this);
      var col = this.collection;
      if (col.pageableCollection) col.pageableCollection.getFirstPage({silent: true});
      this.collection.reset(this.shadowCollection.filter(matcher), {reindex: false});
    },

    /**
       Clears the search box and reset the collection to its original.
    */
    clear: function () {
      this.searchBox().val(null);
      this.collection.reset(this.shadowCollection.models, {reindex: false});
    }

  });

  /**
     LunrFilter is a ClientSideFilter that uses [lunrjs](http://lunrjs.com/) to
     index the text fields of each model for a collection, and performs
     full-text searching.

     @class Backgrid.Extension.LunrFilter
     @extends Backgrid.Extension.ClientSideFilter
  */
  var LunrFilter = Backgrid.Extension.LunrFilter = ClientSideFilter.extend({

    /**
       @property {string} [ref="id"]｀lunrjs` document reference attribute name.
    */
    ref: "id",

    /**
       @property {Object} fields A hash of `lunrjs` index field names and boost
       value. Unlike ClientSideFilter#fields, LunrFilter#fields is _required_ to
       initialize the index.
    */
    fields: null,

    /**
       Indexes the underlying collection on construction. The index will refresh
       when the underlying collection is reset. If any model is added, removed
       or if any indexed fields of any models has changed, the index will be
       updated.

       @param {Object} options
       @param {Backbone.Collection} options.collection
       @param {string} [options.placeholder]
       @param {string} [options.ref] ｀lunrjs` document reference attribute name.
       @param {Object} [options.fields] A hash of `lunrjs` index field names and
       boost value.
       @param {number} [options.wait]
    */
    initialize: function (options) {
      LunrFilter.__super__.initialize.apply(this, arguments);

      this.ref = options.ref || this.ref;

      var collection = this.collection = this.collection.fullCollection || this.collection;
      this.listenTo(collection, "add", this.addToIndex);
      this.listenTo(collection, "remove", this.removeFromIndex);
      this.listenTo(collection, "reset", this.resetIndex);
      this.listenTo(collection, "change", this.updateIndex);

      this.resetIndex(collection);
    },

    /**
       Reindex the collection. If `options.reindex` is `false`, this method is a
       no-op.

       @param {Backbone.Collection} collection
       @param {Object} [options]
       @param {boolean} [options.reindex=true]
    */
    resetIndex: function (collection, options) {
      options = _.extend({reindex: true}, options || {});

      if (options.reindex) {
        var self = this;
        this.index = lunr(function () {
          _.each(self.fields, function (boost, fieldName) {
            this.field(fieldName, boost);
            this.ref(self.ref);
          }, this);
        });

        collection.each(function (model) {
          this.addToIndex(model);
        }, this);
      }
    },

    /**
       Adds the given model to the index.

       @param {Backbone.Model} model
    */
    addToIndex: function (model) {
      var index = this.index;
      var doc = model.toJSON();
      if (index.documentStore.has(doc[this.ref])) index.update(doc);
      else index.add(doc);
    },

    /**
       Removes the given model from the index.

       @param {Backbone.Model} model
    */
    removeFromIndex: function (model) {
      var index = this.index;
      var doc = model.toJSON();
      if (index.documentStore.has(doc[this.ref])) index.remove(doc);
    },

    /**
       Updates the index for the given model.

       @param {Backbone.Model} model
    */
    updateIndex: function (model) {
      var changed = model.changedAttributes();
      if (changed && !_.isEmpty(_.intersection(_.keys(this.fields),
                                               _.keys(changed)))) {
        this.index.update(model.toJSON());
      }
    },

    /**
       Takes the query from the search box and performs a full-text search on
       the client-side. The search result is returned by resetting the
       underlying collection to the models after interrogating the index for the
       query answer.
    */
    search: function () {
      var searchResults = this.index.search(this.searchBox().val());
      var models = [];
      for (var i = 0; i < searchResults.length; i++) {
        var result = searchResults[i];
        models.push(this.shadowCollection.get(result.ref));
      }
      var col = this.collection;
      if (col.pageableCollection) col.pageableCollection.getFirstPage({silent: true});
      col.reset(models, {reindex: false});
    }

  });

}));

});
require.register("wyuenho-backgrid-select-all/backgrid-select-all.js", function(exports, require, module){
/*
  backgrid-select-all
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("backbone"), require("backgrid"));
  }
  // Browser
  else if (typeof Backbone !== "undefined" && typeof Backgrid !== "undefined") {
    factory(Backbone, Backgrid);
  }

}(function (Backbone, Backgrid)  {

  "use strict";

  var $ = Backbone.$;

  /**
     Renders a checkbox for row selection.

     @class Backgrid.Extension.SelectRowCell
     @extends Backbone.View
  */
  var SelectRowCell = Backgrid.Extension.SelectRowCell = Backbone.View.extend({

    /** @property */
    className: "select-row-cell",

    /** @property */
    tagName: "td",

    /** @property */
    events: {
      "keydown :checkbox": "onKeydown",
      "change :checkbox": "onChange",
      "click :checkbox": "enterEditMode"
    },

    /**
       Initializer. If the underlying model triggers a `select` event, this cell
       will change its checked value according to the event's `selected` value.

       @param {Object} options
       @param {Backgrid.Column} options.column
       @param {Backbone.Model} options.model
    */
    initialize: function (options) {

      this.column = options.column;
      if (!(this.column instanceof Backgrid.Column)) {
        this.column = new Backgrid.Column(this.column);
      }

      this.listenTo(this.model, "backgrid:select", function (model, selected) {
        this.$el.find(":checkbox").prop("checked", selected).change();
      });

      var column = this.column, $el = this.$el;
      this.listenTo(column, "change:renderable", function (column, renderable) {
        $el.toggleClass("renderable", renderable);
      });

      if (column.get("renderable")) $el.addClass("renderable");
    },

    /**
       Focuses the checkbox.
    */
    enterEditMode: function () {
      this.$el.find(":checkbox").focus();
    },

    /**
       Unfocuses the checkbox.
    */
    exitEditMode: function () {
      this.$el.find(":checkbox").blur();
    },

    /**
       Process keyboard navigation.
    */
    onKeydown: function (e) {
      var command = new Backgrid.Command(e);
      if (command.passThru()) return true; // skip ahead to `change`
      if (command.cancel()) {
        e.stopPropagation();
        this.$el.find(":checkbox").blur();
      }
      else if (command.save() || command.moveLeft() || command.moveRight() ||
               command.moveUp() || command.moveDown()) {
        e.preventDefault();
        e.stopPropagation();
        this.model.trigger("backgrid:edited", this.model, this.column, command);
      }
    },

    /**
       When the checkbox's value changes, this method will trigger a Backbone
       `backgrid:selected` event with a reference of the model and the
       checkbox's `checked` value.
    */
    onChange: function (e) {
      var checked = $(e.target).prop('checked');
      this.$el.parent().toggleClass('selected', checked);
      this.model.trigger("backgrid:selected", this.model, checked);
    },

    /**
       Renders a checkbox in a table cell.
    */
    render: function () {
      this.$el.empty().append('<input tabindex="-1" type="checkbox" />');
      this.delegateEvents();
      return this;
    }

  });

  /**
     Renders a checkbox to select all rows on the current page.

     @class Backgrid.Extension.SelectAllHeaderCell
     @extends Backgrid.Extension.SelectRowCell
  */
  var SelectAllHeaderCell = Backgrid.Extension.SelectAllHeaderCell = SelectRowCell.extend({

    /** @property */
    className: "select-all-header-cell",

    /** @property */
    tagName: "th",

    /**
       Initializer. When this cell's checkbox is checked, a Backbone
       `backgrid:select` event will be triggered for each model for the current
       page in the underlying collection. If a `SelectRowCell` instance exists
       for the rows representing the models, they will check themselves. If any
       of the SelectRowCell instances trigger a Backbone `backgrid:selected`
       event with a `false` value, this cell will uncheck its checkbox. In the
       event of a Backbone `backgrid:refresh` event, which is triggered when the
       body refreshes its rows, which can happen under a number of conditions
       such as paging or the columns were reset, this cell will still remember
       the previously selected models and trigger a Backbone `backgrid:select`
       event on them such that the SelectRowCells can recheck themselves upon
       refreshing.

       @param {Object} options
       @param {Backgrid.Column} options.column
       @param {Backbone.Collection} options.collection
    */
    initialize: function (options) {

      this.column = options.column;
      if (!(this.column instanceof Backgrid.Column)) {
        this.column = new Backgrid.Column(this.column);
      }

      var collection = this.collection;
      var selectedModels = this.selectedModels = {};
      this.listenTo(collection, "backgrid:selected", function (model, selected) {
        if (selected) selectedModels[model.id || model.cid] = model;
        else {
          delete selectedModels[model.id || model.cid];
          this.$el.find(":checkbox").prop("checked", false);
        }
      });

      this.listenTo(collection, "remove", function (model) {
        delete selectedModels[model.id || model.cid];
      });

      this.listenTo(collection, "backgrid:refresh", function () {
        this.$el.find(":checkbox").prop("checked", false);
        for (var i = 0; i < collection.length; i++) {
          var model = collection.at(i);
          if (selectedModels[model.id || model.cid]) {
            model.trigger('backgrid:select', model, true);
          }
        }
      });

      var column = this.column, $el = this.$el;
      this.listenTo(column, "change:renderable", function (column, renderable) {
        $el.toggleClass("renderable", renderable);
      });

      if (column.get("renderable")) $el.addClass("renderable");
    },

    /**
       Progagates the checked value of this checkbox to all the models of the
       underlying collection by triggering a Backbone `backgrid:select` event on
       the models themselves, passing each model and the current `checked` value
       of the checkbox in each event.
    */
    onChange: function (e) {
      var checked = $(e.target).prop("checked");

      var collection = this.collection;
      collection.each(function (model) {
        model.trigger("backgrid:select", model, checked);
      });
    }

  });

  /**
     Convenient method to retrieve a list of selected models. This method only
     exists when the `SelectAll` extension has been included.

     @member Backgrid.Grid
     @return {Array.<Backbone.Model>}
  */
  Backgrid.Grid.prototype.getSelectedModels = function () {
    var selectAllHeaderCell;
    var headerCells = this.header.row.cells;
    for (var i = 0, l = headerCells.length; i < l; i++) {
      var headerCell = headerCells[i];
      if (headerCell instanceof SelectAllHeaderCell) {
        selectAllHeaderCell = headerCell;
        break;
      }
    }

    var result = [];
    if (selectAllHeaderCell) {
      for (var modelId in selectAllHeaderCell.selectedModels) {
        result.push(this.collection.get(modelId));
      }
    }

    return result;
  };

}));

});
require.register("wyuenho-backgrid-text-cell/backgrid-text-cell.js", function(exports, require, module){
/*
  backgrid-text-cell
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("underscore"),
                             require("backgrid"));
  }
  // Browser
  else if (typeof _ !== "undefined" &&
           typeof Backgrid !== "undefined") {
    factory(_, Backgrid);
  }

}(function (_, Backgrid)  {

  /**
     Renders a form with a text area and a save button in a modal dialog.

     @class Backgrid.Extension.TextareaEditor
     @extends Backgrid.CellEditor
  */
  var TextareaEditor = Backgrid.Extension.TextareaEditor = Backgrid.CellEditor.extend({

    /** @property */
    tagName: "div",

    /** @property */
    className: "modal hide fade",

    /** @property {function(Object, ?Object=): string} template */
    template: _.template('<form><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h3><%- column.get("label") %></h3></div><div class="modal-body"><textarea cols="<%= cols %>" rows="<%= rows %>"><%- content %></textarea></div><div class="modal-footer"><input class="btn" type="submit" value="Save"/></div></form>', null, {variable: null}),

    /** @property */
    cols: 80,

    /** @property */
    rows: 10,

    /** @property */
    events: {
      "keydown textarea": "clearError",
      "submit": "saveOrCancel",
      "hide": "saveOrCancel",
      "hidden": "close",
      "shown": "focus"
    },

    /**
       @property {Object} modalOptions The options passed to Bootstrap's modal
       plugin.
    */
    modalOptions: {
      backdrop: false
    },

    /**
       Renders a modal form dialog with a textarea, submit button and a close button.
    */
    render: function () {
      this.$el.html($(this.template({
        column: this.column,
        cols: this.cols,
        rows: this.rows,
        content: this.formatter.fromRaw(this.model.get(this.column.get("name")))
      })));

      this.delegateEvents();

      this.$el.modal(this.modalOptions);

      return this;
    },

    /**
       Event handler. Saves the text in the text area to the model when
       submitting. When cancelling, if the text area is dirty, a confirmation
       dialog will pop up. If the user clicks confirm, the text will be saved to
       the model.

       Triggers a Backbone `backgrid:error` event from the model along with the
       model, column and the existing value as the parameters if the value
       cannot be converted.

       @param {Event} e
    */
    saveOrCancel: function (e) {
      if (e && e.type == "submit") {
        e.preventDefault();
        e.stopPropagation();
      }

      var model = this.model;
      var column = this.column;
      var val = this.$el.find("textarea").val();
      var newValue = this.formatter.toRaw(val);

      if (_.isUndefined(newValue)) {
        model.trigger("backgrid:error", model, column, val);

        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      else if (!e || e.type == "submit" ||
               (e.type == "hide" &&
                newValue !== (this.model.get(this.column.get("name")) || '').replace(/\r/g, '') &&
                confirm("Would you like to save your changes?"))) {

        model.set(column.get("name"), newValue);
        this.$el.modal("hide");
      }
      else if (e.type != "hide") this.$el.modal("hide");
    },

    /**
       Clears the error class on the parent cell.
     */
    clearError: _.debounce(function () {
      if (!_.isUndefined(this.formatter.toRaw(this.$el.find("textarea").val()))) {
        this.$el.parent().removeClass("error");
      }
    }, 150),

    /**
       Triggers a `backgrid:edited` event along with the cell editor as the
       parameter after the modal is hidden.

       @param {Event} e
    */
    close: function (e) {
      var model = this.model;
      model.trigger("backgrid:edited", model, this.column,
                    new Backgrid.Command(e));
    },

    /**
       Focuses the textarea when the modal is shown.
    */
    focus: function () {
      this.$el.find("textarea").focus();
    }

  });

  /**
     TextCell is a string cell type that renders a form with a text area in a
     modal dialog instead of an input box editor. It is best suited for entering
     a large body of text.

     @class Backgrid.Extension.TextCell
     @extends Backgrid.StringCell
  */
  Backgrid.Extension.TextCell = Backgrid.StringCell.extend({

    /** @property */
    className: "text-cell",

    /** @property  */
    editor: TextareaEditor

  });

}));

});
require.register("moment-moment/moment.js", function(exports, require, module){
//! moment.js
//! version : 2.4.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.4.0",
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO seperator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        // preliminary iso regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000)
        isoRegex = /^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d:?\d\d|Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            'YYYY-MM-DD',
            'GGGG-[W]WW',
            'GGGG-[W]WW-E',
            'YYYY-DDD'
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return this.weekYear();
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return this.isoWeekYear();
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(10 * a / 6), 4);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // store reference to input for deterministic cloning
        this._input = duration;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, ignoreUpdateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months,
            minutes,
            hours;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        // store the minutes and hours so we can restore them
        if (days || months) {
            minutes = mom.minute();
            hours = mom.hour();
        }
        if (days) {
            mom.date(mom.date() + days * isAdding);
        }
        if (months) {
            mom.month(mom.month() + months * isAdding);
        }
        if (milliseconds && !ignoreUpdateOffset) {
            moment.updateOffset(mom);
        }
        // restore the minutes and hours after possibly changing dst
        if (days || months) {
            mom.minute(minutes);
            mom.hour(hours);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop,
            index;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function initializeParsingFlags(config) {
        config._pf = {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a;
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return parseTokenFourDigits;
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return parseTokenSixDigits;
        case 'S':
        case 'SS':
        case 'SSS':
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        var tzchunk = (parseTokenTimezone.exec(string) || [])[0],
            parts = (tzchunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
            break;
        case 'YYYY' :
        case 'YYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gg':
        case 'gggg':
        case 'GG':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = input;
            }
            break;
        }
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate,
            yearToUse, fixYear, w, temp, lang, weekday, week;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            fixYear = function (val) {
                return val ?
                  (val.length < 3 ? (parseInt(val, 10) > 68 ? '19' + val : '20' + val) : val) :
                  (config._a[YEAR] == null ? moment().weekYear() : config._a[YEAR]);
            };

            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                temp = dayOfYearFromWeeks(fixYear(w.GG), w.W || 1, w.E, 4, 1);
            }
            else {
                lang = getLangDefinition(config._l);
                weekday = w.d != null ?  parseWeekday(w.d, lang) :
                  (w.e != null ?  parseInt(w.e, 10) + lang._week.dow : 0);

                week = parseInt(w.w, 10) || 1;

                //if we're parsing 'd', then the low day numbers may be next week
                if (w.d != null && weekday < lang._week.dow) {
                    week++;
                }

                temp = dayOfYearFromWeeks(fixYear(w.gg), week, weekday, lang._week.doy, lang._week.dow);
            }

            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = config._a[YEAR] == null ? currentDate[YEAR] : config._a[YEAR];

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[HOUR] += toInt((config._tzm || 0) / 60);
        input[MINUTE] += toInt((config._tzm || 0) % 60);

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (getParseRegexForToken(token, config).exec(string) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            initializeParsingFlags(tempConfig);
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function makeDateFromString(config) {
        var i,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 4; i > 0; i--) {
                if (match[i]) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i - 1] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0; i < 4; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (parseTokenTimezone.exec(string)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        }
        else {
            config._d = new Date(string);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else {
            config._d = new Date(input);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = new Date(Date.UTC(year, 0)).getUTCDay(),
            daysToAdd, dayOfYear;

        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (typeof config._pf === 'undefined') {
            initializeParsingFlags(config);
        }

        if (input === null) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = extend({}, input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        return makeMoment({
            _i : input,
            _f : format,
            _l : lang,
            _strict : strict,
            _isUTC : false
        });
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var m;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        m = makeMoment({
            _useUTC : true,
            _isUTC : true,
            _l : lang,
            _i : input,
            _f : format,
            _strict : strict
        }).utc();

        return m;
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var isDuration = moment.isDuration(input),
            isNumber = (typeof input === 'number'),
            duration = (isDuration ? input._input : (isNumber ? {} : input)),
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso,
            timeEmpty,
            dateTimeEmpty;

        if (isNumber) {
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (isDuration && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment;
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function (input) {
        return moment(input).parseZone();
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            return formatMoment(moment(this).utc(), 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = this._isUTC ? moment(input).zone(this._offset || 0) : moment(input).local(),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            var diff = this.diff(moment().zone(this.zone()).startOf('day'), 'days', true),
                format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : function (input) {
            var utc = this._isUTC ? 'UTC' : '',
                dayOfMonth;

            if (input != null) {
                if (typeof input === 'string') {
                    input = this.lang().monthsParse(input);
                    if (typeof input !== 'number') {
                        return this;
                    }
                }

                dayOfMonth = this.date();
                this.date(1);
                this._d['set' + utc + 'Month'](input);
                this.date(Math.min(dayOfMonth, this.daysInMonth()));

                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + 'Month']();
            }
        },

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) === +moment(input).startOf(units);
        },

        min: function (other) {
            other = moment.apply(null, arguments);
            return other < this ? this : other;
        },

        max: function (other) {
            other = moment.apply(null, arguments);
            return other > this ? this : other;
        },

        zone : function (input) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    addOrSubtractDurationFromMoment(this, moment.duration(offset - input, 'm'), 1, true);
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + 's'] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(deprecate) {
        var warned = false, local_moment = moment;
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        if (deprecate) {
            this.moment = function () {
                if (!warned && console && console.warn) {
                    warned = true;
                    console.warn(
                            "Accessing Moment through the global scope is " +
                            "deprecated, and will be removed in an upcoming " +
                            "release.");
                }
                return local_moment.apply(null, arguments);
            };
        } else {
            this['moment'] = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
        makeGlobal(true);
    } else if (typeof define === "function" && define.amd) {
        define("moment", function (require, exports, module) {
            if (module.config().noGlobal !== true) {
                // If user provided noGlobal, he is aware of global
                makeGlobal(module.config().noGlobal === undefined);
            }

            return moment;
        });
    } else {
        makeGlobal();
    }
}).call(this);

});
require.register("wyuenho-backgrid-moment-cell/backgrid-moment-cell.js", function(exports, require, module){
/*
  backgrid-moment-cell
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("underscore"), require("backgrid"),
                             require("moment"));
  }
  // Browser
  else if (typeof _ !== "undefined" &&
           typeof Backgrid !== "undefined" &&
           typeof moment !== "undefined") {
    factory(_, Backgrid, moment);
  }

}(function (_, Backgrid, moment) {

  /**
     MomentFormatter converts bi-directionally any datetime values in any format
     supported by [moment()](http://momentjs.com/docs/#/parsing/) to any
     datetime format
     [moment.fn.format()](http://momentjs.com/docs/#/displaying/format/)
     supports.

     @class Backgrid.Extension.MomentFormatter
     @extends Backgrid.CellFormatter
     @constructor
   */
  var MomentFormatter = Backgrid.Extension.MomentFormatter = function (options) {
    _.extend(this, this.defaults, options);
  };
  MomentFormatter.prototype = new Backgrid.CellFormatter;
  _.extend(MomentFormatter.prototype, {

    /**
       @cfg {Object} options

       @cfg {boolean} [options.modelInUnixOffset=false] Whether the model values
       should be read/written as the number of milliseconds since UNIX Epoch.

       @cfg {boolean} [options.modelInUnixTimestamp=false] Whether the model
       values should be read/written as the number of seconds since UNIX Epoch.

       @cfg {boolean} [options.modelInUTC=true] Whether the model values should
       be read/written in UTC mode or local mode.

       @cfg {string} [options.modelLang=moment.lang()] The locale the model
       values should be read/written in.

       @cfg {string} [options.modelFormat=moment.defaultFormat] The format this
       moment formatter should use to read/write model values. Only meaningful if
       the values are strings.

       @cfg {boolean} [options.displayInUnixOffset=false] Whether the display
       values should be read/written as the number of milliseconds since UNIX
       Epoch.

       @cfg {boolean} [options.displayInUnixTimestamp=false] Whether the display
       values should be read/written as the number of seconds since UNIX Epoch.

       @cfg {boolean} [options.displayInUTC=true] Whether the display values
       should be read/written in UTC mode or local mode.

       @cfg {string} [options.displayLang=moment.lang()] The locale the display
       values should be read/written in.

       @cfg {string} [options.displayFormat=moment.defaultFormat] The format
       this moment formatter should use to read/write dislay values.
     */
    defaults: {
      modelInUnixOffset: false,
      modelInUnixTimestamp: false,
      modelInUTC: true,
      modelLang: moment.lang(),
      modelFormat: moment.defaultFormat,
      displayInUnixOffset: false,
      displayInUnixTimestamp: false,
      displayInUTC: true,
      displayLang: moment.lang(),
      displayFormat: moment.defaultFormat
    },

    /**
       Converts datetime values from the model for display.

       @member Backgrid.Extension.MomentFormatter
       @param {*} rawData
       @return {string}
     */
    fromRaw: function (rawData) {
      if (rawData == null) return '';

      var m = this.modelInUnixOffset ? moment(rawData) :
        this.modelInUnixTimestamp ? moment.unix(rawData) :
        this.modelInUTC ?
        moment.utc(rawData, this.modelFormat, this.modelLang) :
        moment(rawData, this.modelFormat, this.modelLang);

      if (this.displayInUnixOffset) return +m;

      if (this.displayInUnixTimestamp) return m.unix();

      if (this.displayLang) m.lang(this.displayLang);

      if (this.displayInUTC) m.utc(); else m.local();

      return m.format(this.displayFormat);
    },

    /**
       Converts datetime values from user input to model values.

       @member Backgrid.Extension.MomentFormatter
       @param {string} formattedData
       @return {string}
     */
    toRaw: function (formattedData) {

      var m = this.displayInUnixOffset ? moment(+formattedData) :
        this.displayInUnixTimestamp ? moment.unix(+formattedData) :
        this.displayInUTC ?
        moment.utc(formattedData, this.displayFormat, this.displayLang) :
        moment(formattedData, this.displayFormat, this.displayLang);

      if (!m || !m.isValid()) return;

      if (this.modelInUnixOffset) return +m;

      if (this.modelInUnixTimestamp) return m.unix();

      if (this.modelLang) m.lang(this.modelLang);

      if (this.modelInUTC) m.utc(); else m.local();

      return m.format(this.modelFormat);
    }

  });

  /**
     Renders a datetime cell that uses a Backgrid.Extension.MomentFormatter to
     convert and validate values.

     @class Backgrid.Extension.MomentCell
     @extends Backgrid.Cell
   */
  var MomentCell = Backgrid.Extension.MomentCell = Backgrid.Cell.extend({

    editor: Backgrid.InputCellEditor,

    /** @property */
    className: "moment-cell",

    /** @property {Backgrid.CellFormatter} [formatter=Backgrid.Extension.MomentFormatter] */
    formatter: MomentFormatter,

    /**
       Initializer. Accept Backgrid.Extension.MomentFormatter.options and
       Backgrid.Cell.initialize required parameters.
     */
    initialize: function (options) {

      MomentCell.__super__.initialize.apply(this, arguments);

      var formatterDefaults = MomentFormatter.prototype.defaults;
      var formatterDefaultKeys = _.keys(formatterDefaults);
      var instanceAttrs = _.pick(this, formatterDefaultKeys);
      var formatterOptions = _.pick(options, formatterDefaultKeys);

      _.extend(this.formatter, formatterDefaults, instanceAttrs, formatterOptions);

      this.editor = this.editor.extend({
        attributes: _.extend({}, this.editor.prototype.attributes || this.editor.attributes || {}, {
          placeholder: this.formatter.displayFormat
        })
      });
    }

  });

  _.extend(MomentCell.prototype, MomentFormatter.prototype.defaults);

}));

});
require.register("wyuenho-backgrid-select2-cell/backgrid-select2-cell.js", function(exports, require, module){
/*
  backgrid-select2-cell
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
(function (factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("underscore"),
                             require("backgrid"));
  }
  // Browser
  else if (typeof _ !== "undefined" &&
           typeof Backgrid !== "undefined") {
    factory(_, Backgrid);
  }

}(function (_, Backgrid)  {

  /**
     Select2CellEditor is a cell editor that renders a `select2` select box
     instead of the default `<select>` HTML element.

     See:

       - [Select2](http://ivaynberg.github.com/select2/)

     @class Backgrid.Extension.Select2CellEditor
     @extends Backgrid.SelectCellEditor
   */
  var Select2CellEditor = Backgrid.Extension.Select2CellEditor = Backgrid.SelectCellEditor.extend({

    /** @property */
    events: {
      "change": "save"
    },

    /** @property */
    select2Options: null,

    initialize: function () {
      Backgrid.SelectCellEditor.prototype.initialize.apply(this, arguments);
      this.close = _.bind(this.close, this);
    },

    /**
       Sets the options for `select2`. Called by the parent Select2Cell during
       edit mode.
     */
    setSelect2Options: function (options) {
      this.select2Options = _.extend(options || {});
    },

    /**
       Renders a `select2` select box instead of the default `<select>` HTML
       element using the supplied options from #select2Options.

       @chainable
     */
    render: function () {
      Backgrid.SelectCellEditor.prototype.render.apply(this, arguments);
      this.$el.select2(this.select2Options);
      return this;
    },

    /**
       Attach event handlers to the select2 box and focus it.
    */
    postRender: function () {
      var self = this;
      this.$el
        .on("select2-blur", function (e) {
          e.type = "blur";
          self.close(e);
          self.select2Focused = false;
        })
        .on("select2-focus", function (e) {
          self.select2Focused = true;
        })
        .select2("container")
        .on("keydown", this.close)
        .on("focusout", function (e) {
          if (!self.select2Focused) {
            e.type = "blur"
            self.close(e);
          }
        })
        .attr("tabindex", -1)
        .focus();
    },

    remove: function () {
      this.$el.select2("destroy");
      return Backgrid.SelectCellEditor.prototype.remove.apply(this, arguments);
    }

  });

  /**
     Select2Cell is a cell class that renders a `select2` select box during edit
     mode.

     @class Backgrid.Extension.Select2Cell
     @extends Backgrid.SelectCell
   */
  Backgrid.Extension.Select2Cell = Backgrid.SelectCell.extend({

    /** @property */
    className: "select2-cell",

    /** @property */
    editor: Select2CellEditor,

    /** @property */
    select2Options: null,

    /**
       Initializer.

       @param {Object} options
       @param {Backbone.Model} options.model
       @param {Backgrid.Column} options.column
       @param {Object} [options.select2Options]

       @throws {TypeError} If `optionsValues` is undefined.
     */
    initialize: function (options) {
      Backgrid.SelectCell.prototype.initialize.apply(this, arguments);
      this.select2Options = options.select2Options || this.select2Options;
      this.listenTo(this.model, "backgrid:edit", function (model, column, cell, editor) {
        if (column.get("name") == this.column.get("name")) {
          editor.setSelect2Options(this.select2Options);
        }
      });
    }

  });

}));

});
require.register("backgridjs-com/js/main.js", function(exports, require, module){
module.exports = {}

});


























require.alias("jquery/jquery.js", "backgridjs-com/deps/jquery/jquery.js");
require.alias("jquery/jquery.js", "backgridjs-com/deps/jquery/index.js");
require.alias("jquery/jquery.js", "jquery/index.js");
require.alias("jquery/jquery.js", "jquery/index.js");
require.alias("bootstrap/js/bootstrap.js", "backgridjs-com/deps/bootstrap/js/bootstrap.js");
require.alias("bootstrap/js/bootstrap.js", "backgridjs-com/deps/bootstrap/index.js");
require.alias("bootstrap/js/bootstrap.js", "bootstrap/index.js");
require.alias("jquery/jquery.js", "bootstrap/deps/jquery/jquery.js");
require.alias("jquery/jquery.js", "bootstrap/deps/jquery/index.js");
require.alias("jquery/jquery.js", "jquery/index.js");
require.alias("bootstrap/js/bootstrap.js", "bootstrap/index.js");
require.alias("codemirror/codemirror-compressed.js", "backgridjs-com/deps/codemirror/codemirror-compressed.js");
require.alias("codemirror/codemirror-compressed.js", "backgridjs-com/deps/codemirror/index.js");
require.alias("codemirror/codemirror-compressed.js", "codemirror/index.js");
require.alias("codemirror/codemirror-compressed.js", "codemirror/index.js");
require.alias("jashkenas-underscore/underscore.js", "backgridjs-com/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "backgridjs-com/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "backgridjs-com/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "backgridjs-com/deps/backbone/index.js");
require.alias("jashkenas-backbone/backbone.js", "backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backbone-pageable/lib/backbone-pageable.js", "backgridjs-com/deps/backbone-pageable/lib/backbone-pageable.js");
require.alias("wyuenho-backbone-pageable/lib/backbone-pageable.js", "backgridjs-com/deps/backbone-pageable/index.js");
require.alias("wyuenho-backbone-pageable/lib/backbone-pageable.js", "backbone-pageable/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backbone-pageable/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backbone-pageable/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backbone-pageable/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backbone-pageable/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backbone-pageable/lib/backbone-pageable.js", "wyuenho-backbone-pageable/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "backgridjs-com/deps/backgrid/lib/backgrid.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "backgridjs-com/deps/backgrid/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "backgrid/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid/index.js");
require.alias("wyuenho-backgrid-paginator/backgrid-paginator.js", "backgridjs-com/deps/backgrid-paginator/backgrid-paginator.js");
require.alias("wyuenho-backgrid-paginator/backgrid-paginator.js", "backgridjs-com/deps/backgrid-paginator/index.js");
require.alias("wyuenho-backgrid-paginator/backgrid-paginator.js", "backgrid-paginator/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-paginator/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-paginator/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid-paginator/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid-paginator/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backbone-pageable/lib/backbone-pageable.js", "wyuenho-backgrid-paginator/deps/backbone-pageable/lib/backbone-pageable.js");
require.alias("wyuenho-backbone-pageable/lib/backbone-pageable.js", "wyuenho-backgrid-paginator/deps/backbone-pageable/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backbone-pageable/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backbone-pageable/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backbone-pageable/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backbone-pageable/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backbone-pageable/lib/backbone-pageable.js", "wyuenho-backbone-pageable/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-paginator/deps/backgrid/lib/backgrid.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-paginator/deps/backgrid/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid/index.js");
require.alias("wyuenho-backgrid-paginator/backgrid-paginator.js", "wyuenho-backgrid-paginator/index.js");
require.alias("wyuenho-backgrid-filter/backgrid-filter.js", "backgridjs-com/deps/backgrid-filter/backgrid-filter.js");
require.alias("wyuenho-backgrid-filter/backgrid-filter.js", "backgridjs-com/deps/backgrid-filter/index.js");
require.alias("wyuenho-backgrid-filter/backgrid-filter.js", "backgrid-filter/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-filter/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-filter/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid-filter/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid-filter/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-filter/deps/backgrid/lib/backgrid.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-filter/deps/backgrid/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid/index.js");
require.alias("olivernn-lunr.js/lunr.js", "wyuenho-backgrid-filter/deps/lunr/lunr.js");
require.alias("olivernn-lunr.js/lunr.js", "wyuenho-backgrid-filter/deps/lunr/index.js");
require.alias("olivernn-lunr.js/lunr.js", "olivernn-lunr.js/index.js");
require.alias("wyuenho-backgrid-filter/backgrid-filter.js", "wyuenho-backgrid-filter/index.js");
require.alias("wyuenho-backgrid-select-all/backgrid-select-all.js", "backgridjs-com/deps/backgrid-select-all/backgrid-select-all.js");
require.alias("wyuenho-backgrid-select-all/backgrid-select-all.js", "backgridjs-com/deps/backgrid-select-all/index.js");
require.alias("wyuenho-backgrid-select-all/backgrid-select-all.js", "backgrid-select-all/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid-select-all/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid-select-all/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-select-all/deps/backgrid/lib/backgrid.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-select-all/deps/backgrid/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid/index.js");
require.alias("wyuenho-backgrid-select-all/backgrid-select-all.js", "wyuenho-backgrid-select-all/index.js");
require.alias("wyuenho-backgrid-text-cell/backgrid-text-cell.js", "backgridjs-com/deps/backgrid-text-cell/backgrid-text-cell.js");
require.alias("wyuenho-backgrid-text-cell/backgrid-text-cell.js", "backgridjs-com/deps/backgrid-text-cell/index.js");
require.alias("wyuenho-backgrid-text-cell/backgrid-text-cell.js", "backgrid-text-cell/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-text-cell/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-text-cell/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid-text-cell/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid-text-cell/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-text-cell/deps/backgrid/lib/backgrid.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-text-cell/deps/backgrid/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid/index.js");
require.alias("wyuenho-backgrid-text-cell/backgrid-text-cell.js", "wyuenho-backgrid-text-cell/index.js");
require.alias("wyuenho-backgrid-moment-cell/backgrid-moment-cell.js", "backgridjs-com/deps/backgrid-moment-cell/backgrid-moment-cell.js");
require.alias("wyuenho-backgrid-moment-cell/backgrid-moment-cell.js", "backgridjs-com/deps/backgrid-moment-cell/index.js");
require.alias("wyuenho-backgrid-moment-cell/backgrid-moment-cell.js", "backgrid-moment-cell/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-moment-cell/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-moment-cell/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-moment-cell/deps/backgrid/lib/backgrid.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-moment-cell/deps/backgrid/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid/index.js");
require.alias("moment-moment/moment.js", "wyuenho-backgrid-moment-cell/deps/moment/moment.js");
require.alias("moment-moment/moment.js", "wyuenho-backgrid-moment-cell/deps/moment/index.js");
require.alias("moment-moment/moment.js", "moment-moment/index.js");
require.alias("wyuenho-backgrid-moment-cell/backgrid-moment-cell.js", "wyuenho-backgrid-moment-cell/index.js");
require.alias("wyuenho-backgrid-select2-cell/backgrid-select2-cell.js", "backgridjs-com/deps/backgrid-select2-cell/backgrid-select2-cell.js");
require.alias("wyuenho-backgrid-select2-cell/backgrid-select2-cell.js", "backgridjs-com/deps/backgrid-select2-cell/index.js");
require.alias("wyuenho-backgrid-select2-cell/backgrid-select2-cell.js", "backgrid-select2-cell/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-select2-cell/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid-select2-cell/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-select2-cell/deps/backgrid/lib/backgrid.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid-select2-cell/deps/backgrid/index.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "wyuenho-backgrid/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/backbone.js");
require.alias("jashkenas-backbone/backbone.js", "wyuenho-backgrid/deps/backbone/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-backbone/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("jashkenas-backbone/backbone.js", "jashkenas-backbone/index.js");
require.alias("wyuenho-backgrid/lib/backgrid.js", "wyuenho-backgrid/index.js");
require.alias("wyuenho-backgrid-select2-cell/backgrid-select2-cell.js", "wyuenho-backgrid-select2-cell/index.js");
require.alias("backgridjs-com/js/main.js", "backgridjs-com/index.js");