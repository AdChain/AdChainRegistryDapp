import React, { Component } from 'react'

import './DomainNoActionContainer.css'

class DomainNoActionContainer extends Component {
  constructor (props) {
    super()

    this.state = {

    }
  }

  render () {
    return (
      <div className='DomainNoActionContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              In Registry
            </div>
          </div>
          <div className='column sixteen wide'>
            <p>Domain is in adChain Registry.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default DomainNoActionContainer
