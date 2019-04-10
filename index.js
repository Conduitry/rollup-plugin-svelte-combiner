const fs = require('fs');

const read_text = filename => new Promise(res => fs.readFile(filename, (err, data) => (err ? res(null) : res(data.toString()))));

module.exports = ({ extensions = ['.html', '.svelte'] } = {}) => ({
	transform(code, id) {
		const extension = extensions.find(extension => id.endsWith(extension));
		if (extension) {
			const base_id = id.slice(0, -extension.length);
			const js_id = base_id + '.js';
			const css_id = base_id + '.css';
			return Promise.all([js_id, css_id].map(read_text)).then(([js, css]) => {
				if (js) {
					this.addWatchFile(js_id);
					code += `\n<script>\n${js}\n</script>\n`;
				}
				if (css) {
					this.addWatchFile(css_id);
					code += `\n<style>\n${css}\n</style>\n`;
				}
				return code;
			});
		}
	},
});
