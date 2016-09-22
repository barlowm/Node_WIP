    'use strict';
const sprintf = require('sprintf-js').sprintf;
const init = require('./init');

const createApp = init.createApp();
const port = createApp.config.OMA_DM.port;

const server = createApp.listen(port, function() {
    let msg = sprintf(createApp.Msgs.Startup, port);
    console.log('debug', msg);
});

module.exports = { server: server, app: createApp };