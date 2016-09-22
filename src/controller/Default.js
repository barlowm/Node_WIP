'use strict';
const config = require('config');
const Msgs = config.get('Msgs');
const sprintf = require('sprintf-js').sprintf;

module.exports = {
    dfltEntry : function(req, res, next) {
        console.log('debug', sprintf(Msgs.Something, req.method, req.originalUrl, req.route, '', ''));
        next();
    }
};