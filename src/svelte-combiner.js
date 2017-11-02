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

let componentsJs = new Set()

export default function svelteCombinerPlugin() {
	return {
		load(id) {
			if (id.endsWith('.html')) {
				let jsId = id.slice(0, -4) + 'js'
				componentsJs.add(jsId)
				return Promise.all([readText(id), readText(jsId)]).then(
					([html, js]) =>
						js
							? `${html}<script>${js}\nimport ${JSON.stringify(jsId)}</script>`
							: html
				)
			} else if (componentsJs.has(id)) {
				return ''
			}
		},
	}
}
