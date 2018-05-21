import React from 'react'
import './MobileNavigation.css'
import { renderAirSwap } from '../../utils/renderAirSwap'
import governanceIcon from "../../components/assets/governance_icon.svg"
import applyIcon from "../../components/assets/apply_icon.svg"
import domainsIcon from "../../components/assets/domains_icon.svg"
import adtokenIcon from "../../components/assets/adtoken_icon.svg"

export const MobileNavigation = (props) => {
    const Link = props.Link

    return (
        <div className='MobileNavigation'>
            <Link to='/domains'>
                <img src={domainsIcon} alt="www" />
                <br />
                <span>DOMAINS</span>
            </Link>
            <div>
                <img src={applyIcon} alt="governance" />
                <br />
                <span>APPLY</span>
            </div>
            <div onClick={() => { renderAirSwap() }}>
                <img src={adtokenIcon} alt="adtoken" />

                <span>ADTOKEN</span>
            </div>
            <Link to='governance'>
                <img src={governanceIcon} alt="gov" />
                <br />
                <span>GOVERNANCE</span>
            </Link>
        </div>

    )
}