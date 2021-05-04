#!/usr/bin/env node

const CLI = require("../build/index");

function gen_new_site(args) {
    console.log('Gen new site...', args)
}

function add_item(args) {
    console.log('Add item...', args)
}


function help(args) {
    console.log('Help...', args)
}

let commandMap = {
    "new-site": gen_new_site,
    "add": add_item,
    "help": help
}

const _getCommands = () => { return Object.keys(commandMap).join(', ') };
const _getArgs = () => { return process.argv.slice(2, process.argv.length) };

function run() {
    let args = _getArgs();
    if (!args.length) {
        return console.log("\nMust enter a command: " + _getCommands());
    }
    
    let command = args[0];
    console.log('command', command);
    
    if (!commandMap[command]) {
        return console.log("\nInvalid command. Available commands: " + _getCommands());
    }
    
    commandMap[command](args.slice(1,args.length));
}

run();