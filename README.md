# Svelte-Combiner

A simple Rollup plugin to allow the script and stylesheet portions of a Svelte component to be stored in separate files.

This expects Svelte components to have an `.html` extension, the `<script>`s to have the same filename with a `.js` extension, and the `<style>`s to have the same filename with a `.css` extension. In your array of Rollup plugins, run this plugin before the regular `svelte` plugin.

TODO:

- allow file extension configuration for main component source file (`.html` vs. `.svelte` vs. whatever)
- support external `.css` without external `.js` (maybe?)

## License

Copyright (c) 2017 Conduitry

- [MIT](https://github.com/Conduitry/svelte-combiner/blob/master/LICENSE)
