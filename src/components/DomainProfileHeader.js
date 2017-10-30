import React from 'react'
import PropTypes from 'prop-types'
import { Popup } from 'semantic-ui-react'

// import Identicon from './Identicon'

import './DomainProfileHeader.css'

function DomainProfileHeader (props) {
  const {
    domain,
    name,
    description,
    country
    // image
  } = props

  return (
    <div className='DomainProfileHeader BoxFrame overflow-x'>
      {/*
      <div className='ui image'>
        {image ? <img src={image} alt='' /> : <Identicon address={domain} size={8} scale={8} />}
      </div>
      */}
      <div className='Content'>
        <div className='Header'>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={`http://${domain}`}>
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}`}
              width={16}
              alt=''
            />
            {domain}
            <i className='icon external tiny' />
          </a>
        </div>
        <div className='SubHeader'>
          <div className='Name' title="Website title">
            <em>{name ? name : <span>(no title)</span>}</em>
            <Popup
              trigger={<i className='icon info circle' />}
              content='Title displayed on website'
            />
          </div>
          <div className='Description' title="Website description">
            <em>{description ? description : <span>(no description)</span>}</em>
            <Popup
              trigger={<i className='icon info circle' />}
              content='Description displayed on website'
            />
          </div>
          {country ?
            <div className='Country'>
              <i className='icon marker' /> {country}
            </div>
          : null}
        </div>
      </div>
    </div>
  )
}

DomainProfileHeader.propTypes = {
  domain: PropTypes.string,
  name: PropTypes.string,
  country: PropTypes.string
  // image: PropTypes.string
}

export default DomainProfileHeader
