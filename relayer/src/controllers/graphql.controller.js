const ethers = require('ethers');
const viem = require('viem');
const sendNotice = require('./xmtp.controller.js');
let lastAnalysedNotice = 0;


function filterNotices(notices) {
    if (notices.length > 0) {
        let slicedNotices = notices.slice(lastAnalysedNotice);
        lastAnalysedNotice = notices.length;
        for (let notice of slicedNotices) {
            decodeNotice(notice);
        }
    } else {
        console.log('No new notices found.');
    }
}


function decodeNotice(notice) {
    let payload = ethers.toUtf8String((notice.node.payload).toString());
    payload = JSON.parse(payload);
    console.log(payload);

    let TxType = payload.TxType;
    let Origin = payload.Origin;
    let Destination = payload.Destination;
    let Payload = payload.Payload;

    if (TxType === 'InAppMessage') {
        console.log('Received InAppMessage');
        sendNotice(Origin, Destination, Payload);
    }
}



module.exports = filterNotices;