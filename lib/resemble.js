'use strict';

const util = require('util');
const pixelmatch = require('pixelmatch');
const fs = require('fs');
const request = require('request').defaults({ encoding: null });
const download = require('image-downloader');
const rimraf = require('rimraf');
const PNG = require('pngjs').PNG;
const _ = require('lodash');

const pokemons = require('../pokemons.json');

const compareOptions = {
    output: {
        errorColor: {
            red: 255,
            green: 0,
            blue: 255
        },
        errorType: "movement",
        transparency: 0.3,
        largeImageThreshold: 1200,
        useCrossOrigin: false,
        outputDiff: true
    },
    scaleToSameSize: true,
    ignore: "antialiasing"
};

const getImageDate = (file) => {
	return new Promise((resolve, reject) => fs.createReadStream(file).pipe(new PNG()).on('parsed', resolve));
}

const findMatch = (pokemon, downloadedFileLocation) => {
	return new Promise(async (resolve, reject) => {
		let matchName = false;
		// const pokemon = chunk[i];

		const pokemonImage = await getImageDate(pokemon.image);
		const downloadedBuffer = await getImageDate(downloadedFileLocation);

		let now = Date.now();
		const match = pixelmatch(pokemonImage, downloadedBuffer, null, 475, 475, { threshold: 0, includeAA: true });
		
		if(pokemon.id === 34) {
			let newNow = Date.now();
			console.log("finding match took: " + (newNow-now) + "ms");
		}
		if (match === 0) {
			console.log("Found match!!");
			return resolve(pokemon.name);
			// break;
		}
	});
};

module.exports = async (imageUrl) => {
	const tempDir = process.cwd() + '/temp'
	if (!fs.existsSync(tempDir)){
		fs.mkdirSync(tempDir);
	}

	const { filename, image } = await download.image({
		url: imageUrl,
		dest: tempDir
	});

	let start = Date.now();
	// console.log(chunks);
	const promises = [];

	for(let i = 0; i < pokemons.pokemons.length; i++) {
		const promise = findMatch(pokemons.pokemons[i], filename).catch(e => {});
		promises.push(promise);
	}

	const result = await Promise.race(promises);
	let finished = Date.now();
	console.log("trying all took: " + (finished-start) + "ms");

	console.log(result);

	// rimraf.sync(tempDir);

	// const pokemonName = _.find(result, chunkResult => !!chunkResult);
	return result;
};