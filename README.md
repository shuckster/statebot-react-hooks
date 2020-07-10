# statebot-react-hooks

React Hooks for Statebot.

- [Statebot](https://github.com/shuckster/statebot) is a Finite State Machine library.
- [React](https://reactjs.org/) is a JavaScript library for building user interfaces.

For a Mithril version, see: [statebot-mithril-hooks](https://github.com/shuckster/statebot-mithril-hooks)

- [Examples](#examples)
  - [useStatebot](#usestatebot)
  - [useStatebotFactory](#usestatebotfactory)
  - [useStatebotEvent](#useStatebotEvent)
- [Contributing](#contributing)
- [License](#license)

# Examples

Installation:

```sh
npm i react statebot statebot-react-hooks
```

## useStatebot

For hooking-into Statebots that have life-cycles independent of the components that use them, `useStatebot`:

```jsx
import React from 'react'
import { Statebot } from 'statebot'
import { useStatebot } from 'statebot-react-hooks'

const loader$bot = Statebot('loader', {
  chart: `
    idle ->
      loading -> (loaded | failed) ->
      idle
  `
})

loader$bot.performTransitions(({ Emit }) => ({
  'idle -> loading': {
    on: 'start-loading',
    then: () => setTimeout(Emit('load-success'), 1000)
  },
  'loading -> loaded': {
    on: 'load-success'
  },
  'loading -> failed': {
    on: 'load-error'
  }
}))

const { Enter, Emit, inState } = loader$bot

function LoadingButton() {
  const state = useStatebot(loader$bot)

  return (
    <button
      className={state}
      onClick={Emit('start-loading')}
      disabled={inState('loading')}
    >
      {inState('idle', 'Load')}
      {inState('loading', 'Please wait...')}
      {inState('loaded', 'Done!')} ({state})
    </button>
  )
}
```

## useStatebotFactory

For Statebots whose life-cycles are tied to the components using them, `useStatebotFactory`:

```jsx
import React from 'react'
import { useStatebotFactory } from 'statebot-react-hooks'

const CHART = `
  idle ->
    loading -> (loaded | failed) ->
    idle
`

const EVENT = {
  START_LOADING: 'start-loading',
  LOAD_SUCCESS: 'load-success',
  LOAD_ERROR: 'load-error'
}

function LoadingButton (props) {
  const { state, bot } = useStatebotFactory(
    'loading-button',
    {
      chart: CHART,
      startIn: 'idle',
      logLevel: 4,

      performTransitions: ({ Emit }) => ({
        'idle -> loading': {
          on: EVENT.START_LOADING,
          then: () => setTimeout(
            Emit(EVENT.LOAD_SUCCESS),
            1000
          )
        },
        'loading -> loaded': {
          on: EVENT.LOAD_SUCCESS
        },
        'loading -> failed': {
          on: EVENT.LOAD_ERROR
        }
      }),

      onTransitions: () => ({
        'loading -> failed': () => {
          console.log('Oops...')
        }
      })
    }
  )

  return (
    <button
      className={state}
      onClick={bot.Emit(EVENT.START_LOADING)}
      disabled={bot.inState('loading')}
    >
      {bot.inState('idle', 'Load')}
      {bot.inState('loading', 'Please wait...')}
      {bot.inState('loaded', 'Done!')} ({state})
    </button>
  )
})
```

## useStatebotEvent

To hook-into [onEvent](https://shuckster.github.io/statebot/#statebotfsmonevent), [onEntering](https://shuckster.github.io/statebot/#statebotfsmonentering)/[ed](https://shuckster.github.io/statebot/#statebotfsmonentered), [onExiting](https://shuckster.github.io/statebot/#statebotfsmonexiting)/[ed](https://shuckster.github.io/statebot/#statebotfsmonexited), [onSwitching](https://shuckster.github.io/statebot/#statebotfsmonswitching)/[ed](https://shuckster.github.io/statebot/#statebotfsmonswitched) with side-effects cleanup, `useStatebotEvent`:

```jsx
import React from 'react'
import { Statebot } from 'statebot'
import {
  useStatebot,
  useStatebotEvent
} from 'statebot-react-hooks'

const bot = Statebot('loader', {
  chart: `
    idle ->
      loading -> (loaded | failed) ->
      idle
  `
})

const { Enter, Emit, inState } = bot

function LoadingButton() {
  const state = useStatebot(bot)

  useStatebotEvent(bot, 'onEntered', 'loading', () =>
    setTimeout(
      bot.Emit(EVENT.LOAD_SUCCESS),
      seconds(1)
    )
  )

  // You can achieve the same with useEffect, and you
  // get more control over the dependencies, too:
  useEffect(() => {
    const cleanupFn = bot.onExited('loading', () =>
      setTimeout(
        bot.Enter('idle'),
        seconds(2)
      )
    )
    return cleanupFn
  }, [bot])

  return (
    <button
      className={state}
      onClick={Emit('start-loading')}
      disabled={inState('loading')}
    >
      {inState('idle', 'Load')}
      {inState('loading', 'Please wait...')}
      {inState('loaded', 'Done!')} ({state})
    </button>
  )
}

function seconds(n) {
  return n * 1000
}

```

# Contributing

This is a pretty basic implementation of hooks for Statebot. I don't *think* much else is needed, but by all means fork and tinker with it as you like.

Of course, please stop-by the [Statebot repo](https://github.com/shuckster/statebot) itself. :)

<img src="./logo-small.png" width="75" />

## License

Statebot was written by [Conan Theobald](https://github.com/shuckster/) and is [ISC licensed](./LICENSE).
