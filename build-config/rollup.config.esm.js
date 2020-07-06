import cleanup from 'rollup-plugin-cleanup'
import json from '@rollup/plugin-json'

import pkg from '../package.json'
import { banner } from './rollup.common.js'

export default {
  input: 'src/index.js',
  output: [
    {
      file: `dist/esm/${pkg.name}.js`,
      format: 'es',
      banner: banner(pkg),
      exports: 'named',
      sourcemap: true
    }
  ],
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    json(),
    cleanup({ comments: 'jsdoc' })
  ]
}
