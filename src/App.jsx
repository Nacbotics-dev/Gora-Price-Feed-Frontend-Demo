import algosdk from 'algosdk';
import { useState } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import ConnectButton,{CreateBoxButton,GetPricePair} from './Components/Button';
import { GORA_CONTRACT_ID,PRICE_PAIR_CONTRACT_ID } from './Components/ContractCalls';
import { WalletProvider, useInitializeProviders, PROVIDER_ID } from '@txnlab/use-wallet';




export default function App() {
    const [pricePair,setPricePair] = useState("");
    const [oracleResult,setOracleResult] = useState(null);
    
    const [canFetchPricePair,setCanFetchPricePair] = useState(false)
    const providers = useInitializeProviders({
        providers: [
            { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
        ],
        nodeConfig: {
            network: 'testnet',
            nodeServer: 'https://testnet-api.algonode.cloud',
            nodeToken: '',
            nodePort: '443'
        },
        algosdkStatic: algosdk,
    })


    



    return (
        <WalletProvider value={providers}>
            <div className='min-h-screen flex flex-col space-y-5 place-content-center place-items-center'>
                <div className='w-full max-w-sm [30rem] mx-auto'>
                    <h2 className='font-semibold text-2xl'>GORA TESTNET APP ID : {GORA_CONTRACT_ID}</h2>
                    <h2 className='font-semibold text-2xl'>PRICE PAIR TESTNET APP ID : {PRICE_PAIR_CONTRACT_ID}</h2>

                    <a target="_blank"  rel="noreferrer" href="https://github.com/Nacbotics-dev/Gora-Price-Feed-Frontend-Demo" className='font-medium text-lg text-center text-green-500'>View source code on github</a>
                </div>

                <div className='max-w-sm w-full rounded-sm mx-auto flex flex-col space-y-10'>
                    <ConnectButton/>
                    <div className='flex flex-col space-y-2 w-full'>
                        <label htmlFor="pricepairs" className='font-medium text-lg'>Price Pair</label>
                        <select onChange={(e)=>{setPricePair(e.target.value)}} value={pricePair} name="pricepairs" id="pricepairs" className='outline-none border-gray-300 rounded-md px-3 py-5 cursor-pointer border-2'>
                            <option value="">Select A Price Pair</option>
                            <option value="btc/usd">btc/usd</option>
                        </select>
                    </div>


                    {pricePair && oracleResult && <div>
                         <h3 className='font-bold text-lg'>{pricePair.toLocaleUpperCase()} PRICE : <span>${oracleResult}</span></h3>
                    </div>}

                    <CreateBoxButton pricePair={pricePair} setCanFetchPricePair={setCanFetchPricePair}/>
                    <GetPricePair pricePair={pricePair} setOracleResult={setOracleResult} canFetchPricePair={canFetchPricePair}/>

                    
                </div>
            </div>
        </WalletProvider>
    )
}