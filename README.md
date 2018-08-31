# pokecord.io
autocatch pokecord pokemons

## Usage

Create a docker image from this repository:

    docker build . -t pokecord

Then copy the `config.example.json` and rename to `config.json` and edit the values.

Create and run your docker:

    docker create -v your/config.json:/opt/app/config.json --name=pokecord pokecord start
    docker start -a pokecord