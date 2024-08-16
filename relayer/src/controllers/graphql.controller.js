const ethers = require('ethers');
const viem = require('viem');
const sendNotice = require('./xmtp.controller.js');

/// @variable This keeps track of the index of the last notice that was sent out.
let lastAnalysedNotice = 0;

/// @title filterNotices
/// @notice This function extracts out notifications that have already been previously handled by the server based on the stored index (lastAnalysedNotice).
/// @notice Notices that hve not been previously handled by the server are sent to the decodeNotice function
/// @param notices An array of all Notices from a subgraph server
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

/// @title decodeNotice
/// @notice This function converts notices from hex to object notations, destructures them, then checks if they're ment to be relayed via XMTP network
/// @notice notices containing payload to be relayed via XMTP network are sent to the sendNotices function
/// @param notice A single Notices from a subgraph server
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