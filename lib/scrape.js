'use strict';

const needle = require('needle');
const download = require('image-downloader');
const fs = require('fs');

const _ = require('lodash');
var imghash = require("imghash");

const getPokemons = async () => {
	const saveDir = process.cwd() + '/temp';
	if (!fs.existsSync(saveDir)) {
		fs.mkdirSync(saveDir);
	}

	console.log("Getting pokedex data..");
	let data = await needle('GET', 'https://www.pokemon.com/us/api/pokedex/kalos');
	data = data.body;

	const pokemons = [];

	console.log("");
	for(let i = 0; i < data.length; i++) {
		const pokemon = data[i];
		console.log("Saving image hash of " + pokemon.name + " - " + pokemon.number)
		const pokemonName = pokemon.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
		if (!fs.existsSync(saveDir)){
			fs.mkdirSync(saveDir);
		}

		const imageUrl = pokemon.ThumbnailImage.replace('/detail/', '/full/');
		const { filename, image } = await download.image({
			url: imageUrl,
			dest: saveDir
		});

		const imageHash = await imghash.hash(filename);

		const foundPokemon = _.find(pokemons, p => p.id === pokemon.id);
		if(foundPokemon) {
			if(foundPokemon.hashes.indexOf(imageHash) === -1) {
				foundPokemon.hashes.push(imageHash);
			}
		}
		else {
			pokemons.push({
				name: pokemonName,
				number: pokemon.number,
				id: pokemon.id,
				hashes: [imageHash]
			});
		}

		fs.unlinkSync(filename);
	}
	console.log("");

	console.log("saving data.");
	fs.writeFileSync(process.cwd() + '/pokemons.json', JSON.stringify(pokemons, null, '\t'), { flag: 'w' });

	fs.rmdirSync(saveDir);

	console.log("Finished scrape job!");
	return true;
}


module.exports = getPokemons;