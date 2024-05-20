'use strict';

const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const path = require('path');
const { rollup } = require('rollup');
const stripBanner = require('rollup-plugin-strip-banner');
const { cwd } = require('node:process');
const postcss = require('rollup-plugin-postcss');
const styles = require('rollup-plugin-styles');
const sass = require('rollup-plugin-sass');
// const css = require("rollup-plugin-import-css");

async function build(packageJson, watch) {
  console.log(cwd());
  const reactEntrypoint = {
    filepath: path.resolve(cwd(), 'src', 'index.js'),
    outputDirectory: path.resolve(cwd())
  };

  const formats = [
    {
      type: 'esm',
      directory: 'es',
      file: 'bundle.esm.js',
      exports: 'named',
      sourcemap: true
    },
    {
      type: 'commonjs',
      directory: 'lib',
      file: 'bundle.js',
      exports: 'named',
      sourcemap: true
    }
  ];

  for (const format of formats) {
    const outputDirectory = path.join(reactEntrypoint.outputDirectory, format.directory);

    const reactInputConfig = getRollupConfig(packageJson, reactEntrypoint.filepath, outputDirectory, false);
    const reactBundle = await rollup(reactInputConfig);
    // const watcher = rollup.watch(reactInputConfig);

    await reactBundle.write({
      dir: outputDirectory,
      //file: `dist/${format.file}`,
      format: format.type,
      preserveModules: true,
      preserveModulesRoot: path.dirname(reactEntrypoint.filepath),
      banner,
      exports: 'named'
    });
  }
}

const banner = `/**
   PRIVATE LICENSE
   */
  `;

// Base babel config for js and ts
const babelConfig = {
  babelrc: false,
  exclude: ['node_modules/**'],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: ['extends browserslist-config-carbon']
        }
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    'dev-expression',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-react-constant-elements'
  ],
  babelHelpers: 'bundled'
};

function getRollupConfig(packageJson, input, outDir, useTS) {
  return {
    input,
    // Mark dependencies listed in `package.json` as external so that they are
    // not included in the output bundle.
    external: [/node_modules/],
    /*external: [
      ...Object.keys(packageJson.peerDependencies || {}),
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.devDependencies || {}),
      /node_modules/
    ].map((name) => {
      // Transform the name of each dependency into a regex so that imports from
      // nested paths are correctly marked as external.
      //
      // Example:
      // import 'module-name';
      // import 'module-name/path/to/nested/module';
      return new RegExp(`^${name}(/.*)?`);
    }),*/
    plugins: [
      nodeResolve(),
      postcss({
        use: [
          [
            'sass',
            {
              includePaths: ['../../node_modules', path.resolve('node_modules')]
            }
          ]
        ]
      }),
      {
        name: 'Replace style-inject Rollup Plugin`', // it has to be after `postcss()`
        generateBundle(options, bundle) {
          const pattern = /["']([^"']*\/node_modules\/style-inject\/dist\/style-inject\.es\.js)["']/g;
          const replacement = "'style-inject'";

          for (const fileName of Object.keys(bundle)) {
            const chunk = bundle[fileName];
            if (chunk.type === 'chunk' && fileName.endsWith('.scss.js')) {
              chunk.code = chunk.code.replace(pattern, replacement);
            }
          }
        }
      },
      /*styles({
        mode: "inject",
      }),
      sass({
        output: './dist/index.css',
      }),
      css(),*/
      commonjs({
        include: /node_modules/
      }),
      // Modify plugins for builds that require typescript
      ...(useTS ? getTSPlugins(outDir) : getPlugins()),
      stripBanner(),
      {
        transform(_code, id) {
          // Make sure to mark feature-flags.js as having side-effects to make
          // sure it gets included in the final bundle
          if (id === path.join(__dirname, '..', 'src', 'feature-flags.js')) {
            return {
              moduleSideEffects: true
            };
          }
        }
      }
    ],
    watch: packageJson.rollup.watch
  };
}

/**
 * Rollup plugins to support typescript compilation/transpilation
 * @param {*} outDir
 * @returns
 */
function getTSPlugins(outDir) {
  return [
    typescript({
      noEmitOnError: true,
      noForceEmit: true,
      outputToFilesystem: false,
      compilerOptions: {
        rootDir: 'src',
        emitDeclarationOnly: true,
        outDir
      }
    }),
    babel({
      ...babelConfig,
      presets: [...babelConfig.presets, '@babel/preset-typescript'],
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    })
  ];
}

/**
 * Rollup plugins to support pure JS compilation
 * @returns
 */
function getPlugins() {
  return [babel(babelConfig)];
}

/*
build().catch((error) => {
  console.log(error);
  process.exit(1);
});
*/

function ReactBuild(packageJson) {
  build(packageJson).catch((error) => {
    console.log(error);
    process.exit(1);
  });
}

module.exports = ReactBuild;
