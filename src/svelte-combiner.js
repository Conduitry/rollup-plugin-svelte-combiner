import { readFile } from 'fs'

const readText = filename =>
	new Promise(res =>
		readFile(filename, (err, data) => (err ? res(null) : res(data.toString())))
	)

export default function svelteCombiner(
	{ extensions = ['.html', '.svelte'] } = {}
) {
	const externalFiles = new Set()
	return {
		load: id => {
			if (externalFiles.has(id)) {
				return ''
			}
			const extension = extensions.find(extension => id.endsWith(extension))
			if (extension) {
				const baseId = id.slice(0, -extension.length)
				const jsId = baseId + '.js'
				const cssId = baseId + '.css'
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
			}
		},
	}
}
