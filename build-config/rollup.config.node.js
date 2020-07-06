import builtins from 'rollup-plugin-node-builtins'
import cleanup from 'rollup-plugin-cleanup'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import pkg from '../package.json'
import { banner, terserConfig } from './rollup.common.js'

const sharedOutputConfig = {
  format: 'cjs',
  banner: banner(pkg),
  exports: 'named'
}

export default {
  input: 'src/index.js',
  output: [
    {
      file: `dist/cjs/${pkg.name}.dev.js`,
      sourcemap: true,
      ...sharedOutputConfig
    },
    {
      file: `dist/cjs/${pkg.name}.min.js`,
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
    cleanup({ comments: 'jsdoc' })
  ]
}
