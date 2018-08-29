'use strict';

const commander = require('commander');

const run = async () => {
	// setup commander
	commander
	.version('0.1.0')
	.option('-s, --scrape', 'Run scrape job')
	.option('-f, --force', 'Force scrape job')
	.option('-b, --bot', 'Run bot')
	.parse(process.argv);

	// get libraries
	const scrape = require('./lib/scrape');
	const resemble = require('./lib/resemble');

	if(commander.scrape) {
		console.log("running scrape job");
		await scrape(commander.force);
	}

	if(commander.bot) {
		console.log("running bot");
		await resemble('https://assets.pokemon.com/assets/cms2/img/pokedex/full/005.png')
		return;
	}

	commander.outputHelp();
}


run();