import babel from '@rollup/plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import cleanup from 'rollup-plugin-cleanup'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import pkg from '../package.json'
import {
  banner,
  terserConfig,
  outputGlobals
 } from './rollup.common.js'

const sharedOutputConfig = {
  banner: banner(pkg),
  name: 'statebotReactHooks',
  ...outputGlobals
}

export default {
  input: 'src/index.js',
  output: [
    {
      file: `dist/browser/${pkg.name}.dev.js`,
      format: 'iife',
      sourcemap: true,
      ...sharedOutputConfig
    },
    {
      file: `dist/browser/${pkg.name}.min.js`,
      format: 'iife',
      plugins: [terser(terserConfig)],
      ...sharedOutputConfig
    },
    {
      file: `dist/umd/${pkg.name}.dev.js`,
      format: 'umd',
      sourcemap: true,
      ...sharedOutputConfig
    },
    {
      file: `dist/umd/${pkg.name}.min.js`,
      format: 'umd',
      plugins: [terser(terserConfig)],
      ...sharedOutputConfig
    }
  ],
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    json(),
    builtins(),
    resolve(),
    commonjs(),
    cleanup({ comments: 'jsdoc' }),
    babel({ babelHelpers: 'bundled' })
  ]
}
