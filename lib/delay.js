let client;

module.exports = (delay) => new Promise((resolve, reject) => {
    if(client) {
        console.log("using client delay");
        client.setTimeout(resolve, delay);
    }
    else {
        setTimeout(resolve, delay);
    }
});