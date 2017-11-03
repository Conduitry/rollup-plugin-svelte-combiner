import { readFile } from 'fs'

function readText(filename) {
	return new Promise(res => {
		readFile(filename, (err, data) => {
			if (err) {
				res(null)
			} else {
				res(data.toString())
			}
		})
	})
}

let externalFiles = new Set()

export default function svelteCombinerPlugin() {
	return {
		load(id) {
			if (id.endsWith('.html')) {
				let jsId = id.slice(0, -4) + 'js'
				externalFiles.add(jsId)
				let cssId = id.slice(0, -4) + 'css'
				externalFiles.add(cssId)
				return Promise.all([
					readText(id),
					readText(jsId),
					readText(cssId),
				]).then(
					([html, js, css]) =>
						js
							? css
								? `${html}
<script>
${js}
import ${JSON.stringify(jsId)}
import ${JSON.stringify(cssId)}
</script>
<style>
${css}
</style>`
								: `${html}
<script>
${js}
import ${JSON.stringify(jsId)}
</script>`
							: html
				)
			} else if (externalFiles.has(id)) {
				return ''
			}
		},
	}
}
