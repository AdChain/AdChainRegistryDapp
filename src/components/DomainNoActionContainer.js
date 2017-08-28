import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'

import registry from '../services/registry'
import './DomainNoActionContainer.css'

// TODO
// rename this to DomainInRegistryContainer
class DomainNoActionContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain
    }

    this.getPoll()
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
      votesAgainst
    } = this.state

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

          <div className='column sixteen wide'>
            <p>Votes For: <strong>{commafy(votesFor)} ADT</strong></p>
            <p>Votes Against: <strong>{commafy(votesAgainst)} ADT</strong></p>
          </div>
        </div>
      </div>
    )
  }
}

DomainNoActionContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainNoActionContainer
