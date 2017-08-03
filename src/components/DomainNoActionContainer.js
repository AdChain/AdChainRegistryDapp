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
            <strong>In Registry</strong>
          </div>
        </div>
      </div>
    )
  }
}

export default DomainNoActionContainer
