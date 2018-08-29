'use strict';

const needle = require('needle');
const moment = require('moment');
const download = require('image-downloader');
const fs = require('fs');
const path = require('path');

const config = require('../config.json');
const pokemons = require('../pokemons.json');

const getPokemons = async () => {
	console.log("Checking images location..");
	const saveDir = process.cwd() + pokemons.imageDestination;

	if (!fs.existsSync(saveDir)) {
    	console.log(saveDir + " does not exist. Exiting..");
    	process.exit();	
	}

	console.log(saveDir + " exists!");

	console.log("Getting pokedex data..");
	let data = await needle('GET', config.pokedexUrl);
	data = data.body;

	pokemons.pokemons = [];

	console.log("");
	for(let i = 0; i < data.length; i++) {
		const pokemon = data[i];
		console.log("Saving image of " + pokemon.name)

		const { filename, image } = await download.image({
			url: pokemon.ThumbnailImage.replace('/detail/', '/full/'),
  			dest: saveDir
		});

		pokemons.pokemons.push({
			name: pokemon.name,
			number: pokemon.number,
			id: pokemon.id,
			image: filename
		});

		if(i > 10) {
			break;
		}
	}
	console.log("");

	console.log("saving data.");
	pokemons.latest = moment().toISOString();
	fs.writeFileSync(process.cwd() + '/data/pokemons.json', JSON.stringify(pokemons, null, '\t'));

	console.log("Finished scrape job!");
	return true;
}


module.exports = async (force = false) => {
	let lastDate = moment(pokemons.latest);
	let now = moment();

	if(lastDate.diff(now, 'days') < config.differenceInDays && !force) {
		console.log("Skipping scrape job as data is younger than " + config.differenceInDays + " days.");
		return;
	}

	return getPokemons();
};