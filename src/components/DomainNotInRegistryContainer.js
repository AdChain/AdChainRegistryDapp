import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Popup } from 'semantic-ui-react'

import ClaimRewardContainer from './ClaimRewardContainer'
import './DomainNotInRegistryContainer.css'

class DomainNotInRegistryContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain
    }

  }

  render () {
    const {
      domain
    } = this.state

    return (
      <div className='DomainInRegistryContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              APPLY
              <Popup
                trigger={<i className='icon info circle'></i>}
                content='Apply domain to be included into adChain Registry.'
              />
            </div>
          </div>
          <div className='column sixteen wide center aligned'>
            <a href={`/apply?domain=${domain}`} className='ui button blue'>Apply to Registry</a>
          </div>
          <div className='ui divider' />,
          <div className='column sixteen wide center aligned'>
            <ClaimRewardContainer domain={domain} />
          </div>
        </div>
      </div>
    )
  }
}

DomainNotInRegistryContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainNotInRegistryContainer
