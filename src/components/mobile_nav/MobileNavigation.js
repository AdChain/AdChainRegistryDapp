import React from 'react'
import './MobileNavigation.css'

export const MobileNavigation = (props) => {
    const Link = props.Link

    return (
        <div className='MobileNavigation'>
            <Link to='/domains'>
                <img src="/static/media/WWW.4e7ac200.svg" alt="www" />
                <br/>
                DOMAINS
            </Link>
            <div>APPLY</div>
            <div>ADTOKEN</div>
            <Link to='governance'>
                <img src="/static/media/PARAMETERS.00dcd7a8.svg" alt="governance" />
                <br/>
                    GOVERNANCE
            </Link>
        </div>

    )
}