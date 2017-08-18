import React, { Component } from 'react'

import PublisherApplicationForm from './PublisherApplicationForm'
import PublisherApplicationInfo from './PublisherApplicationInfo'
import RegistryStatsbar from './RegistryStatsbar'

import './ApplicationContainer.css'

class ApplicationContainer extends Component {
  constructor (props) {
    super()

    this.history = props.history
  }

  render () {
    return (
      <div className='ApplicationContainer'>
        <div className='ui grid stackable padded'>
          <div className='column eight wide'>
            <PublisherApplicationForm history={this.history} />
          </div>
          <div className='column eight wide'>
            <div className='row'>
              <PublisherApplicationInfo />
            </div>
            <div className='row'>
              <RegistryStatsbar showHeader={true} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ApplicationContainer
