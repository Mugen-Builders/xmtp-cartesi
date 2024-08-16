const { Client } = require('@xmtp/xmtp-js');
const { Wallet } = require('ethers');
require('dotenv').config();

/// @variable This is the private key belonging to the wallet that'll be used to relay messages from the dApp.
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/// @variable This is the second private key belonging to a different wallet that'll be used to receive messages that were sent to addresses that are not active on XMTP this way they're not completely lost.
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;

let xmtp;

/// @title initializeXmtp
/// @notice This function uses a privatekey to get an account that will be used to create an active XMTP client for sending and receiving messages.
/// @param private_key Private key belonging to the wallet that's being used to setup an XMTP connection
async function initializeXmtp(private_key) {
    if (!xmtp) {
        try {
            const wallet = new Wallet(private_key);
            xmtp = await Client.create(wallet, { env: 'dev' });
            return wallet.address;
        } catch (error) {
            console.error('Error initializing XMTP client:', error);
        }
    }
}

/// @title sendNotice
/// @notice This function checks if an address is active on XMTP then relays the message to destination adress else it relays the message to the fallback address.
/// @param Origin Address thats initiating the message
/// @param Destination Address the message is to be sent to
/// @param Payload message that's to be sent via XMTP
async function sendNotice(Origin, Destination, Payload) {
    try {
        await initializeXmtp(PRIVATE_KEY);

        const isOnNetwork = await Client.canMessage(
            Destination,
            { env: "dev" },
        );
        if (!isOnNetwork) {
            console.log(`Destination wallet is not on the network. Sending message to Fallback wallet......`);
            await initializeXmtp(PRIVATE_KEY2);
            const conversation = await xmtp.conversations.newConversation((new Wallet(PRIVATE_KEY2)).address);
            const message = await conversation.send({ sender: Origin, Message: Payload });
            console.log('Message sent:', message);
        } else {
            const conversation = await xmtp.conversations.newConversation(Destination);
            const message = await conversation.send({ sender: Origin, Message: Payload });
            console.log('Message sent:', message);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

module.exports = sendNotice;
