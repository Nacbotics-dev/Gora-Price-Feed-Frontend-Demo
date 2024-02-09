
import {ABI} from "./ABI";
import algosdk from "algosdk";
import { Buffer } from 'buffer';
import { sha512_256 } from "js-sha512";

export const NETWORK_CONFIG = {
    testnet:{
        NODE_BASEURL : "https://testnet-api.algonode.cloud",
        NODE_TOKEN : "",
        NODE_PORT:"443",
        NODE_NETWORK:"testnet"
    },
    mainnet:{
        NODE_BASEURL : "https://mainnet-api.algonode.cloud",
        NODE_TOKEN : "",
        NODE_PORT:"443",
        NODE_NETWORK:"mainnet"
    }
}

// GORA TEST NET
// export const GORA_TOKEN_ID =  439549897;
// export const GORA_CONTRACT_ID =  439550742;

// GORA MAINNET
export const GORA_TOKEN_ID =  1138500612;
export const GORA_CONTRACT_ID =  1140801821;


export const PRICE_PAIR_CONTRACT_ID =  1452153032;
export const PRICE_PAIR_CONTRACT_ADDRESS = "KWG53RA5ZLZBWJTDYFFIVSJSRKN3XWMRIORJIBTLHXMIDMIXX45FFXV7KE";

export const indexer = new algosdk.Indexer(NETWORK_CONFIG["mainnet"].NODE_TOKEN, NETWORK_CONFIG["mainnet"].NODE_BASEURL, NETWORK_CONFIG["mainnet"].NODE_PORT);
export const algodClient = new algosdk.Algodv2(NETWORK_CONFIG["mainnet"].NODE_TOKEN, NETWORK_CONFIG["mainnet"].NODE_BASEURL, NETWORK_CONFIG["mainnet"].NODE_PORT);


async function makeATCComposer() {
    // example: ATC_CREATE
    const atc = new algosdk.AtomicTransactionComposer();
    return atc
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function unpackNumber(buff) {

    if (!buff[0])
      return NaN;
  
    const isNegative = buff[0] == 2;
    const intVal = buff.readBigUInt64BE(1) * BigInt(isNegative ? -1 : 1);
    const decVal = buff.readBigUInt64BE(9);
    return `${intVal}` + (decVal ? `.${decVal}` : "");
}


export async function create_oracle_request_params(sender,signer,price_pair_name) {
    const suggestedParams = await algodClient.getTransactionParams().do();
    const atc = await makeATCComposer();
    // ATC_CONTRACT_INIT
    const contract = new algosdk.ABIContract(ABI);

    const xferTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender,
        suggestedParams,
        to: PRICE_PAIR_CONTRACT_ADDRESS,
        amount: 5_00_000,
    });

    const sourceArg = [
        7, // sourceID
        [
            Buffer.from("##signKey"),  // API key
            Buffer.from(price_pair_name.split("/")[0]), // Currency 1
            Buffer.from(price_pair_name.split("/")[1]) // Currency 2
        ] ,
        60 // time delay
    ]


    //USING ATC CALL THE CREATE CONTRACT METHOD
    atc.addMethodCall({
        appID: PRICE_PAIR_CONTRACT_ID,
        method: contract.getMethodByName('create_request_params_box'),
        methodArgs: [
            Buffer.from(price_pair_name),
            GORA_TOKEN_ID,
            [sourceArg],
            0,
            Buffer.from(price_pair_name),
            {
                txn: xferTxn,
                signer: signer,
            },
        ],
        sender: sender,
        signer: signer,
        suggestedParams,
        boxes: [
            {
              appIndex: PRICE_PAIR_CONTRACT_ID,
              name: new Uint8Array(Buffer.from("req"+price_pair_name)),
            },
        ]
    });

    // example: ATC_RESULTS
    const result = await atc.execute(algodClient, 4);
    return(result?.methodResults)
    
}



export async function fetch_token_price_from_oracle(sender,signer,price_pair_name) {
    const suggestedParams = await algodClient.getTransactionParams().do();
    const atc = await makeATCComposer();

    const reqKey = Buffer.from(crypto.randomUUID())
    const contract = new algosdk.ABIContract(ABI);
    const storageKeyData = Buffer.from([
        ...algosdk.decodeAddress(PRICE_PAIR_CONTRACT_ADDRESS).publicKey,
        ...reqKey,
    ]);
    const storageKey = new Uint8Array(sha512_256.arrayBuffer(storageKeyData));
    

    //USING ATC CALL THE CREATE CONTRACT METHOD
    atc.addMethodCall({
        appID: PRICE_PAIR_CONTRACT_ID,
        method: contract.getMethodByName('send_request'),
        methodArgs: [
            Buffer.from(price_pair_name),
            reqKey,
        ],
        sender: sender,
        signer: signer,
        suggestedParams,
        appForeignApps:[GORA_CONTRACT_ID],
        boxes: [
            {
                appIndex: GORA_CONTRACT_ID,
                name: storageKey,
            },
            {
                appIndex: GORA_CONTRACT_ID,
                name: new Uint8Array(Buffer.from(price_pair_name)),
            },
            {
              appIndex: PRICE_PAIR_CONTRACT_ID,
              name: new Uint8Array(Buffer.from("req"+price_pair_name)),
            },
        ]
    });

    // example: ATC_RESULTS
    await atc.execute(algodClient, 4);
    await sleep(15000);

    let oracle_response = await algodClient.getApplicationBoxByName(PRICE_PAIR_CONTRACT_ID,Buffer.from(price_pair_name)).do()
    return(unpackNumber(Buffer.from(oracle_response.value)))
    
}
