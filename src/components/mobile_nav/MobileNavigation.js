import React from 'react'
import './MobileNavigation.css'
import { mobileNavData } from '../../models/mobileNav'

export const MobileNavigation = (props) => {
    const Link = props.Link

    let view = mobileNavData.map((x,i) => {
        if (x.type === 'Link') {
            return (
                <Link key={i} to={x.link}>
                    <img src={x.img} alt={x.alt} />
                    <br />
                    <span>{x.name}</span>
                </Link>
            )
        } else {
            return (
                <div key={i} onClick={x.action}>
                    <img src={x.img} alt={x.alt} />
                    <br />
                    <span>{x.name}</span>
                </div>
            )
        }
    })

    return (
        <div className='MobileNavigation'>
            {view}
        </div>
    )
}

