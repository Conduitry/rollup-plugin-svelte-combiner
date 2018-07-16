# rollup-plugin-svelte-combiner

A simple Rollup plugin to allow the script and stylesheet portions of a Svelte component to be stored in separate files.

## Requirements

- Node 8+
- Rollup 0.61+

## Usage

Import `svelteCombiner` in your `rollup.config.js`. Place `svelteCombiner()` in your array of Rollup plugins before the main `svelte` plugin.

The main file of a component is by default expected to have an `.html` or `.svelte` extension. This can be configured by initializing the plugin with `svelteCombiner({ extensions: ['.something', '.another'] })`. These should typically be set to the same `extensions` as are passed to the main `svelte` plugin.

The javascript portion of the component should have the same path and filename but with a `.js` extension. The stylesheet portion of the component should have the same path and filename but with a `.css` extension.

## TODO

- watch for new corresponding `.js`/`.css` files being added after Rollup watch starts (maybe?)

## License

Copyright (c) 2017-2018 Conduitry

- [MIT](LICENSE)
