import { readFile } from 'fs'

const readText = filename =>
	new Promise(res =>
		readFile(filename, (err, data) => (err ? res(null) : res(data.toString())))
	)

export default function svelteCombinerPlugin() {
	const externalFiles = new Set()
	return {
		load(id) {
			if (id.endsWith('.html')) {
				const jsId = id.slice(0, -4) + 'js'
				const cssId = id.slice(0, -4) + 'css'
				externalFiles.add(jsId)
				externalFiles.add(cssId)
				return Promise.all([id, jsId, cssId].map(readText)).then(
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
