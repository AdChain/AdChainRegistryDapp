import React, { Component } from 'react'

import PublisherApplicationForm from './PublisherApplicationForm'
import PublisherApplicationInfo from './PublisherApplicationInfo'

class ApplicationContainer extends Component {
  render () {
    return (
      <div className='ApplicationContainer'>
        <div className='ui grid stackable padded'>
          <div className='column eight wide'>
            <PublisherApplicationForm />
          </div>
          <div className='column eight wide'>
            <PublisherApplicationInfo />
          </div>
        </div>
      </div>
    )
  }
}

export default ApplicationContainer
