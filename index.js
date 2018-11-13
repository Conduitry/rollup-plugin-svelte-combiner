const fs = require('fs');

const readText = filename => new Promise(res => fs.readFile(filename, (err, data) => (err ? res(null) : res(data.toString()))));

module.exports = ({ extensions = ['.html', '.svelte'] } = {}) => ({
	transform: (code, id) => {
		const extension = extensions.find(extension => id.endsWith(extension));
		if (extension) {
			const baseId = id.slice(0, -extension.length);
			const jsId = baseId + '.js';
			const cssId = baseId + '.css';
			return Promise.all([jsId, cssId].map(readText)).then(([js, css]) => {
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
			});
		}
	},
});
