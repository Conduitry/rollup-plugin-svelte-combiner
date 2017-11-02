# Svelte-Combiner

A simple Rollup plugin to allow the script portion of Svelte components to be stored in a separate file.

This expects Svelte components to have the `.html` extension, and the `<script>`s to have the same path/filename with a `.js` extension. In your array of Rollup plugins, run this one before the normal `svelte` plugin.

TODO:

- allow CSS to be in external file
- allow file extension configuration for main component source file (`.html` vs. `.svelte` vs. whatever)

## License

Copyright (c) 2017 Conduitry

- [MIT](https://github.com/Conduitry/svelte-combiner/blob/master/LICENSE)
