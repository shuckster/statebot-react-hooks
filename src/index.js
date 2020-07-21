import { useState, useEffect, useMemo } from 'react'
import { Statebot } from 'statebot'

//
// Use an existing Statebot
//
export function useStatebot (bot) {
  const [state, setState] = useState(bot.currentState())

  useEffect(() => {
    let done = false

    const removeListener = bot.onSwitched(toState => {
      if (!done) {
        setState(toState)
      }
    })

    return () => {
      done = true
      removeListener()
    }
  }, [bot])

  return state
}

//
// Create a new Statebot within a Component
//

// TODO: Needs same TLC as other hooks
export function useStatebotFactory(name, config) {
  const _config = useMemo(() => config, [name])
  const listeners = []
  useEffect(() => () => listeners.forEach(off => off()), [_config])

  // We memoise Statebot since it's based on EventEmitter,
  // so we create it once and add/remove listeners for
  // the life-cycle of the component
  const bot = useMemo(() => {
    const { performTransitions, onTransitions, ...botConfig } = _config || {}
    const bot = Statebot(name, botConfig)
    listeners.push(
      bot.performTransitions(performTransitions || {}),
      bot.onTransitions(onTransitions || {})
    )
    return bot
  }, [name, _config])

  const state = useStatebot(bot)

  return { state, bot }
}

//
// Listen to Statebot events with automatic cleanup
//
export function useStatebotEvent (bot, eventName, stateOrFn, maybeFn) {
  useEffect(() => {

    let done = false

    function onSwitchFn(...args) {
      if (!done) {
        stateOrFn(...args)
      }
    }
    function onEnterOrExitFn(...args) {
      if (!done) {
        maybeFn(...args)
      }
    }

    const args = typeof maybeFn === 'function'
      ? [stateOrFn, onEnterOrExitFn]
      : [onSwitchFn]

    const removeListener = bot[eventName](...args)

    return () => {
      done = true
      removeListener()
    }
  }, [bot, eventName, stateOrFn, maybeFn])
}
