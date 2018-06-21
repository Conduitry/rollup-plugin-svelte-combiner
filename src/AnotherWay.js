var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var svelte = require('rollup-plugin-svelte');
var ugly = require('rollup-plugin-uglify');
var replace = require('rollup-plugin-replace');
var fs = require('fs');
var path = require('path');

var dirs = fs.readdirSync('./Widgets').filter(x => fs.statSync('./Widgets/' + x));
var langs = ['NO','EN'];


function read_lang_file(widget, lang) {
    var data = fs.readFileSync(`./Widgets/${widget}/${lang}-Values.json`);
    if (data[0] === 0xEF && data[1] === 0xBB && data[2] === 0xBF) {
        data = data.slice(3);
    }
    return "" + data;
}

function config(widget, lang) {
    return {
        input: `./Widgets/${widget}/widget.js`,
        output: {
            format: 'iife',
            file: `./dist/${lang}-${widget}.js`,
        },
        //sourcemap: 'inline',
        plugins: [
            replace({
                delimiters: ['[[', ']]'],
                values: JSON.parse(read_lang_file(widget, lang))
            }),
            svelte(),
            //babel(),
            //ugly(),
        ],
    }
};


function build_dir(dir) {
    langs.forEach(function (lang) {
        var cfg = config(dir, lang);
        rollup.rollup(config(dir, lang)).then(function (bundle) {
            bundle.write(cfg.output);
            console.log(`Build of ${dir} with language ${lang} SUCCESS`);
        });
    });
}

dirs.forEach(function (dir) {
    build_dir(dir);
});


var c = {};
var timeOut;

fs.watch("./Widgets", { recursive: true }, (event, filename) => {
    var dir = path.dirname(filename);
    if (event === 'change' && dir !== '.') {
        c[dir] = event;
        if (!timeOut) {
            timeOut = setTimeout(() => {
                var toC = c;
                c = {};
                for (k in toC) {
                    try {
                        console.log(`Building: ${k}`)
                        build_dir(dir);
                    } catch (ex) {
                        console.error(`ERROR ${ex}`);
                    }
                }
                timeOut = null;
            },200);
        }
    }    
});
