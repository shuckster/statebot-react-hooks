
/*
 * Statebot React Hooks
 * v1.0.1
 * https://shuckster.github.io/statebot/
 * License: ISC
 */

import { useState, useEffect, useMemo } from 'react';
import { Statebot } from 'statebot';

function useStatebot(bot) {
  const [state, setState] = useState(bot.currentState());
  useEffect(() => bot.onSwitched(setState), [bot]);
  return state
}
function useStatebotFactory(name, config) {
  const _config = useMemo(() => config, [name]);
  const listeners = [];
  useEffect(() => () => listeners.forEach(off => off()), [_config]);
  const bot = useMemo(() => {
    const { performTransitions, onTransitions, ...botConfig } = _config || {};
    const bot = Statebot(name, botConfig);
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
  useEffect(() => () => listeners.forEach(off => off()), [bot, eventName]);
  useEffect(() => {
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

export { useStatebot, useStatebotEvent, useStatebotFactory };
//# sourceMappingURL=statebot-react-hooks.js.map
