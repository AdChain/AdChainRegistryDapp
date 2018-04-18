import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import Tooltip from '../Tooltip'
import './DomainNotInRegistryContainer.css'
import registry from '../../services/registry'
// import toastr from 'toastr'

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
      <div className='DomainNotInRegistryContainer'>
        <div className='ui grid stackable DomainNotInRegistryBody'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
              Stage: None
                <Tooltip
                  info='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                />
              </div>
              <Button
                basic
                className='right refresh'
                onClick={() => this.updateStatus(domain)}
              >
                Refresh
              </Button>
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

  async updateStatus (domain) {
    try {
      await registry.updateStatus(domain)
    } catch (error) {
      try {
        console.log(error)
      } catch (err) {
        console.log(err)
      }
    }
  }
}

DomainNotInRegistryContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainNotInRegistryContainer
