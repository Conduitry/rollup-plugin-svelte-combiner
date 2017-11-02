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
				let htmlPromise = readText(id)
				let jsId = id.slice(0, -4) + 'js'
				let jsPromise = readText(jsId)
				componentsJs.add(jsId)
				return Promise.all([htmlPromise, jsPromise]).then(([html, js]) => {
					if (js) {
						html += `<script>${js}\nimport ${JSON.stringify(jsId)}</script>`
					}
					return html
				})
			} else if (id.endsWith('.js')) {
				if (componentsJs.has(id)) {
					return ''
				}
			}
		},
	}
}
