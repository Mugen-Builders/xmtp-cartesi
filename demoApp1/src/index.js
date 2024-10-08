// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");
// const { extractData } = require("noozzle");
// import {extractData} from 'noozzle';
import { hexToString, stringToHex } from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);
let reviews = [];
let totalNotice = 0;


async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  let caller = data.metadata.msg_sender;

  let payload = data.payload;
  let target;
  let newData;
  let signer;

  let hexString = hexToString(payload);
  console.log(`caller is: ${caller.toString()}`);
  console.log(`payload is: ${hexString}`);

  let jsonData = JSON.parse(hexString);
  target = jsonData.Destination;
  newData = jsonData.Message;

  console.log(`Message is: ${newData}`);
  console.log(`Target is: ${target}`);

  recordNewReview(newData, caller.toString());
  totalNotice = totalNotice + 1;

  let noticeStructure = {
    data: reviews,
    totalNotice: totalNotice,
    TxType: 'InAppMessage',
    Origin: caller.toString(),
    Destination: '0xbD8Eba8Bf9e56ad92F4C4Fc89D6CB88902535749',
    Payload: newData,
  }
  console.log(noticeStructure);
  let hexNotice = stringToHex(JSON.stringify(noticeStructure));
  console.log(hexNotice);

  emitNotice(hexNotice);
  return "accept";
}



function recordNewReview(data, sender) {
  let newBody = {
    review: data,
    sender: sender,
    id: reviews.length + 1,
  }
  reviews.push(newBody);
}

emitNotice = async (hexresult) => {
  advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: hexresult }),
  });
  return advance_req;
}


async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
