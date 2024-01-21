/* eslint-disable react/prop-types */
import { useState } from "react";
import Loader from "./Loader/Loader";
import { useWallet } from "@txnlab/use-wallet";
import { create_oracle_request_params,fetch_token_price_from_oracle } from "./ContractCalls";


export default function ConnectButton() {
    const { activeAccount,providers } = useWallet();

    const connectWallet =()=>{
        const provider = providers[0]
        
        if (provider.isConnected) {
            provider.disconnect()
        } else {
            provider.connect()
            provider.setActiveProvider();
            
        }
        
    }


    return (
        <button onClick={connectWallet} className='px-3 py-5 w-full rounded-md bg-black border-2 border-white text-white font-medium'>{activeAccount?.address? <p className='w-full overflow-hidden text-ellipsis'>{activeAccount?.address}</p> : "Connect Wallet"}</button>
    )
}


export function CreateBoxButton({pricePair,setCanFetchPricePair}) {
    const {activeAddress,signer} = useWallet()
    const [isLoading,setIsLoading] = useState(false);


    const createRequestParams = ()=>{
        setIsLoading(true)
        create_oracle_request_params(activeAddress,signer,pricePair).then(()=>{
            setIsLoading(false)
            setCanFetchPricePair(true)
        }).catch((err)=>{
            setIsLoading(false)
            console.log(err,"::::::::::::::::::")
            // TODO :DISPLAY THE ERROR TO THE USER
        })
    }


    return (
        <button onClick={createRequestParams} disabled ={!pricePair || isLoading} className='flex gap-3 place-content-center place-items-center px-3 disabled:text-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed py-5 w-full rounded-md border-black border-2 text-black font-medium'>
            {isLoading && <Loader color={" !border-t-black !border-r-black !border-l-black"}/>}
            Create Request Params Box
        </button>
    )
}





export function GetPricePair({pricePair,setOracleResult,canFetchPricePair}) {
    const {activeAddress,signer} = useWallet();
    const [isLoading,setIsLoading] = useState(false);


    const fetchOraclePricePair = ()=>{
        setIsLoading(true)
        fetch_token_price_from_oracle(activeAddress,signer,pricePair).then((res)=>{
            setIsLoading(false)
            setOracleResult(res)
        }).catch((err)=>{
            setIsLoading(false)
            console.log(err,"::::::::::::::::::")
            // TODO :DISPLAY THE ERROR TO THE USER
        })
    }


    return (
        <button onClick={fetchOraclePricePair} disabled ={!canFetchPricePair || isLoading} className='flex gap-3 place-content-center place-items-center disabled:text-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed px-3 py-5 w-full rounded-md bg-black text-white font-medium'>
            {isLoading && <Loader/>}
            Fetch {pricePair.toLocaleUpperCase()} Price Request
        </button>
    )
}

