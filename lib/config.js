const checkPokemons = (kill) => {
    let hasPokemons = false;

    try {
        require('../pokemons.json');
        hasPokemons = true;
	}
	catch(e) {
		if(e.code === 'MODULE_NOT_FOUND') {
            if(kill) {
                console.log("no pokemons.json found! Try running a scrape job first! Run: npm run scrape");
			    process.exit();
            }
		}
		else {
			throw e;
		}
    }
    
    return hasPokemons;
}

const checkConfig = (kill) => {
    let hasConfig = false;

    try {
		const config = require('../config.json');
        if(!config.discordToken || !config.discordToken.length) {
            if (kill) {
                console.log("Config.discordToken is required.");
                process.exit();
            }
        }

        hasConfig = true;
	}
	catch(e) {
		if(e.code === 'MODULE_NOT_FOUND') {
            if (kill) {
                console.log("no config.json found! Copy config.example.json and rename it to config.json!");
                process.exit();
            }
		}
		else {
			throw e;
		}
    }
    
    return hasConfig;
}

module.exports = (type = 'both', kill = true) => {
    let valid = false;

    if(type === 'pokemons' || type === 'both') {
        valid = checkPokemons(kill);
    }

    if(type === 'config' || type === 'both') {
        valid = checkConfig(kill);
    }

    return valid;
};