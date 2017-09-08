import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import Trollbox from './Trollbox'

import DomainProfileComments from './DomainProfileComments'

import './DomainProfileInfo.css'

class DomainProfileInfo extends Component {
  constructor (props) {
    super()

    const {
      domain,
      description
    } = props

    this.state = {
      domain,
      description
    }
  }

  render () {
    const {
      domain
    } = this.state

    const description = null

    const joinedDate = null
    const adtStaked = null
    const wins = null
    const losses = null

    return (
      <div className='DomainProfileInfo BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='Header'>
              Description
            </div>
            <div className='Content'>
              <p>{description ? description : '-'}</p>
            </div>
          </div>
          <div className='column five wide'>
            <div className='Header'>
              Joined the adChain Registry
            </div>
            <div className='Content'>
              <p>{joinedDate ? joinedDate : '-'}</p>
            </div>
          </div>
          <div className='column five wide'>
            <div className='Header'>
              Latest Application Fee
            </div>
            <div className='Content'>
              <p>{adtStaked ? commafy(adtStaked) : '-'} ADT</p>
            </div>
          </div>
          <div className='column five wide'>
            <div className='Header'>
              Challenges (<span className='green'>Win</span> / <span className='red'>Loss</span>)
            </div>
            <div className='Content'>
              <span className='green'>{wins ? commafy(wins) : '-'}</span> / <span className='red'>{losses ? commafy(losses) : '-'}</span>
            </div>
          </div>
          <div className='column sixteen wide'>
            <div className='Header'>
              Trollbox for {domain}
            </div>
            <Trollbox
              channel={domain}
            />
          </div>
          <div className='column sixteen wide'>
            <DomainProfileComments domain={domain} />
          </div>
        </div>
      </div>
    )
  }
}

DomainProfileInfo.propTypes = {
  domain: PropTypes.string,
  description: PropTypes.string
}

export default DomainProfileInfo
