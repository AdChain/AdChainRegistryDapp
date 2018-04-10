import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from '../Tooltip'
import './DomainProfileHeader.css'

function DomainProfileHeader (props) {
  const {
    domain,
    name,
    description,
    country
  } = props

  return (
    <div className='DomainProfileHeader BoxFrame overflow-x' style={{padding: '9px'}}>
      <div className='Content'>
        <div className='Header'>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={`http://${domain}`}>
            <img
              style={{marginTop: '-3px'}}
              src={`https://www.google.com/s2/favicons?domain=${domain}`}
              width={16}
              alt=''
            />
            {domain}
          </a>
        </div>
        <div className='SubHeader'>
          <div className='Name' title='Website title'>
            <span>{name || <span>(no title)</span>}</span>
            <Tooltip
              info='Title displayed on website'
            />
          </div>
          <div className='Description' title='Website description'>
            <span>{description || <span>(no description)</span>}</span>
            <Tooltip
              info='Description displayed on website'
            />
          </div>
          {country
            ? <div className='Country'>
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
