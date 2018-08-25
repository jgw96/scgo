import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  outputTargets: [
    {
      type: 'www',
      serviceWorker: {
        swSrc: 'src/sw.js',
        globPatterns: [
          '**/*.{js,css,json,html,ico,png,jpeg}'
        ],
        globIgnores: [
          'build/app/svg/*.js',
          'build/app/*.es5.js'
        ]
      },
    }
  ],
  copy: [
    {
      src: 'helpers/worker-dom/'
    },
    {
      src: 'hello-world.js'
    }
  ],
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css'
};
