import React, { Component } from 'react'

export const AirSwap = () => {
    return (
        <div>
            <button onClick={() => { renderAirSwap() }}>AIR SWAP</button>
        </div>
    )
}

const renderAirSwap = () => {
    debugger
    try{
        AirSwap.Trader.render({
            onComplete: function(transactionId, makerAmount, makerToken, takerAmount, takerToken) {
                alert('Trade complete. Thank you, come again.')
            }
        }, 'body')
    }catch(error){
        console.log(error)
    }
}
