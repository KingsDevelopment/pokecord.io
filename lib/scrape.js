'use strict';

const needle = require('needle');
const download = require('image-downloader');
const fs = require('fs');
const unorm = require('unorm');

const _ = require('lodash');

const resemble = require("./resemble");
const hasConfig = require('./config');

const getHashesh = (baseUrl, number, saveDir) => {
	const urls = [
		{
			url: baseUrl,
			saveDir: saveDir + "/" + number + ".png"
		},
		{
			url: baseUrl.replace('/detail/', '/full/'),
			saveDir: saveDir + "/" + number + "_full.png"
		}
	];
	
	const promises = [];
	for(let i = 0; i < urls.length; i++) {
		const image = urls[i];
		const promise = resemble.hash(image.url, image.saveDir);

		promises.push(promise);
	}

	return Promise.all(promises);
}

const getPokemons = async (force = false) => {
	console.log("Getting pokedex data..");
	let data = await needle('GET', 'https://www.pokemon.com/us/api/pokedex/kalos');
	data = data.body;

	let hasCache = false;

	if(!force) {
		hasCache = hasConfig('pokemons', false);
	}

	const pokemons = hasCache ? require('../pokemons.json') : [];

	if(pokemons.length >= data.length) {
		console.log("skipping scrape job, already have data.");
		return true;
	}

	const saveDir = process.cwd() + '/temp';
	if (!fs.existsSync(saveDir)) {
		fs.mkdirSync(saveDir);
	}

	console.log("");
	for(let i = 0; i < data.length; i++) {
		const pokemon = data[i];

		if(_.find(pokemons, p => p.id === pokemon.id) && !force) {
			continue;
		}

		let pokemonName = unorm.nfd(pokemon.name);
		pokemonName = pokemonName.toLowerCase();

		console.log("Saving image hash of " + pokemonName + " - " + pokemon.number);

		if (!fs.existsSync(saveDir)){
			fs.mkdirSync(saveDir);
		}

		const hashes = await getHashesh(pokemon.ThumbnailImage, pokemon.number, saveDir);

		const foundPokemon = _.find(pokemons, p => p.id === pokemon.id);
		if(foundPokemon) {
			for(let i = 0; i < hashes.length; i++) {
				const imageHash = hashes[i];
				if(foundPokemon.hashes.indexOf(imageHash) === -1) {
					foundPokemon.hashes.push(imageHash);
				}
			} 
		}
		else {
			pokemons.push({
				name: pokemonName,
				number: pokemon.number,
				id: pokemon.id,
				hashes: hashes
			});
		}
	}
	console.log("");

	console.log("saving data.");
	fs.writeFileSync(process.cwd() + '/pokemons.json', JSON.stringify(pokemons, null, '\t'), { flag: 'w' });

	fs.rmdirSync(saveDir);

	console.log("Finished scrape job!");
	return true;
}


module.exports = getPokemons;