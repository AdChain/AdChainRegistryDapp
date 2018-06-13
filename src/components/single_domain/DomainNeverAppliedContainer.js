import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { Button } from 'semantic-ui-react'
import Tooltip from '../Tooltip'
// import './DomainNeverAppliedContainer.css'
// import registry from '../../services/registry'
// import toastr from 'toastr'

class DomainNeverAppliedContainer extends Component {
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
      <div className='DomainNeverAppliedContainer'>
        <div className='ui grid stackable DomainNotInRegistryBody'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
                Stage: Never Applied
                <Tooltip
                  info='This domain has never been applied to the registry.'
                />
              </div>
            </div>
            <div className='ui divider' />
          </div>
          <div className='column sixteen wide center aligned'>
            <p className='NotInRegistryMessage'>
              You can apply <strong>{domain}</strong> into the
              adChain Registry within the application modal
              on the left navigation column.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

DomainNeverAppliedContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainNeverAppliedContainer
