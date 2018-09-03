'use strict';

module.exports = function(grunt) {
	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		nodemon: {
			dev: {
				script: 'index.js',
				options: {
					args: ['-b'],
					callback: function(nodemon) {
						nodemon.on('log', function(event) {
							console.log(event.colour);
						});
					},
					env: {
						PORT: '3000'
					},
					cwd: __dirname,
					ignore: ['node_modules/**'],
					ext: 'js,json',
					watch: ['./'],
					delay: 1000,
					legacyWatch: true
				}
			}
		}
	});

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// Default task(s).
	grunt.registerTask('default', ['nodemon']);

	grunt.loadNpmTasks('grunt-contrib-nodemon');
};