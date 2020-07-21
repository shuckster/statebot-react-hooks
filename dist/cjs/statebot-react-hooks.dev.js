
/*
 * Statebot React Hooks
 * v1.0.1
 * https://shuckster.github.io/statebot/
 * License: ISC
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
      if (!done) {
        setState(toState);
      }
    });
    return () => {
      done = true;
      removeListener();
    }
  }, [bot]);
  return state
}
function useStatebotFactory(name, config) {
  const _config = react.useMemo(() => config, [name]);
  const listeners = [];
  react.useEffect(() => () => listeners.forEach(off => off()), [_config]);
  const bot = react.useMemo(() => {
    const { performTransitions, onTransitions, ...botConfig } = _config || {};
    const bot = statebot.Statebot(name, botConfig);
    listeners.push(
      bot.performTransitions(performTransitions || {}),
      bot.onTransitions(onTransitions || {})
    );
    return bot
  }, [name, _config]);
  const state = useStatebot(bot);
  return { state, bot }
}
function useStatebotEvent (bot, eventName, stateOrFn, maybeFn) {
  react.useEffect(() => {
    let done = false;
    function onSwitchFn(...args) {
      if (!done) {
        stateOrFn(...args);
      }
    }
    function onEnterOrExitFn(...args) {
      if (!done) {
        maybeFn(...args);
      }
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
