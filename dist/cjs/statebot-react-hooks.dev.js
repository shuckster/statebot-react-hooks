
/*
 * Statebot React Hooks
 * v1.2.2
 * https://shuckster.github.io/statebot/
 * License: MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var statebot = require('statebot');

function useStatebot (bot) {
  const [state, setState] = react.useState(bot.currentState());
  react.useEffect(() => {
    let done = false;
    const removeListener = bot.onSwitched(toState => {
      if (done) {
        return
      }
      setState(toState);
    });
    return () => {
      done = true;
      removeListener();
    }
  }, [bot]);
  return state
}
function useStatebotFactory (name, config) {
  const { bot, listeners } = react.useMemo(() => {
    const {
      performTransitions = {},
      onTransitions = {},
      ...botConfig
    } = config || {};
    const bot = statebot.Statebot(name, botConfig);
    const listeners = [
      bot.performTransitions(performTransitions),
      bot.onTransitions(onTransitions)
    ];
    return {
      bot,
      listeners
    }
  }, []);
  react.useEffect(() =>
    () => {
      if (typeof bot.pause === 'function') {
        bot.pause();
      }
      listeners.forEach(off => off());
    },
    [bot, listeners]
  );
  const state = useStatebot(bot);
  return { state, bot }
}
function useStatebotEvent (bot, eventName, stateOrFn, maybeFn) {
  react.useEffect(() => {
    let done = false;
    function onSwitchFn(...args) {
      if (done) {
        return
      }
      stateOrFn(...args);
    }
    function onEnterOrExitFn(...args) {
      if (done) {
        return
      }
      maybeFn(...args);
    }
    const args = typeof maybeFn === 'function'
      ? [stateOrFn, onEnterOrExitFn]
      : [onSwitchFn];
    const removeListener = bot[eventName](...args);
    return () => {
      done = true;
      removeListener();
    }
  }, [bot, eventName, stateOrFn, maybeFn]);
}

exports.useStatebot = useStatebot;
exports.useStatebotEvent = useStatebotEvent;
exports.useStatebotFactory = useStatebotFactory;
//# sourceMappingURL=statebot-react-hooks.dev.js.map
