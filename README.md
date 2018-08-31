# pokecord.io
autocatch pokecord pokemons

## Usage

### Easy way (pre-scraped image)

copy the `config.example.json` and rename to `config.json` and edit the values.

	docker create -v your/config.json:/opt/app/config.json --name=pokecord-io kingsdev/pokecord-io start
	docker start -a pokecord-io

### Custom

Create a docker image from this repository:

	docker build . -t pokecord-io

Then copy the `config.example.json` and rename to `config.json` and edit the values.

Create and run your docker:

	docker create -v your/config.json:/opt/app/config.json --name=pokecord-io pokecord-io start
	docker start -a pokecord-io