(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vueFeatureToggle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = featuretoggleapi;

var parseToFn = function parseToFn(fnOrBool) {
    if (typeof fnOrBool == 'boolean') return function () {
        return fnOrBool;
    };

    return fnOrBool;
};

function initVisibilities() {
    var visibilities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var returnVisibilities = {};
    Object.keys(visibilities).forEach(function (key) {
        returnVisibilities[key] = parseToFn(visibilities[key]);
    });

    return returnVisibilities;
}

function featuretoggleapi(rawVisibilities) {
    var globals = {
        datas: {},
        listeners: [],
        visibilities: initVisibilities(rawVisibilities),
        showLogs: false
    };

    function executeListener(event) {
        globals.listeners.forEach(function (listener) {
            listener(event);

            //zeige die logs an
            if (global.showLogs) api.isVisible(event.name, event.variant, event.data);
        });
    }

    var log = function log(message) {
        if (!globals.showLogs) return;

        //Nur Browser können Syntaxhighlighting die anderen geben die Nachricht einfach aus und schneiden
        //die styletags raus
        if (typeof window === 'undefined') {
            var loggedMessage = message.replace(/<b>/g, "");
            console.log(loggedMessage);
            return;
        }

        var hasBoldTag = message.indexOf('<b>') != -1;
        var hasVisibleKeyword = message.indexOf('visible') != -1;
        var hasHiddenKeyword = message.indexOf('hidden') != -1;

        var _message = message.replace('visible', '%cvisible');
        _message = _message.replace('hidden', '%chidden');

        if (hasVisibleKeyword) console.log(_message, "color:green;font-weight:bold;");else if (hasHiddenKeyword) console.log(_message, "color:red;font-weight:bold;");else if (hasBoldTag) {
            _message = _message.replace('<b>', '%c');
            var parts = [_message, 'font-weight:bold;'];
            console.log.apply(null, parts);
        } else console.log(message);
    };

    var logAndReturn = function logAndReturn(returnValue, message) {
        log(message);
        log('');
        return returnValue;
    };

    var getVisibility = function getVisibility(visibilityFn, functionname, name, variant, data) {
        if (visibilityFn == null) return undefined;

        var calculatedVisibility = visibilityFn({ name: name, variant: variant, data: data });

        if (typeof calculatedVisibility == 'boolean') {
            return calculatedVisibility;
        }

        return logAndReturn(false, 'The ' + functionname + ' returns ' + calculatedVisibility + '. => Please return true or false. This result (and all non-boolean results) will return false.');
    };

    function getKey(name, variant) {
        var _name = name.toLowerCase();
        if (typeof variant == 'string') {
            _name += "#" + variant.toLowerCase();
        }

        return _name;
    }
    function parseKey(key) {
        var parts = key.split('#');
        return {
            name: parts[0],
            variant: parts.length > 1 ? parts[1] : undefined,
            data: globals.datas[key]
        };
    }

    /*
        the following calls are possible:
        visibility(name,result);
        visibility(name,variant,result);
        visibility(name,variant,data,result);
    
        =>
        param1: name
        param2: result || variant
        param3: result || data
        param4: result
    */
    function visibilityFnParams(param1, param2, param3, param4) {
        //name must always be set
        if (param1 == undefined) throw new Error('feature.visibility(): 1st parameter name must be defined');

        if (arguments.length == 1) throw new Error('feature.visibility(): 2nd parameter name must be a boolean or function, but is empty');

        var name = param1,
            variant = null,
            data = null,
            result = null;
        if (param3 == undefined && param4 == undefined) {
            result = param2;
        } else if (param4 == undefined) {
            variant = param2;
            result = param3;
        } else {
            variant = param2;
            data = param3;
            result = param4;
        }

        return {
            name: name,
            variant: variant,
            data: data,
            result: result
        };
    }

    function getEvent(name, variant, data, result) {

        var event = void 0;

        event = { name: name, variant: variant, data: data };

        event.key = getKey(event.name, event.variant);

        if (result == null) return event;

        event.visibilityFunction = parseToFn(result);
        event.result = event.visibilityFunction({
            name: event.name,
            variant: event.variant,
            data: event.data,
            _internalCall: true,
            description: 'When attaching a function, the result must be calculated internally. You can filter this out with the _internalCall:true -Flag.'
        });
        return event;
    }

    function isVisible(name, variant, data) {
        var visibilities = globals.visibilities;

        log('\nCheck Visibility of <b>Feature "' + name + '", variant "' + (variant == undefined ? '' : variant) + '"' + (data ? " with data " + JSON.stringify(data) : "") + '.');
        if (name == undefined) throw new Error('The attribute "name" is required for tag <feature></feature>. Example: <feature name="aname"></feature>');

        var requiredFn = visibilities['_required'];
        var requiredFnExists = visibilities['_required'] != null;
        var requiredFnResult = getVisibility(requiredFn, 'requiredVisibility', name, variant, data);

        var visibilityFnKey = getKey(name, variant);
        var visibilityFn = visibilities[visibilityFnKey];
        var visibilityFnExists = visibilities[visibilityFnKey] != null;
        var visibilityFnResult = getVisibility(visibilityFn, 'visibility function', name, variant, data);

        var variantExists = variant != null;
        var visibilityOnlyNameFnKey = getKey(name, null);
        var visibilityOnlyNameFn = visibilities[visibilityOnlyNameFnKey];
        var visibilityOnlyNameFnExists = visibilities[visibilityOnlyNameFnKey] != null;
        var visibilityOnlyNameFnResult = getVisibility(visibilityOnlyNameFn, 'visibility function (only name)', name, variant, data);

        var defaultFn = visibilities['_default'];
        var defaultFnExists = visibilities['_default'] != null;
        var defaultFnResult = getVisibility(defaultFn, 'defaultVisibility', name, variant, data);

        if (!requiredFnExists) log("No requiredVisibility rule specified for this feature.");else if (requiredFnExists && requiredFnResult === true) log("The requiredVisibility rule returns true. This feature will be shown when no other rule rejects it.");else if (requiredFnExists && requiredFnResult === false) return logAndReturn(false, "The requiredVisibility rule returns false. This feature will be hidden.");

        if (visibilityFnExists) return logAndReturn(visibilityFnResult, 'The visibility rule returns ' + visibilityFnResult + '. This feature will be ' + (visibilityFnResult ? 'visible' : 'hidden') + '.');
        log('No visibility rule found matching name and variant.');

        if (variantExists && typeof visibilityOnlyNameFnResult == 'boolean') return logAndReturn(visibilityOnlyNameFnResult, 'Found a visibility rule for name ' + name + ' without variants. The rule returns ' + visibilityOnlyNameFnResult + '. => This feature will be ' + (visibilityOnlyNameFnResult ? 'visible' : 'hidden') + '.');else if (variantExists) log('No rules found for name ' + name + ' without variants.');

        if (defaultFnExists) return logAndReturn(defaultFnResult, 'Found a defaultVisibility rule. The rule returns ' + defaultFnResult + '. => This feature will be ' + (defaultFnResult ? 'visible' : 'hidden') + '.');
        log('No default rule found.');

        if (requiredFnExists) return logAndReturn(true, 'Only the requiredVisibility rule was found. This returned true. => This feature will be visible.');

        return logAndReturn(false, 'No rules were found. This feature will be hidden.');
    }

    return {
        name: 'feature-toggle-api',
        setData: function setData(nameParam, variantOrDataParam, dataParam) {
            if (nameParam == undefined) throw new Error('setData(): The name must of the feature must be defined, but ist undefined');

            var variant = dataParam != undefined ? variantOrDataParam : undefined;
            var data = dataParam || variantOrDataParam;

            var event = getEvent(nameParam, variant, data);

            globals.datas[event.key] = event.data;

            executeListener(event);
        },
        on: function on(eventtype, fn, config) {
            var validEventTypes = ['visibilityrule'];
            if (validEventTypes.indexOf(eventtype.toLowerCase()) == -1) throw new Error('Eventtype "' + eventtype.toLowerCase() + '" does not exist. Only "visibilityrule" is valid');

            globals.listeners.push(fn);

            if (config != undefined && config.ignorePreviousRules) return;

            Object.keys(globals.visibilities).forEach(function (key) {
                var event = parseKey(key, globals);
                var rule = globals.visibilities[key];
                event.result = rule(event.name, event.variant, event.data);
                fn(event);
            });
        },
        showLogs: function showLogs(_showLogs) {
            globals.showLogs = _showLogs == undefined ? true : _showLogs;
        },
        isVisible: isVisible,
        /*
            the following function calls are possible:
            visibility(name,result);
            visibility(name,variant,result);
            visibility(name,variant,data,result);
        */
        visibility: function visibility(param1, param2, param3, param4) {
            var params = visibilityFnParams(param1, param2, param3, param4);
            var event = getEvent(params.name, params.variant, params.data, params.result);

            globals.visibilities[event.key] = event.visibilityFunction;
            globals.datas[event.key] = event.data;

            executeListener(event);
        },
        requiredVisibility: function requiredVisibility(fn) {
            if (typeof fn != "function") throw new Error('feature.requiredVisibility(): 1st parameter must be a function, but is ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));

            globals.visibilities['_required'] = parseToFn(fn);
        },
        defaultVisibility: function defaultVisibility(fn) {
            if (typeof fn != "function") throw new Error('feature.defaultVisibility(): 1st parameter must be a function, but is ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));

            globals.visibilities['_default'] = parseToFn(fn);
        }
    };
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
;(function(){
'use strict';

var featureToggleApi = require('feature-toggle-api/dist/feature-toggle-api.js').default;

var api = new featureToggleApi();

module.exports = Object.assign({}, api, {
  props: {
    name: {
      type: String
    },
    variant: {
      type: String
    },
    data: {
      type: [Object, String]
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  name: 'feature',
  data: function data() {
    return {
      isVisible: api.isVisible(this.name, this.variant, this.data)
    };
  },

  render: function render(createElement) {
    if (this.isVisible) {
      return createElement(this.tag, {
        'feature-name': this.name,
        'feature-variant': this.variant
      }, this.$slots.default);
    }
  },
  methods: {
    _isVisible: function _isVisible(name, variant, data) {
      return api.isVisible(name, variant, data);
    }
  }
});
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__._scopeId = "data-v-32d0d8b2"

},{"feature-toggle-api/dist/feature-toggle-api.js":1}],3:[function(require,module,exports){
'use strict';

var _Feature = require('./Feature.vue');

var _Feature2 = _interopRequireDefault(_Feature);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _Feature2.default;

},{"./Feature.vue":2}]},{},[2,3])(3)
});