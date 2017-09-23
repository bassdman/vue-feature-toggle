(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vueFeatureToggle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function(){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _showLogs = false;
var _log = function _log(message) {
  if (_showLogs === true) {
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
  }
};
var _logAndReturn = function _logAndReturn(returnValue, message) {
  _log(message);
  _log('');
  return returnValue;
};

var getVisibility = function getVisibility(visibilityFn, functionname, data, name, variant) {
  if (visibilityFn == null) return undefined;

  var calculatedVisibility = visibilityFn(data, name, variant);

  if (typeof calculatedVisibility == 'boolean') {
    return calculatedVisibility;
  }

  return _logAndReturn(false, 'The ' + functionname + ' returns ' + calculatedVisibility + '. => Please return true or false. This result (and all non-boolean results) will return false.');
};

var visibilities = {};
var getKey = function getKey(name, variant) {
  var _name = name.toLowerCase();
  if (typeof variant == 'string') {
    _name += "#" + variant.toLowerCase();
  }

  return _name;
};
var getVisibilityFn = function getVisibilityFn(variantOrFn, fn) {
  return fn == null ? variantOrFn : fn;
};

module.exports = {
  props: ['name', 'variant', 'data'],
  name: 'feature',
  data: function data() {
    return {
      isVisible: this._isVisible(this.name, this.variant, this.data)
    };
  },

  logAndReturn: function logAndReturn(returnValue, fn) {
    return _logAndReturn(returnValue, fn);
  },
  log: function log(message) {
    _log(message);
  },
  showLogs: function showLogs(_showLogs2, name, variant) {
    _showLogs = _showLogs2 == undefined ? true : _showLogs2;
  },
  isVisible: function isVisible(name, variant, data) {
    return this.methods._isVisible(name, variant, data);
  },
  visibility: function visibility(name, variantOrFn, fn) {
    if (name == undefined) throw new Error('feature.visibility(): 1st parameter name must be defined');

    if (variantOrFn == undefined) throw new Error('feature.visibility(): 2nd parameter must either be the variant name or a function');

    if (variantOrFn !== undefined && fn == undefined && typeof variantOrFn == 'string') throw new Error('feature.visibility(): 3nd parameter must be a function when the 2nd parameter is the variant name');

    var key = getKey(name, variantOrFn);
    var visibilityFn = getVisibilityFn(variantOrFn, fn);
    visibilities[key] = visibilityFn;
  },
  requiredVisibility: function requiredVisibility(fn) {
    if (typeof fn != "function") throw new Error('feature.requiredVisibility(): 1st parameter must be a function, but is ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));

    visibilities['_required'] = fn;
  },
  defaultVisibility: function defaultVisibility(fn) {
    if (typeof fn != "function") throw new Error('feature.defaultVisibility(): 1st parameter must be a function, but is ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));

    visibilities['_default'] = fn;
  },
  methods: {
    _isVisible: function _isVisible(name, variant, data) {
      _log('Check Visibility of <b>Feature "' + name + '", variant "' + (variant == undefined ? '' : variant) + '"' + (data ? " with data " + JSON.stringify(data) : "") + '.');
      if (name == undefined) throw new Error('The attribute "name" is required for tag <feature></feature>. Example: <feature name="aname"></feature>');

      var requiredFn = visibilities['_required'];
      var requiredFnExists = visibilities['_required'] != null;
      var requiredFnResult = getVisibility(requiredFn, 'requiredVisibility', data, name, variant);

      var visibilityFnKey = getKey(name, variant);
      var visibilityFn = visibilities[visibilityFnKey];
      var visibilityFnExists = visibilities[visibilityFnKey] != null;
      var visibilityFnResult = getVisibility(visibilityFn, 'visibility function', data, name, variant);

      var variantExists = variant != null;
      var visibilityOnlyNameFnKey = getKey(name, null);
      var visibilityOnlyNameFn = visibilities[visibilityOnlyNameFnKey];
      var visibilityOnlyNameFnExists = visibilities[visibilityOnlyNameFnKey] != null;
      var visibilityOnlyNameFnResult = getVisibility(visibilityOnlyNameFn, 'visibility function (only name)', data, name, variant);

      var defaultFn = visibilities['_default'];
      var defaultFnExists = visibilities['_default'] != null;
      var defaultFnResult = getVisibility(defaultFn, 'defaultVisibility', data, name, variant);

      if (!requiredFnExists) _log("No requiredVisibility rule specified for this feature.");else if (requiredFnExists && requiredFnResult === true) _log("The requiredVisibility rule returns true. This feature will be shown when no other rule rejects it.");else if (requiredFnExists && requiredFnResult === false) return _logAndReturn(false, "The requiredVisibility rule returns false. This feature will be hidden.");

      if (visibilityFnExists) return _logAndReturn(visibilityFnResult, 'The visibility rule returns ' + visibilityFnResult + '. This feature will be ' + (visibilityFnResult ? 'visible' : 'hidden') + '.');
      _log('No visibility rule found matching name and variant.');

      if (variantExists && typeof visibilityOnlyNameFnResult == 'boolean') return _logAndReturn(visibilityOnlyNameFnResult, 'Found a visibility rule for name ' + name + ' without variants. The rule returns ' + visibilityOnlyNameFnResult + '. => This feature will be ' + (visibilityOnlyNameFnResult ? 'visible' : 'hidden') + '.');else if (variantExists) _log('No rules found for name ' + name + ' without variants.');

      if (defaultFnExists) return _logAndReturn(defaultFnResult, 'Found a defaultVisibility rule. The rule returns ' + defaultFnResult + '. => This feature will be ' + (defaultFnResult ? 'visible' : 'hidden') + '.');
      _log('No default rule found.');

      if (requiredFnExists) return _logAndReturn(true, 'Only the requiredVisibility rule was found. This returned true. => This feature will be visible.');

      return _logAndReturn(false, 'No rules were found. This feature will be hidden.');
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.isVisible)?_c('div',{attrs:{"feature-name":_vm.name,"feature-variant":_vm.variant}},[_vm._t("default")],2):_vm._e()}
__vue__options__.staticRenderFns = []
__vue__options__._scopeId = "data-v-32d0d8b2"

},{}],2:[function(require,module,exports){
'use strict';

var _Feature = require('./Feature.vue');

var _Feature2 = _interopRequireDefault(_Feature);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _Feature2.default;

},{"./Feature.vue":1}]},{},[1,2])(2)
});