(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FeatureToggleComponent = {}, global.vue));
}(this, (function (exports, vue) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var vue__namespace = /*#__PURE__*/_interopNamespace(vue);

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var parseToFn = function parseToFn(fnOrBool) {
    if (typeof fnOrBool == 'boolean') return function () {
      return fnOrBool;
    };
    return fnOrBool;
  };

  var getKey = function getKey(name, variant) {
    var _name = name.toLowerCase();

    if (typeof variant == 'string') {
      _name += "#" + variant.toLowerCase();
    }

    return _name;
  };

  function initVisibilities() {
    var visibilities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var returnVisibilities = {};
    Object.keys(visibilities).forEach(function (key) {
      if (key.startsWith('_')) return;
      returnVisibilities[getKey(key)] = parseToFn(visibilities[key]);
    });
    return returnVisibilities;
  }

  function featuretoggleapi() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var globals = {
      datas: {},
      listeners: {},
      visibilities: initVisibilities(config),
      showLogs: false,
      usedPlugins: []
    };

    function init(api) {
      if (config._plugins) {
        if (!Array.isArray(config._plugins)) throw new Error('featuretoggleapi()-constructor: config.plugins must be an array.');

        config._plugins.forEach(function (plugin) {
          if (typeof plugin !== 'function') throw new Error('featuretoggleapi()-constructor: config.plugins needs functions as entries, not ' + _typeof(plugin) + '.');

          _addPlugin(plugin, api);
        });
      }

      triggerEvent('init');
    }

    function _addPlugin(plugin, api) {
      plugin(api);
    }

    function triggerEvent(eventtype, param) {
      (globals.listeners[eventtype] || []).forEach(function (listener) {
        listener(param);
      });
    }

    var log = function log(message) {
      if (!globals.showLogs) return; //Nur Browser können Syntaxhighlighting die anderen geben die Nachricht einfach aus und schneiden
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
      var calculatedVisibility = visibilityFn({
        name: name,
        variant: variant,
        data: data
      });

      if (typeof calculatedVisibility == 'boolean') {
        return calculatedVisibility;
      }

      return logAndReturn(false, "The ".concat(functionname, " returns ").concat(calculatedVisibility, ". => Please return true or false. This result (and all non-boolean results) will return false."));
    };

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
      var event;
      event = {
        name: name,
        variant: variant,
        data: data
      };
      event.key = getKey(event.name, event.variant);
      if (result == null) return event;
      event.visibilityFunction = parseToFn(result);
      event.result = event.visibilityFunction({
        name: event.name,
        variant: event.variant,
        data: event.data || {},
        _internalCall: true,
        description: 'When attaching a function, the result must be calculated internally. You can filter this out with the _internalCall:true -Flag.'
      });
      return event;
    }

    function isVisible(name, variant, data) {
      var visibilities = globals.visibilities;
      log("\nCheck Visibility of <b>Feature \"".concat(name, "\", variant \"").concat(variant == undefined ? '' : variant, "\"").concat(data ? " with data " + JSON.stringify(data) : "", "."));
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
      visibilities[visibilityOnlyNameFnKey] != null;
      var visibilityOnlyNameFnResult = getVisibility(visibilityOnlyNameFn, 'visibility function (only name)', name, variant, data);
      var defaultFn = visibilities['_default'];
      var defaultFnExists = visibilities['_default'] != null;
      var defaultFnResult = getVisibility(defaultFn, 'defaultVisibility', name, variant, data);
      if (!requiredFnExists) log("No requiredVisibility rule specified for this feature.");else if (requiredFnExists && requiredFnResult === true) log("The requiredVisibility rule returns true. This feature will be shown when no other rule rejects it.");else if (requiredFnExists && requiredFnResult === false) return logAndReturn(false, "The requiredVisibility rule returns false. This feature will be hidden.");
      if (visibilityFnExists) return logAndReturn(visibilityFnResult, "The visibility rule returns ".concat(visibilityFnResult, ". This feature will be ").concat(visibilityFnResult ? 'visible' : 'hidden', "."));
      log('No visibility rule found matching name and variant.');
      if (variantExists && typeof visibilityOnlyNameFnResult == 'boolean') return logAndReturn(visibilityOnlyNameFnResult, "Found a visibility rule for name ".concat(name, " without variants. The rule returns ").concat(visibilityOnlyNameFnResult, ". => This feature will be ").concat(visibilityOnlyNameFnResult ? 'visible' : 'hidden', "."));else if (variantExists) log("No rules found for name ".concat(name, " without variants."));
      if (defaultFnExists) return logAndReturn(defaultFnResult, "Found a defaultVisibility rule. The rule returns ".concat(defaultFnResult, ". => This feature will be ").concat(defaultFnResult ? 'visible' : 'hidden', "."));
      log("No default rule found.");
      if (requiredFnExists) return logAndReturn(true, "Only the requiredVisibility rule was found. This returned true. => This feature will be visible.");
      return logAndReturn(false, 'No rules were found. This feature will be hidden.');
    }

    var api = {
      name: 'feature-toggle-api',
      setData: function setData(nameParam, variantOrDataParam, dataParam) {
        if (nameParam == undefined) throw new Error('setData(): The name must of the feature must be defined, but ist undefined');
        var variant = dataParam != undefined ? variantOrDataParam : undefined;
        var data = dataParam || variantOrDataParam;
        var event = getEvent(nameParam, variant, data);
        globals.datas[event.key] = event.data;
        triggerEvent('visibilityrule', event);
      },
      on: function on(eventtype, fn, config) {
        globals.listeners[eventtype] = globals.listeners[eventtype] || [];
        globals.listeners[eventtype].push(fn);
        triggerEvent('registerEvent', {
          type: eventtype
        });
        if (config != undefined && config.ignorePreviousRules) return;
        Object.keys(globals.visibilities).forEach(function (key) {
          var event = parseKey(key);
          var rule = globals.visibilities[key];
          event.result = rule(event);
          fn(event);
        });
      },
      trigger: triggerEvent,
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
        triggerEvent('visibilityrule', event);
      },
      requiredVisibility: function requiredVisibility(fn) {
        if (typeof fn != "function") throw new Error('feature.requiredVisibility(): 1st parameter must be a function, but is ' + _typeof(fn));
        globals.visibilities['_required'] = parseToFn(fn);
      },
      defaultVisibility: function defaultVisibility(fn) {
        if (typeof fn != "function") throw new Error('feature.defaultVisibility(): 1st parameter must be a function, but is ' + _typeof(fn));
        globals.visibilities['_default'] = parseToFn(fn);
      },
      addPlugin: function addPlugin(plugin) {
        if (globals.usedPlugins.includes(plugin)) return;

        _addPlugin(plugin, api);

        globals.usedPlugins.push(plugin);
      }
    };
    init(api);
    return api;
  }

  var featureToggleApi_module = featuretoggleapi;

  var FeatureToggleComponent = new featureToggleApi_module();

  function getDefaultSlot(slot) {
    // in vue3, slot is a function
    if (typeof slot == 'function') return slot(); //in vue <= 2 slot can be directly accessed.

    return slot;
  }

  function vuePlugin(api) {
    Object.assign(api, {
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
          "default": 'div'
        }
      },
      name: 'feature',
      data: function data() {
        return {
          isVisible: api.isVisible(this.name, this.variant, this.data)
        };
      },
      render: function render(createElement) {
        if (!this.isVisible) return; // fix for vue3: h is imported instead of passed by the render function

        var create = vue__namespace.h || createElement;
        return create(this.tag, {
          'feature-name': this.name,
          'feature-variant': this.variant
        }, getDefaultSlot(this.$slots["default"]));
      },
      methods: {
        _isVisible: function _isVisible(name, variant, data) {
          return api.isVisible(name, variant, data);
        }
      }
    });
  }

  FeatureToggleComponent.addPlugin(vuePlugin);

  exports.FeatureToggleComponent = FeatureToggleComponent;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
