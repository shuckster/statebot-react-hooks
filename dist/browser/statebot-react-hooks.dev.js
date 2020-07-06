
/*
 * Statebot React Hooks
 * v1.0.0
 * https://shuckster.github.io/statebot/
 * License: ISC
 */

var statebotReactHooks = (function (exports, react, statebot) {
  'use strict';

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function useStatebot(bot) {
    var _useState = react.useState(bot.currentState()),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    react.useEffect(function () {
      return bot.onSwitched(setState);
    }, [bot]);
    return state;
  }
  function useStatebotFactory(name, config) {
    var _config = react.useMemo(function () {
      return config;
    }, [name]);

    var listeners = [];
    react.useEffect(function () {
      return function () {
        return listeners.forEach(function (off) {
          return off();
        });
      };
    }, [_config]);
    var bot = react.useMemo(function () {
      var _ref = _config || {},
          performTransitions = _ref.performTransitions,
          onTransitions = _ref.onTransitions,
          botConfig = _objectWithoutProperties(_ref, ["performTransitions", "onTransitions"]);

      var bot = statebot.Statebot(name, botConfig);
      listeners.push(bot.performTransitions(performTransitions || {}), bot.onTransitions(onTransitions || {}));
      return bot;
    }, [name, _config]);
    var state = useStatebot(bot);
    return {
      state: state,
      bot: bot
    };
  }
  function useStatebotEvent(bot, eventName) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var listeners = [];
    react.useEffect(function () {
      return function () {
        return listeners.forEach(function (off) {
          return off();
        });
      };
    }, [bot, eventName]);
    react.useEffect(function () {
      if (['onSwitching', 'onSwitched', 'onEntering', 'onEntered', 'onExiting', 'onExited'].includes(eventName)) {
        listeners.push(bot[eventName].apply(bot, args));
      } else {
        throw new Error("Unknown event: ".concat(eventName));
      }
    }, [bot, eventName]);
  }

  exports.useStatebot = useStatebot;
  exports.useStatebotEvent = useStatebotEvent;
  exports.useStatebotFactory = useStatebotFactory;

  return exports;

}({}, React, statebot));
//# sourceMappingURL=statebot-react-hooks.dev.js.map
