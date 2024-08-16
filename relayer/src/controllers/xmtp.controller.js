const { Client } = require('@xmtp/xmtp-js/dist');
const { Wallet } = require('ethers');
require('dotenv/lib/main').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;

let xmtp;

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
