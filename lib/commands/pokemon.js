const prefix = require('../prefix');

const sendMulti = (argv, serverPrefix, numbers, currentNumber) => {
    console.log(numbers);
    console.log(currentNumber);
    console.log(numbers.indexOf(currentNumber));
    console.log(typeof numbers[0]);
    if(numbers.indexOf(currentNumber) >= 0) {
        argv.msg.channel.send(serverPrefix + "pokemon " + currentNumber);
        setTimeout(() => sendMulti(argv, serverPrefix, numbers, (currentNumber + 1)), 2000);
    }
}

exports.command = 'pokemon [numbers...]';
exports.describe = "Show bot's pokemon";
exports.builder = {};
exports.handler = async (argv) => {
    const serverPrefix = await prefix(argv.msg);
    if(!argv.numbers) {
        argv.msg.channel.send(serverPrefix + "pokemon");
        return
    }

    sendMulti(argv, serverPrefix, argv.numbers, 1);
    return;
};