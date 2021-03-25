import fs from 'fs';

export function lpad(str, padChar, totalLength) {
    str = str.toString();
    var neededPadding = totalLength - str.length;
    for (var i = 0; i < neededPadding; i++) {
      str = padChar + str;
    }
    return str;
};

// returns arg itself, only if if it actually exists, otherwise returns the given defaultVal.
// allFalsy means it will return the defaultVal if the arg exists, but is false.
export function getdef(arg, defaultVal, allFalsy = false) {
    return (typeof arg == 'undefined' ? defaultVal :
        (allFalsy ? (!arg ? defaultVal : arg) : arg));
}

// console.log shortcut
export function cl(...args) {
    var args = new Array();
  
    for(var arg = 0; arg < arguments.length; ++ arg) {
      var arr = arguments[arg];
      args.push(arr);
    }
  
    // if last argument is 'trace', print console trace:
    if (arguments[arguments.length] == 'trace') {
      console.trace();
    }
  
    console.log.apply(console, [args]);
}

export function mysqlDate(date?: Date): string {
    let d = date || new Date();
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

export function stripFirstLastSlash(str) {
    return str.replace(/^\/|\/$/g, '');
}

export function mkDirSync(dir) {
    if (fs.existsSync(dir)) {
        return;
    }

    try {
        fs.mkdirSync(dir, { recursive: true });
    } catch(err){
        if(err.code == 'ENOENT'){
            fs.mkdirSync(path.dirname(dir, { recursive: true }));
            fs.mkdirSync(dir, { recursive: true });
        }
    }
}

export function debug() {
    if (process.env.DEBUG == true) {
        console.log("Debug:" + debug.caller);
	    console.log.apply(console, arguments);
    }
}

// Returns first element of the array, if exists, 
// or otherwise the element itself if not an array.
export function firstOrDefault(list, def = null) {
    if (typeof list.length != 'undefined') {
        if (list.length > 0) 
            return list[0]; 
    } else if (list) {
        return list;
    }

    return def;
}