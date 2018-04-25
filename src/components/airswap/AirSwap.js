import React from 'react'
import Tooltip from '../Tooltip'

export const AirSwap = () => {
    return (

        <div className='DomainEmailNotifications BoxFrame'>
            <div className='ui grid stackable'>
                <div className='DomainEmailNotificationsContainer column sixteen wide'>
                    <span className='BoxFrameLabel ui grid'>BUY ADTOKEN <Tooltip class='InfoIconHigh' info={'Easily trade Etheruem for adToken through AirSwap widget.'} /></span>
                    <div className='t-center pt-10'>
                        <p>ADT is required to use the adChain Registry. Purchase ADT below with AirSwap.</p>
                        <button className='ui blue button' onClick={() => { renderAirSwap() }}>PURCHASE ADTOKEN</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const renderAirSwap = () => {
    try {
        window.AirSwap.Trader.render({
            mode: 'buy',
            amount: '0',
            env: 'production',
            token: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
            onCancel: function () {
                console.info('Trade was cancelled.');
            },
            onComplete: function (transactionId, makerAmount, makerToken, takerAmount, takerToken) {
                alert('Trade complete. Thank you, come again.');
            }
        }, 'body');
    } catch (error) {
        console.log(error)
    }
}
