import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tooltip from './Tooltip'
import Trollbox from './Trollbox'

// import DomainProfileComments from './DomainProfileComments'

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

    return (
      <div className='DomainProfileInfo BoxFrame'>
        <span className='BoxFrameLabel ui grid'>COMMENT BOX <Tooltip info={'Simple site analytics, provided by Alexa'} /></span>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <Trollbox
              channel={`adchainRegistry:v001/${domain}`}
            />
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
