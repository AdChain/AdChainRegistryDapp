import React from 'react'
import Tooltip from '../Tooltip'
import {renderAirSwap} from '../../utils/renderAirSwap'

export const AirSwap = () => {
    return (
        <div className='DomainEmailNotifications BoxFrame mobile-hide'>
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

