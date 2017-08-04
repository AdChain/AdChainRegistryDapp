import React from 'react'

import Identicon from './Identicon'

import './DomainProfileHeader.css'

function DomainProfileHeader (props) {
  const {
    domain,
    name,
    country,
    image
  } = props

  return (
    <div className='DomainProfileHeader BoxFrame'>
      <div className='ui image'>
        {image ? <img src={image} alt='' /> : <Identicon address={domain} size={8} scale={8} />}
      </div>
      <div className='Content'>
        <div className='Header'>
          {domain}
        </div>
        <div className='SubHeader'>
          <div className='Name'>
            {name}
          </div>
          <div className='Country'>
            <i className='icon marker' /> {country}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DomainProfileHeader
