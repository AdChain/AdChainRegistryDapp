import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'

import registry from '../services/registry'
import './DomainInRegistryContainer.css'

class DomainInRegistryContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      didReveal: false
    }

    this.getPoll()
    this.getReveal()
  }

  async getReveal () {
    const {domain} = this.state

    try {
      const didReveal = await registry.didReveal(domain)

      this.setState({
        didReveal: didReveal
      })
    } catch (error) {
      toastr.error(error)
    }
  }

  async getPoll () {
    const {domain} = this.state

    try {
      const {
        votesFor,
        votesAgainst
      } = await registry.getChallengePoll(domain)

      this.setState({
        votesFor,
        votesAgainst
      })
    } catch (error) {

    }
  }

  render () {
    const {
      votesFor,
      votesAgainst,
      didReveal
    } = this.state

    return (
      <div className='DomainInRegistryContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              In Registry
            </div>
          </div>
          {didReveal ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>revealed</strong> for this domain.
            </div>
          </div>
          : null}
          <div className='column sixteen wide'>
            <p>Domain is in adChain Registry.</p>
          </div>

          <div className='column sixteen wide'>
            <p>Votes For: <strong>{commafy(votesFor || 0)} ADT</strong></p>
            <p>Votes Against: <strong>{commafy(votesAgainst || 0)} ADT</strong></p>
          </div>
        </div>
      </div>
    )
  }
}

DomainInRegistryContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainInRegistryContainer
