'use strict';

const compare = require('resemblejs/compareImages');
const fs = require('fs');
const request = require('request').defaults({ encoding: null });
const download = require('image-downloader');
const rimraf = require('rimraf');

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

module.exports = async (imageUrl) => {
	const tempDir = process.cwd() + '/temp'
	if (!fs.existsSync(tempDir)){
		fs.mkdirSync(tempDir);
	}

	console.log(imageUrl);
	const { filename, downloadedBuffer } = await download.image({
		url: imageUrl,
		dest: tempDir
	});

	for(let i = 0; i < pokemons.pokemons.length; i++) {
		const pokemon = pokemons.pokemons[i];
		console.log("Matching against: " + pokemon.name);

		const pokemonImage = await fs.readFile(pokemon.image);
		const data = await compare(
	        downloadedBuffer,
	        pokemonImage,
	        compareOptions
	    );

	    console.log(data);

	    if (i > 5) {
	    	break;
	    }
	}

	rimraf.sync(tempDir);
};