import React, { Component } from 'react'
import toastr from 'toastr'
import isValidDomain from 'is-valid-domain'
import isValidEmail from 'is-valid-email'
import commafy from 'commafy'

import registry from '../services/registry'

import './PublisherApplicationForm.css'

class PublisherApplicationForm extends Component {
  constructor (props) {
    super()

    this.state = {
      minDeposit: '-'
    }

    this.history = props.history

    this.getMinDeposit()
  }

  async getMinDeposit () {
    this.setState({
      minDeposit: await registry.getParameter('minDeposit')
    })
  }

  render () {
    const {minDeposit} = this.state

    return (
      <div className='PublisherApplicationForm BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide left aligned'>
            <div className='ui large header'>
              Publisher Application
            </div>
          </div>
          <div className='column sixteen wide left aligned'>
            <p>Please complete the information below in order to apply to the adChain Registry.
          Remember, the total ADT staked on your behalf will be the exact amount needed
          for adToken holders to challenge your application.
            </p>
          </div>
          <div className='column sixteen wide left aligned'>
            <form
              onSubmit={this.onFormSubmit.bind(this)}
              className='ui form'>
              <div className='field required'>
                <label>Domain</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='example.com'
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
                <label>Total ADT to Stake (Min: {commafy(minDeposit)} ADT)</label>
                <div className='ui input'>
                  <input
                    type='text'
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
      </div>
    )
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
    const {minDeposit} = this.state

    if (!isValidDomain(domain)) {
      toastr.error('Invalid domain')
      return false
    }

    if (email && !isValidEmail(email)) {
      toastr.error('Invalid email')
      return false
    }

    if (!stake || stake < minDeposit) {
      toastr.error('Deposit must be equal or greater than the minimum required')
      return false
    }

    try {
      await registry.apply(domain, stake)
    } catch (error) {
      console.error(error)
      toastr.error(error.message)
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

    this.history.push('/domains')
  }

  // TODO save to DB
  save (data) {
    toastr.success('Submitted')
    return Promise.resolve()
  }
}

export default PublisherApplicationForm
