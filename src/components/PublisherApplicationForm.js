import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import isValidDomain from 'is-valid-domain'
import isValidEmail from 'is-valid-email'
import commafy from 'commafy'
import qs from 'qs'

import postJson from '../utils/postJson'
import registry from '../services/registry'
import PublisherApplicationFormInProgress from './PublisherApplicationFormInProgress'

import './PublisherApplicationForm.css'

class PublisherApplicationForm extends Component {
  constructor (props) {
    super()

    const query = qs.parse(document.location.search.substr(1))

    this.state = {
      minDeposit: '-',
      domain: query.domain,
      inProgress: false
    }

    this.history = props.history
    this.onMinDepositClick = this.onMinDepositClick.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  componentWillMount () {
    this.getMinDeposit()
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      minDeposit,
      domain,
      inProgress
    } = this.state

    return (
      <div className='PublisherApplicationForm BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide left aligned'>
            <div className='ui large header'>
              Publisher Application
            </div>
          </div>
          <div className='column sixteen wide left aligned'>
            <p>Please complete the information below in order to apply a domain to the adChain Registry.&nbsp;
            <a href="https://adchain.zendesk.com/hc/en-us/articles/115003191014-Applying-a-Domain"
                target='_blank'
                rel='noopener noreferrer'>
                Learn More
                <i className='icon external tiny'></i>
              </a>
            </p>
          </div>
          <div className='column sixteen wide left aligned'>
            <form
              onSubmit={this.onFormSubmit}
              className='ui form'>
              <div className='field required'>
                <label>Domain</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='example.com'
                    defaultValue={domain}
                    name='domain'
                    required
                  />
                </div>
              </div>
              <div className='field'>
                <label>Site Name</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='Site Name'
                    name='siteName'
                  />
                </div>
              </div>
              <div className='field'>
                <label>Country Based In</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='United States'
                    name='country'
                  />
                </div>
              </div>
              <div className='two fields'>
                <div className='field'>
                  <label>First Name</label>
                  <div className='ui input'>
                    <input
                      type='text'
                      placeholder='John'
                      name='firstName'
                    />
                  </div>
                </div>
                <div className='field'>
                  <label>Last Name</label>
                  <div className='ui input'>
                    <input
                      type='text'
                      placeholder='Doe'
                      name='lastName'
                    />
                  </div>
                </div>
              </div>
              <div className='field'>
                <label>Email Address</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='john@example.com'
                    name='email'
                  />
                </div>
              </div>
              <div className='field required'>
                <label>Total ADT to Stake (Min: <a href='#!' onClick={this.onMinDepositClick}>{commafy(minDeposit)} ADT</a>)</label>
                <div className='ui input'>
                  <input
                    type='text'
                    id='PublisherApplicationFormStakeInput'
                    placeholder={minDeposit}
                    name='stake'
                    required
                  />
                </div>
              </div>
              <div className='field'>
                <button
                  type='submit'
                  className='ui blue submit button'>
                  APPLY
                </button>
              </div>
            </form>
          </div>
        </div>
        {inProgress ? <PublisherApplicationFormInProgress /> : null}
      </div>
    )
  }

  async getMinDeposit () {
    const minDeposit = await registry.getMinDeposit()

    if (this._isMounted) {
      this.setState({
        minDeposit: minDeposit.toNumber()
      })
    }
  }

  onMinDepositClick (event) {
    event.preventDefault()

    const input = document.querySelector('#PublisherApplicationFormStakeInput')

    if (input) {
      input.value = this.state.minDeposit
    }
  }

  async onFormSubmit (event) {
    event.preventDefault()

    const {target} = event

    const domain = target.domain.value
    const siteName = target.siteName.value
    const country = target.country.value
    const firstName = target.firstName.value
    const lastName = target.lastName.value
    const email = target.email.value
    const stake = parseInt(target.stake.value.replace(/[^\d]/, ''), 10)
    const minDeposit = (this.state.minDeposit | 0) // coerce

    if (!isValidDomain(domain)) {
      toastr.error('Invalid domain')
      return false
    }

    if (email && !isValidEmail(email)) {
      toastr.error('Invalid email')
      return false
    }

    if (!(stake && stake >= minDeposit)) {
      toastr.error('Deposit must be equal or greater than the minimum required')
      return false
    }

    if (this._isMounted) {
      this.setState({
        inProgress: true
      })
    }

    try {
      await registry.apply(domain, stake)
    } catch (error) {
      toastr.error(error.message)
      if (this._isMounted) {
        this.setState({
          inProgress: false
        })
      }
      return false
    }

    await this.save({
      domain,
      siteName,
      country,
      firstName,
      lastName,
      email,
      stake
    })

    if (this._isMounted) {
      this.setState({
        inProgress: false
      })
    }

    this.history.push(`/domains?domain=${domain}`)
  }

  async save (data) {
    const url = 'https://adchain-registry-api.metax.io/applications'

    const payload = {
      domain: data.domain,
      site_name: data.siteName,
      country: data.country,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      account: registry.getAccount()
    }

    try {
      await postJson(url, payload)
    } catch (error) {
      toastr.error(error.message)
      console.error(error)
    }
  }
}

PublisherApplicationForm.propTypes = {
  history: PropTypes.object
}

export default PublisherApplicationForm
