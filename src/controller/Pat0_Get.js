'use strict';
const config = require('config');
const Msgs = config.get('Msgs');
const sprintf = require('sprintf-js').sprintf;

module.exports = {
    getData : function(req, res){
        let msg = sprintf(Msgs.WeGotIt, config.OMA_DM.Ver, config.OMA_DM.OC);
        res.json(msg);
    }
}