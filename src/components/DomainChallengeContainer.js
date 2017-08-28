import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'
import moment from 'moment'

import registry from '../services/registry'
import DomainChallengeInProgressContainer from './DomainChallengeInProgressContainer'

import './DomainChallengeContainer.css'

class DomainChallengeContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      applicationExpiry: null,
      minDeposit: null,
      inProgress: false
    }

    this.getMinDeposit()
    this.getListing()
  }

  render () {
    const {
      applicationExpiry,
      minDeposit,
      inProgress
    } = this.state

    const stageEnd = applicationExpiry ? moment.unix(applicationExpiry).format('YYYY-MM-DD HH:mm:ss') : '-'

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
        {inProgress ? <DomainChallengeInProgressContainer /> : null}
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
      this.setState({
        inProgress: true
      })

      try {
        await registry.challenge(domain)

        toastr.success('Challenged')
        this.setState({
          inProgress: false
        })
      } catch (error) {
        toastr.error(error)
        this.setState({
          inProgress: false
        })
      }
    } else {
      toastr.error('Domain not in application')
    }
  }
}

DomainChallengeContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainChallengeContainer
