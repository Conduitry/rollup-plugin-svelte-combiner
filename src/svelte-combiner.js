import { readFile } from 'fs';

const readText = filename =>
	new Promise(res =>
		readFile(filename, (err, data) => (err ? res(null) : res(data.toString())))
	);

export default function svelteCombiner({
	extensions = ['.html', '.svelte'],
} = {}) {
	return {
		transform: async (code, id) => {
			const extension = extensions.find(extension => id.endsWith(extension));
			if (extension) {
				const baseId = id.slice(0, -extension.length);
				const jsId = baseId + '.js';
				const cssId = baseId + '.css';
				const [js, css] = await Promise.all([jsId, cssId].map(readText));
				const dependencies = [];
				if (js) {
					dependencies.push(jsId);
					code += `\n<script>\n${js}\n</script>\n`;
				}
				if (css) {
					dependencies.push(cssId);
					code += `\n<style>\n${css}\n</style>\n`;
				}
				return { code, dependencies };
			}
		},
	};
}
