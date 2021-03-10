// Config: relative to where npm command is run:
const SRC_DIR = 'src';
const OUTPUT_DIR = 'build';
const IS_DEV = true;
const TARGET = 'es2018';

function build(entryFile, outFile) {
    require('esbuild').build({
        entryPoints: [entryFile],
        outfile: outFile,
        platform: 'node',
        bundle: true,
        define: { "process.env.NODE_ENV": IS_DEV ? "\"development\"" : "\"production\"" },
        target: TARGET,
        sourcemap: true
    })
    .then(r => { console.log(`Built ${outFile}.`) })
    .catch((e) => {
        console.log("Error building:", e.message);
        process.exit(1)
    })
}

build(`${SRC_DIR}/index.ts`, `${OUTPUT_DIR}/index.js`);
build(`${SRC_DIR}/scripts/generateMigrations.ts`, `${OUTPUT_DIR}/generateMigrations.js`);