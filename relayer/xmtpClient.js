import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';

const PRIVATE_KEY = "bot-signer-private-key-here";
const WALLET_TO = 'msg-reciever-address-here'; 

let xmtp;

async function initializeXmtp() {
    if (!xmtp) {
        try {
          const wallet = new Wallet(PRIVATE_KEY);
          xmtp = await Client.create(wallet, { env: 'dev' });
        } catch (error) {
          console.error('Error initializing XMTP client:', error);
        }
      }
}

export async function sendNotice(notice) {
  try {
    await initializeXmtp();
    const conversation = await xmtp.conversations.newConversation(WALLET_TO);
    const message = await conversation.send(notice.payload);
    console.log('Message sent:', message);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
