
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

function useStatebot(bot) {
  const [state, setState] = react.useState(bot.currentState());
  react.useEffect(() => bot.onSwitched(setState), [bot]);
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
function useStatebotEvent(bot, eventName, ...args) {
  const listeners = [];
  react.useEffect(() => () => listeners.forEach(off => off()), [bot, eventName]);
  react.useEffect(() => {
    if (
      [
        'onSwitching',
        'onSwitched',
        'onEntering',
        'onEntered',
        'onExiting',
        'onExited'
      ].includes(eventName)
    ) {
      listeners.push(bot[eventName](...args));
    } else {
      throw new Error(`Unknown event: ${eventName}`)
    }
  }, [bot, eventName]);
}

exports.useStatebot = useStatebot;
exports.useStatebotEvent = useStatebotEvent;
exports.useStatebotFactory = useStatebotFactory;
//# sourceMappingURL=statebot-react-hooks.dev.js.map
