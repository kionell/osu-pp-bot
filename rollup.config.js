import typescript from '@rollup/plugin-typescript';
import externals from 'rollup-plugin-node-externals';
import clean from 'rollup-plugin-delete';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { folderInput } from 'rollup-plugin-folder-input';

export default [
  {
    plugins: [
      typescript(),
      externals({
        deps: true,
      }),
      clean({
        targets: './build/*',
      }),
      folderInput(),
      typescriptPaths(),
    ],
    input: [
      './src/index.ts',
      './src/Commands/**/*.ts',
      './src/Events/**/*.ts',
    ],
    output: [
      {
        dir: './build',
        format: 'es',
        sourcemap: process?.env?.NODE_ENV ? process.env.NODE_ENV === 'production' : false,
        preserveModules: true,
      },
    ],
  },
]
