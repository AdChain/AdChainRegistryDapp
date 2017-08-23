import React, { Component } from 'react'
import commafy from 'commafy'
import toastr from 'toastr'
import moment from 'moment'

import registry from '../services/registry'

import './DomainChallengeContainer.css'

class DomainChallengeContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      applicationExpiry: null,
      minDeposit: null
    }

    this.getMinDeposit()
    this.getListing()
  }

  render () {
    const {
      applicationExpiry,
      minDeposit
    } = this.state

    const stageEnd = applicationExpiry ? moment.unix(applicationExpiry).calendar() : '-'

    return (
      <div className='DomainChallengeContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              IN APPLICATION
            </div>
          </div>
          <div className='column sixteen wide'>
            <p>ADT holders are encouraged to challenge publisher applications where the token holders believe the Publisher to be fraudulent.</p>
          </div>
          <div className='column sixteen wide center aligned'>
            <div className='ui divider' />
            <p>Challenge stage ends</p>
            <p><strong>{stageEnd}</strong></p>
            <div className='ui divider' />
          </div>
          <div className='column sixteen wide center aligned'>
            <p>{minDeposit ? commafy(minDeposit) : '-'} ADT needed to Challenge</p>
          </div>
          <div className='column sixteen wide center aligned'>
            <button
              onClick={this.onChallenge.bind(this)}
              className='ui button purple'>
              CHALLENGE
            </button>
          </div>
        </div>
      </div>
    )
  }

  async getMinDeposit () {
    this.setState({
      minDeposit: await registry.getMinDeposit()
    })
  }

  async getListing () {
    const {domain} = this.state
    const listing = await registry.getListing(domain)

    const {
      applicationExpiry
    } = listing

    this.setState({
      applicationExpiry
    })
  }

  onChallenge (event) {
    event.preventDefault()

    this.challenge()
  }

  async challenge () {
    const {domain} = this.state
    const inApplication = await registry.applicationExists(domain)

    if (inApplication) {
      try {
        await registry.challenge(domain)

        toastr.success('Challenged')
      } catch (error) {
        toastr.error(error)
      }
    } else {
      toastr.error('Domain not in application')
    }
  }
}

export default DomainChallengeContainer
