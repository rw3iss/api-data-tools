import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

// reads in the consuming project's config json file, and exports it as a JSON obect.
function getConfig() {
    let configPath = process.env.CONFIG_PATH || resolve(process.cwd(), 'config', 'config.json');

    try {
        if (!existsSync(configPath)) {
            return {};
        }

        var config = readFileSync(configPath, { encoding: 'utf-8' });
        return JSON.parse(config);
    } catch(e) {
        console.log("Error parsing config file: " + configPath, e);
        return {};
    }
}

export default getConfig();