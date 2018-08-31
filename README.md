# pokecord.io
autocatch pokecord pokemons

## Usage

Run the following commands:

    docker build . -t pokecord
    docker create -v your/config.json:/opt/app/config.json --name=pokecord pokecord start
    docker start -a pokecord