'use strict';

const fs = require('fs');
const download = require('image-downloader');
const _ = require('lodash');
const imghash = require("imghash");
const hamming = require('hamming-distance');

const pokemons = require('../pokemons.json');

const findMatch = (pokemon, hash) => {
	return new Promise(async (resolve, reject) => {
		let dist = null;
		for(let i = 0; i < pokemon.hashes.length; i++) {
			const checkHash = pokemon.hashes[i];
			dist = hamming(checkHash, hash);

			if (dist == 0) {
				break;
			}
		}

		if(dist != null && dist == 0) {
			return resolve(pokemon.name);
		}
		
		return;
	});
};

const hash = async (imageUrl) => {
	const tempDir = process.cwd() + '/temp'
	if (!fs.existsSync(tempDir)){
		fs.mkdirSync(tempDir);
	}

	const { filename, image } = await download.image({
		url: imageUrl,
		dest: tempDir
	});

	const hash = await imghash.hash(filename);

	fs.unlinkSync(filename);

	return hash;
}

const resemble = async (imageUrl) => {
	const imageHash = await hash(imageUrl);

	const promises = [];
	for(let i = 0; i < pokemons.length; i++) {
		const promise = findMatch(pokemons[i], imageHash).catch(e => {});
		promises.push(promise);
	}

	const result = await Promise.race(promises);

	return result;
}

module.exports = {
	resemble: resemble,
	hash: hash
}