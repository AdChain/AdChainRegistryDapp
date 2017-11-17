import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import toastr from 'toastr'
import moment from 'moment'
import { Popup } from 'semantic-ui-react'

import Countdown from './CountdownText'
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
      currentDeposit: null,
      inProgress: false
    }
  }

  componentDidMount () {
    this._isMounted = true

    this.getMinDeposit()
    this.getListing()
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      applicationExpiry,
      minDeposit,
      inProgress
    } = this.state

    const stageEndMoment = applicationExpiry ? moment.unix(applicationExpiry) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('YYYY-MM-DD HH:mm:ss') : '-'

    return (
      <div className='DomainChallengeContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              IN APPLICATION
              <Popup
                trigger={<i className='icon info circle' />}
                content='ADT holders are encouraged to challenge publisher applications where the token holders believe the Publisher to be fraudulent.'
              />
            </div>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <div className='ui message info'>
              <p>Challenge stage ends</p>
              <p><strong>{stageEnd}</strong></p>
              <p>Remaining time: <Countdown
                endDate={stageEndMoment}
                onExpire={this.onCountdownExpire.bind(this)} /></p>
            </div>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <form className='ui form'>
              <div className='ui field'>
                <label>Challenge {domain}</label>
              </div>
              <div className='ui field'>
                <div className='ui message default'>
                  <p>Minimum deposit required</p>
                  <p><strong>{minDeposit ? commafy(minDeposit) : '-'} ADT</strong></p>
                </div>
              </div>
              <div className='ui field'>
                <button
                  onClick={this.onChallenge.bind(this)}
                  className='ui button purple right labeled icon'>
                  CHALLENGE
                  <i className='icon thumbs down' />
                </button>
              </div>
            </form>
          </div>
        </div>
        {inProgress ? <DomainChallengeInProgressContainer /> : null}
      </div>
    )
  }

  async getMinDeposit () {
    if (this._isMounted) {
      this.setState({
        minDeposit: (await registry.getMinDeposit()).toNumber()
      })
    }
  }

  async getListing () {
    const {domain} = this.state
    const listing = await registry.getListing(domain)

    const {
      applicationExpiry,
      currentDeposit
    } = listing

    if (this._isMounted) {
      this.setState({
        applicationExpiry,
        currentDeposit
      })
    }
  }

  onChallenge (event) {
    event.preventDefault()

    this.challenge()
  }

  async challenge () {
    const {domain} = this.state

    let inApplication = null

    try {
      inApplication = await registry.applicationExists(domain)
    } catch (error) {
      toastr.error(error)
    }

    if (inApplication) {
      if (this._isMounted) {
        this.setState({
          inProgress: true
        })
      }

      try {
        await registry.challenge(domain)

        toastr.success('Successfully challenged domain')

        if (this._isMounted) {
          this.setState({
            inProgress: false
          })
        }

        // TODO: better way of resetting state
        setTimeout(() => {
          window.location.reload()
        }, 2e3)
      } catch (error) {
        toastr.error(error.message)
        if (this._isMounted) {
          this.setState({
            inProgress: false
          })
        }
      }
    } else {
      toastr.error('Domain not in application')
    }
  }

  onCountdownExpire () {
    // allow some time for new block to get mined and reload page
    setTimeout(() => {
      window.location.reload()
    }, 15000)
  }
}

DomainChallengeContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainChallengeContainer
