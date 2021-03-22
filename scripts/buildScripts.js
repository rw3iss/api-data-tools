// Config: relative to where npm command is run:
const APP_BASE = 'src'
const ENTRY_FILE = 'index.ts'
const OUTPUT_DIR = 'build'
const OUTPUT_FILE = 'index.js'
const IS_DEV = true
const TARGET = 'es2018'

function build(entryFile, outFile) {
    require('esbuild').build({
        entryPoints: [entryFile],
        outfile: outFile,
        platform: 'node',
        bundle: true,
        define: { "process.env.NODE_ENV": IS_DEV ? "\"development\"" : "\"production\"" },
        loader: { 
            // loaders: js, jsx, ts, tsx, css, json, text, base64, dataurl, file, binary 
        },
        target: TARGET,
        logLevel: 'silent',
        plugins: [envFilePlugin]
    })
    .then(r => { console.log("Build succeeded: " + outFile) })
    .catch((e) => {
        console.log("Error building:", e.message);
        process.exit(1)
    })
}

const envFilePlugin = {
	name: 'env-file',
	setup(build) {
		const fs = require('fs')
		const path = require('path')

		function _findEnvFile(dir) {
			if (!fs.existsSync(dir)) return false
			const filePath = `${dir}/.env`;
			if (fs.existsSync(filePath)) {
				return filePath;
			} else {
				return _findEnvFile(path.resolve(dir, '../'));
			}
		}

		build.onResolve({ filter: /^env$/ }, async args => {
			// find a .env file in current directory or any parent:
            let p = _findEnvFile(args.resolveDir);
            return {
                path: p ? p : '',
                namespace: 'env-ns'
            }
		})

		build.onLoad({ filter: /.*/, namespace: 'env-ns' }, async args => {
			// read in .env file contents and combine with regular .env:
            if (args.path && args.path != '') {
                const data = await fs.promises.readFile(args.path, 'utf8')
                const buf = Buffer.from(data)
                const config = require('dotenv').parse(buf)
                return {
                    contents: JSON.stringify({ ...process.env, ...config }),
                    loader: 'json'
                }
            } else {
                return {
                    contents: JSON.stringify({ ...process.env }),
                    loader: 'json'
                }
            }
		})
	}
}

build(`scripts/screipts/compilePackage.js`, `${OUTPUT_DIR}/scripts/compilePackage.js`)
