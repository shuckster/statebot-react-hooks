
/*
 * Statebot React Hooks
 * v1.1.0
 * https://shuckster.github.io/statebot/
 * License: ISC
 */

import { useState, useEffect, useMemo } from 'react';
import { Statebot } from 'statebot';

function useStatebot (bot) {
  const [state, setState] = useState(bot.currentState());
  useEffect(() => {
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
function useStatebotFactory (name, config) {
  const { bot, listeners } = useMemo(() => {
    const {
      performTransitions = {},
      onTransitions = {},
      ...botConfig
    } = config || {};
    const bot = Statebot(name, botConfig);
    const listeners = [
      bot.performTransitions(performTransitions),
      bot.onTransitions(onTransitions)
    ];
    return {
      bot,
      listeners
    }
  }, []);
  useEffect(() =>
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
  useEffect(() => {
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

export { useStatebot, useStatebotEvent, useStatebotFactory };
//# sourceMappingURL=statebot-react-hooks.js.map
