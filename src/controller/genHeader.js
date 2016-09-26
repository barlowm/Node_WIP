"use strict";

module.exports = {
    genHeader : function (headerInfo) {
        let Version = headerInfo.ver;   // Version = 4 bits from 0 - 15, 10 = 1010
        let OC = headerInfo.oc;         // OC = 5 bits from 0 - 31 so take OC #, shift 1 bit right then + (Version << 4) and then MSB of next byte
        let LSB = OC & 1;
        let Byte1 = (Version << 4) | (OC >>> 1);
        let Byte2 = LSB << 7;
        let theData = new Buffer([Byte1, Byte2]);
        console.log('debug', 'Header binary string ' + Byte1.toString(2) + ' - ' + Byte2.toString(2));
        return theData;
    }

};
