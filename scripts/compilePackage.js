//import Config from '../src/lib/Config';
const ifdef = require('./ifdef');
// compiles using esbuild #IFDEF feature to remove parts of code.

// todo: get Config from Config class.
// console.log('Config', Config);

// Config: relative to where npm command is run:
const SRC_DIR = 'src';
const OUTPUT_DIR = 'build';
const IS_DEV = true;
const TARGET = 'es2018';

const define = {
    "process.env.NODE_ENV": IS_DEV ? "\"development\"" : "\"production\""
};

function build(entryFile, outFile) {
    require('esbuild').build({
        entryPoints: [entryFile],
        outfile: outFile,
        platform: 'node',
        bundle: true,
        target: TARGET,
        //sourcemap: true,
        define: define,
        plugins: [ifdef(define)],
    })
    .then(r => { console.log(`Built ${outFile}.`) })
    .catch((e) => {
        console.log("Error building:", e.message);
        process.exit(1)
    })
}

build(`${SRC_DIR}/index.ts`, `${OUTPUT_DIR}/index_compiled.js`);