const syncer = require('../syncer');

exports.command = 'sync';
exports.describe = "Start sync";
exports.builder = {};
exports.handler = async (argv) => syncer.sync(argv)