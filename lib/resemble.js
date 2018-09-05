'use strict';

const fs = require('fs');
const download = require('image-downloader');
const _ = require('lodash');
const imghash = require("imghash");
const hamming = require('hamming-distance');
const sharp = require('sharp');

const hasConfig = require('./config');

const pokemons = require('../pokemons.json');

const findMatch = async (pokemon, hash) => {
	let name = false;
	let dist = null;
	let maxHammingDistance = 0;

	const configExists = hasConfig('config', false);

	if(configExists) {
		const config = require('../config.json');
		maxHammingDistance = config.maxHammingDistance;
	}

	for(let i = 0; i < pokemon.hashes.length; i++) {
		const checkHash = pokemon.hashes[i];
		dist = hamming(checkHash, hash);

		if (dist <= maxHammingDistance) {
			break;
		}
	}

	if(dist != null && dist <= maxHammingDistance) {
		return {
			name: pokemon.name,
			dist: dist
		};
	}
	
	throw new Error("Found nothing", "NO_POKEMON_FOUND");
};

const hash = async (imageUrl, overrideDir = false) => {
	let tempDir = process.cwd() + '/temp'
	if (!fs.existsSync(tempDir)){
		fs.mkdirSync(tempDir);
	}

	if(overrideDir) {
		tempDir = overrideDir;
	}

	let { filename, image } = await download.image({
		url: imageUrl,
		dest: tempDir
	});

	image = await sharp(image)
	.resize(475)
	.jpeg({
		quality: 100
	})
	.toBuffer();

	const hash = await imghash.hash(image, 20);

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

	let result = await Promise.all(promises);
	result = _.filter(result, res => res);
	result = _.orderBy(result, ['dist'], ['asc']);
	result = _.first(result);
	return result ? result.name : null;
}

module.exports = {
	resemble: resemble,
	hash: hash
}