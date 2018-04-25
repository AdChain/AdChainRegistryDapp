import React from 'react'

export const AirSwap = () => {
    return (
        <div>
            <button onClick={() => { renderAirSwap() }}>AIR SWAP</button>
        </div>
    )
}

const renderAirSwap = () => {
    try{
        window.AirSwap.Trader.render({
            mode: 'buy',
            amount: '10000',
            token: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
            env: 'production',
            onCancel: function () {
                console.info('Trade was canceled.');
            },
            onComplete: function(transactionId, makerAmount, makerToken, takerAmount, takerToken) {
                alert('Trade complete. Thank you, come again.');
            }
        }, 'header');
    }catch(error){
        console.log(error)
    }
}
