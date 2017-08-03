import React, { Component } from 'react'
import commafy from 'commafy'

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

    const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porttitor vestibulum tristique. Ut quis faucibus diam. Morbi tincidunt lacus a velit pretium, id mollis ante volutpat.'

    const joinedDate = 'June 18th, 2017'
    const adtStaked = 14354
    const wins = 5
    const losses = 0

    return (
      <div className='DomainProfileInfo BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='Header'>
              Description
            </div>
            <div className='Content'>
              <p>{description}</p>
            </div>
          </div>
          <div className='column five wide'>
            <div className='Header'>
              Joined the adChain Registry
            </div>
            <div className='Content'>
              <p>{joinedDate}</p>
            </div>
          </div>
          <div className='column five wide'>
            <div className='Header'>
              Latest Application Fee
            </div>
            <div className='Content'>
              <p>{commafy(adtStaked)} ADT</p>
            </div>
          </div>
          <div className='column five wide'>
            <div className='Header'>
              Challenges (<span className='green'>Win</span> / <span className='red'>Loss</span>)
            </div>
            <div className='Content'>
              <span className='green'>{wins}</span> / <span className='red'>{losses}</span>
            </div>
          </div>
          <div className='column sixteen wide'>
            <DomainProfileComments domain={domain} />
          </div>
        </div>
      </div>
    )
  }
}

export default DomainProfileInfo
