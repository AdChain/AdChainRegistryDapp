import React from 'react'
import './MobileApplication.css'

export const MobileApplication = () => {

    return(
        <div className="MobileApplication">
            <span className='fw-600'>Enter Domain</span><br/>
            <input type='text' placeholder='domain.com'/>
            <br/>
            <span className='fw-600'>Enter Application Reasoning</span>
            <br/>
            <input type='text' placeholder='15 character minimum'/>
            <br/>
            <span>
                The {'1500'} ADT staked will remain with the domain applied until it is ether rejected or withdrawn.
            </span>
            <button className='big-blue'>APPLY DOMAIN</button><button className='big-white'>CANCEL</button>
        </div>
    )
    
}