import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

// reads in the consuming projects config/config.json file, and exports it as JSON

function getConfig() {
    let configPath = resolve(process.cwd(), 'config', 'config.json');
    if (!existsSync(configPath)) {
        throw "Config file not found at: " + configPath;
    }
    
    var config = readFileSync(configPath, { encoding: 'utf-8' });
    
    return JSON.parse(config);
}

export default getConfig();