const checkPokemons = () => {
    try {
		require('../pokemons.json');
	}
	catch(e) {
		if(e.code === 'MODULE_NOT_FOUND') {
			console.log("no pokemons.json found! Try running a scrape job first! Run: npm run scrape");
			process.exit();
		}
		else {
			throw e;
		}
	}
}

const checkConfig = () => {
    try {
		const config = require('../config.json');
        if(!config.discordToken || !config.discordToken.length) {
            console.log("Config.discordToken is required.");
            process.exit();
        }
	}
	catch(e) {
		if(e.code === 'MODULE_NOT_FOUND') {
			console.log("no config.json found! Copy config.example.json and rename it to config.json!");
			process.exit();
		}
		else {
			throw e;
		}
	}
}

module.exports = () => {
    checkPokemons();
    checkConfig();
};